from flask import Blueprint, current_app, make_response, request, render_template
from helpers.auth import handle_unauthenticated_user, is_user_logged, handle_logged_in_user, handle_token_authentication
from helpers.responses import get_response

expire_bp = Blueprint('expire', __name__)

@expire_bp.route("/expire", methods=['GET'])
def expire_page():
    """Handle the expire page route."""
    firebase_services = current_app.firebase_services
    database = firebase_services['database']  # Pyrebase DB
    admin_auth = firebase_services['admin_auth']  # Firebase Admin Auth

    # Check if the user is already logged in
    if is_user_logged():
        return handle_logged_in_user(
            database,
            "expire.html",
            "(expire)✌Dr.Null"
        )

