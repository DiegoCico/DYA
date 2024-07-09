# app.py
from flask import Flask, request, jsonify
from firebase_admin import credentials, firestore, initialize_app

app = Flask(__name__)

cred = credentials.Certificate("./dyakidswebsite-ab5f1-firebase-adminsdk-emo1x-b33b0cabea.json")
initialize_app(cred)
db = firestore.client()

@app.route('/roadmap/<uid>', methods=['GET'])
def get_roadmap(uid):
    try:
        roadmap_ref = db.collection('roadmaps').document(uid)
        roadmap = roadmap_ref.get()
        if roadmap.exists:
            return jsonify(roadmap.to_dict()), 200
        else:
            return jsonify({"error": "Roadmap not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
