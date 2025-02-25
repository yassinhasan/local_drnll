import pyrebase
import firebase_admin
from firebase_admin import auth, credentials, db , storage

def initialize_firebase(config):
    # Initialize Firebase Admin SDK
    cred = credentials.Certificate(config)
    # firebase_admin.initialize_app(cred, {'databaseURL': config['databaseURL']})
    firebase_admin.initialize_app(cred, {
        'databaseURL': config['databaseURL'],
        'storageBucket': config['storageBucket']  # Add storageBucket for Firebase Storage
    })
    
    
    # Initialize Pyrebase
    firebase = pyrebase.initialize_app(config)
    return {
        # 'auth': firebase.auth(),
        # 'database': firebase.database(),
        # 'admin_auth': auth,
        # 'admin_db': db
        'auth': firebase.auth(),
        'database': firebase.database(),
        'storage': firebase.storage(),  # Add Pyrebase storage
        'admin_auth': auth,
        'admin_db': db,
        'admin_storage': storage  # Add Firebase Admin storage
    }