from flask import Flask, request, jsonify
import subprocess
import json

app = Flask(__name__)

@app.route('/test-function', methods=['POST'])
def test_function():
    data = request.json
    function_name = data['functionName']
    user_code = data['userCode']
    
    try:
        result = subprocess.run(
            ['python3', 'backend/test_functions.py', function_name, user_code],
            capture_output=True,
            text=True,
            check=True
        )
        output = json.loads(result.stdout)
        return jsonify(output), 200
    except subprocess.CalledProcessError as e:
        return jsonify({'success': False, 'message': e.stderr}), 400

if __name__ == '__main__':
    app.run(port=5000)
