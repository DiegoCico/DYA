import logging
from flask import Flask, request, jsonify
import pyrebase
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object('config.Config')

CORS(app)  # Enable CORS

firebase_config = {
    "apiKey": app.config['FIREBASE_API_KEY'],
    "authDomain": app.config['FIREBASE_AUTH_DOMAIN'],
    "projectId": app.config['FIREBASE_PROJECT_ID'],
    "storageBucket": app.config['FIREBASE_STORAGE_BUCKET'],
    "messagingSenderId": app.config['FIREBASE_MESSAGING_SENDER_ID'],
    "appId": app.config['FIREBASE_APP_ID'],
    "measurementId": app.config['FIREBASE_MEASUREMENT_ID']
}
print(firebase_config)

firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()

# Set up logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    try:
        logging.debug(f"Received login request for email: {email}")
        user = auth.sign_in_with_email_and_password(email, password)
        logging.debug(f"User signed in successfully: {user}")
        return jsonify(user), 200
    except Exception as e:
        logging.error(f"Error during login: {e}")
        return jsonify({"error": "Invalid login credentials"}), 401

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    try:
        logging.debug(f"Received signup request for email: {email}")
        user = auth.create_user_with_email_and_password(email, password)
        logging.debug(f"User created successfully: {user}")
        return jsonify(user), 201
    except Exception as e:
        logging.error(f"Error during signup: {e}")
        return jsonify({"error": "Could not create user"}), 400

if __name__ == '__main__':
    app.run(debug=True)
