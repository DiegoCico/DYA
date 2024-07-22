from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import firebase_admin
from firebase_admin import credentials, firestore
import subprocess
import sys
import json
import os
import tempfile

# Initialize Firebase Admin SDK
service_account_file = os.path.join(os.getcwd(), 'src/backend/serviceAccountKey.json')
if not os.path.exists(service_account_file):
    raise FileNotFoundError(f"{service_account_file} not found. Ensure the file exists and the path is correct.")

with open(service_account_file) as f:
    firebase_config = json.load(f)

cred = credentials.Certificate(firebase_config)
firebase_admin.initialize_app(cred)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

db = firestore.client()

def run_tests(function_name, user_code):
    # Write user code to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as temp_file:
        temp_file.write(user_code.encode())
        temp_file.flush()
        temp_file_name = temp_file.name
    
    # Run the test script
    result = subprocess.run(
        [sys.executable, "test_functions.py", function_name, temp_file_name],
        capture_output=True,
        text=True
    )
    
    # Clean up the temporary file
    os.remove(temp_file_name)
    
    try:
        output = json.loads(result.stdout)
    except json.JSONDecodeError as e:
        return {"success": False, "message": f"Error parsing output: {str(e)}"}
    
    return output

@app.route('/test-function', methods=['POST'])
def test_function():
    try:
        data = request.get_json()
        print(f"Received data: {data}")  # Debugging statement

        if not data:
            print("No data received")
            return jsonify({'success': False, 'message': 'No data received'}), 400

        function_name = data.get('functionName')
        user_id = data.get('userId')
        activity_order = data.get('activityOrder')
        question_id = data.get('questionId')

        if not function_name or not user_id or not activity_order or not question_id:
            print(f"Missing parameters: functionName={function_name}, userId={user_id}, activityOrder={activity_order}, questionId={question_id}")
            return jsonify({'success': False, 'message': 'functionName, userId, activityOrder, and questionId are required'}), 400

        # Fetch user code from Firebase
        doc_ref = db.collection('users').document(user_id).collection('activities').document(str(activity_order)).collection('questions').document(question_id)
        user_doc = doc_ref.get()
        if not user_doc.exists():
            print("Question not found in Firebase")
            return jsonify({'success': False, 'message': 'Question not found in Firebase'}), 404

        user_code = user_doc.to_dict().get('userCode')
        if not user_code:
            print("No user code found in Firebase document")
            return jsonify({'success': False, 'message': 'No user code found in Firebase document'}), 400

        # Run the test script and get the results
        test_results = run_tests(function_name, user_code)
        socketio.emit('test_results', test_results, to=request.sid)  # Emit results in real-time
        
        return jsonify(test_results), 200
    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging statement
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'Pong! The server is running.'}), 200

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5002, debug=True)
