'''Imports of needed objects and app instance from config file'''
from flask import request, jsonify
from config import app

@app.route('/')
@app.route('/welcome')
def welcome():
    return '<h1>This is the Welcome page</h1>'

@app.route('/sign-up')
def sign_up():
    return '<h1>This is the Sign Up page</h1>'

@app.route('/log-in')
def log_in():
    return '<h1>This is the Log In page</h1>'

if __name__ == '__main__':
    app.run(debug=True)