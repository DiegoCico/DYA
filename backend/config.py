class Config:
    FIREBASE_API_KEY = 'AIzaSyBI37lzWhWSv7VQif5mlNbZm0Bso5W05OA'
    FIREBASE_AUTH_DOMAIN =  'dyakidswebsite-ab5f1.firebaseapp.com'
    FIREBASE_PROJECT_ID = 'dyakidswebsite-ab5f1'
    FIREBASE_STORAGE_BUCKET = 'dyakidswebsite-ab5f1.appspot.com'
    FIREBASE_MESSAGING_SENDER_ID = '79577052767'
    FIREBASE_APP_ID = '1:79577052767:web:c68ca99c2a73b59f5ecdea'
    FIREBASE_MEASUREMENT_ID = 'G-Y106TTN34Y'

    


# from flask import Flask
# from flask_cors import CORS
# import firebase_admin
# from firebase_admin import credentials, firestore

# app = Flask(__name__)
# CORS(app)

# cred = credentials.Certificate('path/to/your/serviceAccountKey.json')
# firebase_admin.initialize_app(cred)

# db = firestore.client()

# @app.route('/')
# def index():
#     return "Hello, Firebase with Flask!"

# if __name__ == '__main__':
#     app.run(debug=True)