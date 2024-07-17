import os
import json
import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate("src/backend/serviceAccountKey.json")  # Update the path to your service account key
firebase_admin.initialize_app(cred)

app = Flask(__name__)
CORS(app)

db = firestore.client()

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

        if not function_name or not user_id or not activity_index:
            print("Missing functionName, userId, or activityIndex")
            return jsonify({'success': False, 'message': 'functionName, userId, and activityIndex are required'}), 400

        # Fetch user code from Firebase
        doc_ref = db.collection('users').document(user_id)
        user_doc = doc_ref.get()
        if not user_doc.exists:
            print("User not found in Firebase")
            return jsonify({'success': False, 'message': 'User not found in Firebase'}), 400

        user_data = user_doc.to_dict()
        current_activity_index = user_data.get('currentActivity')
        if current_activity_index is None or int(activity_index) != current_activity_index:
            print("Incorrect activity index")
            return jsonify({'success': False, 'message': 'Incorrect activity index'}), 400

        activity_ref = doc_ref.collection('activities').document(str(activity_index))
        activity_doc = activity_ref.get()
        if not activity_doc.exists():
            print("Activity not found in Firebase")
            return jsonify({'success': False, 'message': 'Activity not found in Firebase'}), 400

        user_code = activity_doc.to_dict().get('userCode')
        if not user_code:
            print("No user code found in Firebase document")
            return jsonify({'success': False, 'message': 'No user code found in Firebase document'}), 400

        # Write user code to a temporary file to be used in subprocess
        user_code_file_path = os.path.join(os.getcwd(), 'user_code.py')
        with open(user_code_file_path, 'w') as f:
            f.write(user_code)

        # Ensure the script file path is correct
        script_file_path = os.path.join(os.getcwd(), 'src', 'backend', 'test_functions.py')
        if not os.path.exists(script_file_path):
            print(f"File not found: {script_file_path}")
            return jsonify({'success': False, 'message': f'File not found: {script_file_path}'}), 500

        result = subprocess.run(
            ['python3', script_file_path, function_name, user_code_file_path],
            capture_output=True,
            text=True,
            check=True
        )
        output = json.loads(result.stdout)
        print(f"Subprocess Output: {output}")  # Debugging statement
        return jsonify(output), 200
    except subprocess.CalledProcessError as e:
        print(f"Subprocess Error: {e.stderr}")  # Debugging statement
        return jsonify({'success': False, 'message': e.stderr}), 500
    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging statement
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'Pong! The server is running.'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
