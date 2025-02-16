import pyrebase
import firebase_admin
from firebase_admin import auth, credentials, db

def initialize_firebase(config):
    # Initialize Firebase Admin SDK
    cred = credentials.Certificate(config)
    firebase_admin.initialize_app(cred, {'databaseURL': config['databaseURL']})
    
    # Initialize Pyrebase
    firebase = pyrebase.initialize_app(config)
    return {
        'auth': firebase.auth(),
        'database': firebase.database(),
        'admin_auth': auth,
        'admin_db': db
    }