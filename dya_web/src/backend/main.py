import os
import json
import subprocess
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import sys

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

def run_test_script(function_name, user_code):
    # Run the test runner script
    result = subprocess.run(
        [sys.executable, "test_runner.py", function_name, user_code],
        capture_output=True,
        text=True
    )
    
    # Parse the result
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
            print("Missing functionName, userId, activityOrder, or questionId")
            return jsonify({'success': False, 'message': 'functionName, userId, activityOrder, and questionId are required'}), 400

        # Fetch user code from Firebase
        doc_ref = db.collection('users').document(user_id).collection('activities').document(str(activity_order)).collection('questions').document(question_id)
        user_doc = doc_ref.get()
        if not user_doc.exists():
            print("Question not found in Firebase")
            return jsonify({'success': False, 'message': 'Question not found in Firebase'}), 400

        user_code = user_doc.to_dict().get('userCode')
        if not user_code:
            print("No user code found in Firebase document")
            return jsonify({'success': False, 'message': 'No user code found in Firebase document'}), 400

        # Run the test script and get the results
        test_results = run_test_script(function_name, user_code)
        
        return jsonify(test_results), 200
    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging statement
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'Pong! The server is running.'}), 200

@app.route('/export-data', methods=['GET'])
def export_data():
    try:
        users_ref = db.collection('users')
        users = users_ref.stream()
        users_data = {}

        for user in users:
            user_id = user.id
            user_data = user.to_dict()
            user_data['activities'] = []

            print(f"Processing user: {user_id}")  # Debugging statement

            activities_ref = users_ref.document(user_id).collection('activities')
            activities = activities_ref.stream()

            for activity in activities:
                activity_id = activity.id
                activity_data = activity.to_dict()
                activity_data['questions'] = []

                print(f"  Processing activity: {activity_id}")  # Debugging statement

                questions_ref = activities_ref.document(activity_id).collection('questions')
                questions = questions_ref.stream()

                for question in questions:
                    question_data = question.to_dict()
                    activity_data['questions'].append(question_data)

                user_data['activities'].append(activity_data)

            users_data[user_id] = user_data

        return jsonify(users_data), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
