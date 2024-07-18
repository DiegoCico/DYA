import os
import json
import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from multiprocessing import Process, Manager

# Load Firebase configuration from serviceAccountKey.json
service_account_file = os.path.join(os.getcwd(), 'src/backend/serviceAccountKey.json')
if not os.path.exists(service_account_file):
    raise FileNotFoundError(f"{service_account_file} not found. Ensure the file exists and the path is correct.")

with open(service_account_file) as f:
    firebase_config = json.load(f)

# Initialize Firebase Admin SDK
cred = credentials.Certificate(firebase_config)
firebase_admin.initialize_app(cred)

app = Flask(__name__)
CORS(app)

db = firestore.client()

def execute_user_code(code, function_name, return_dict):
    local_vars = {}
    exec(code, {"__builtins__": None}, local_vars)
    if function_name in local_vars:
        return_dict['result'] = local_vars[function_name]()
    else:
        raise Exception(f"Function {function_name} not found in user code")

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
        activity_index = data.get('activityIndex')
        question_id = data.get('questionId')

        if not function_name or not user_id or not activity_index or not question_id:
            print("Missing functionName, userId, activityIndex, or questionId")
            return jsonify({'success': False, 'message': 'functionName, userId, activityIndex, and questionId are required'}), 400

        # Fetch user code from Firebase
        doc_ref = db.collection('users').document(user_id).collection('activities').document(str(activity_index)).collection('questions').document(question_id)
        user_doc = doc_ref.get()
        if not user_doc.exists():
            print("Question not found in Firebase")
            return jsonify({'success': False, 'message': 'Question not found in Firebase'}), 400

        user_code = user_doc.to_dict().get('userCode')
        if not user_code:
            print("No user code found in Firebase document")
            return jsonify({'success': False, 'message': 'No user code found in Firebase document'}), 400

        # Create a manager to store the result
        manager = Manager()
        return_dict = manager.dict()

        # Run user code in a separate process
        process = Process(target=execute_user_code, args=(user_code, function_name, return_dict))
        process.start()
        process.join()

        if 'result' in return_dict:
            return jsonify({'success': True, 'result': return_dict['result']}), 200
        else:
            return jsonify({'success': False, 'message': 'Function execution failed'}), 500
    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging statement
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'Pong! The server is running.'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
