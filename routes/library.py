from flask import Blueprint, current_app, request
from helpers.auth import handle_unauthenticated_user, is_user_logged, handle_logged_in_user, handle_token_authentication

library_bp = Blueprint('library', __name__)

@library_bp.route("/library", methods=['GET'])
def library_page():
    """Handle the upload page route."""
    firebase_services = current_app.firebase_services
    database = firebase_services['database']  # Pyrebase DB
    admin_auth = firebase_services['admin_auth']  # Firebase Admin Auth

    # Check if the user is already logged in
    if is_user_logged():
        return handle_logged_in_user(
            database,
            "library.html",
            "(library)✌Dr.Null"
        )

    # If the user is not logged in, check for a token
    token = request.args.get('token')
    if token is None:
        return handle_unauthenticated_user()

    # If the user has a token, verify it
    return handle_token_authentication(
        token,
        database,
        admin_auth,
        "library.html",
        "(library)✌Dr.Null"
    )