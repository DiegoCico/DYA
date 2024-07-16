from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/test-function', methods=['POST'])
def test_function():
    try:
        data = request.json
        print(f"Received data: {data}")  # Debugging statement

        if not data:
            print("No data received")
            return jsonify({'success': False, 'message': 'No data received'}), 400

        function_name = data.get('functionName')
        user_code = data.get('userCode')

        print(f"Function Name: {function_name}")  # Debugging statement
        print(f"User Code: {user_code}")  # Debugging statement

        if not function_name or not user_code:
            print("Missing functionName or userCode")
            return jsonify({'success': False, 'message': 'functionName and userCode are required'}), 400

        # Writing user code to a temporary file to be used in subprocess
        with open('user_code.py', 'w') as f:
            f.write(user_code)

        result = subprocess.run(
            ['python3', 'backend/test_functions.py', function_name, 'user_code.py'],
            capture_output=True,
            text=True,
            check=True
        )
        output = json.loads(result.stdout)
        print(f"Subprocess Output: {output}")  # Debugging statement
        return jsonify(output), 200
    except subprocess.CalledProcessError as e:
        print(f"Subprocess Error: {e.stderr}")  # Debugging statement
        return jsonify({'success': False, 'message': e.stderr}), 400
    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging statement
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'Pong! The server is running.'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
