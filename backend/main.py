from flask import Flask, request, jsonify
import pyrebase

app = Flask(__name__)
app.config.from_object('config.Config')

# Firebase configuration using values from the Flask app config
firebase_config = {
    "apiKey": app.config['FIREBASE_API_KEY'],
    "authDomain": app.config['FIREBASE_AUTH_DOMAIN'],
    "projectId": app.config['FIREBASE_PROJECT_ID'],
    "storageBucket": app.config['FIREBASE_STORAGE_BUCKET'],
    "messagingSenderId": app.config['FIREBASE_MESSAGING_SENDER_ID'],
    "appId": app.config['FIREBASE_APP_ID'],
    "measurementId": app.config['FIREBASE_MEASUREMENT_ID']
}

# Initialize Firebase and the authentication module
firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()

@app.route('/login', methods=['POST'])
def login():
    """
    Endpoint to handle user login.
    Expects JSON data with 'email' and 'password' fields.
    Returns user information if login is successful, or an error message if credentials are invalid.
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        return jsonify(user), 200
    except Exception as e:
        return jsonify({"error": "Invalid login credentials"}), 401

@app.route('/signup', methods=['POST'])
def signup():
    """
    Endpoint to handle user signup.
    Expects JSON data with 'email' and 'password' fields.
    Returns user information if signup is successful, or an error message if the user could not be created.
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    try:
        user = auth.create_user_with_email_and_password(email, password)
        return jsonify(user), 201
    except Exception as e:
        return jsonify({"error": "Could not create user"}), 400

if __name__ == '__main__':
    app.run(debug=True)


# '''Imports of needed objects and app instance from config file'''
# from flask import request, jsonify
# from config import app

# @app.route('/')
# @app.route('/welcome')
# def welcome():
#     return '<h1>This is the Welcome page</h1>'

# @app.route('/sign-up')
# def sign_up():
#     return '<h1>This is the Sign Up page</h1>'

# @app.route('/log-in')
# def log_in():
#     return '<h1>This is the Log In page</h1>'

# if __name__ == '__main__':
#     app.run(debug=True)