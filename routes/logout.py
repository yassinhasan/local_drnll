from flask import Blueprint, current_app ,jsonify, make_response
import datetime

from services.firebase import verify_token


logout_bp = Blueprint('logout', __name__)
expires_in = datetime.timedelta(days=30)


@logout_bp.route("/logout", methods=['POST'])
def logoutpage():
    # Verify the token
    token_verification = verify_token()
    if isinstance(token_verification, tuple):  # If there's an error, return it
        return token_verification

    # Token is valid, proceed with logout
    # decoded_token = token_verification
    current_app.isLogged = False

    # Create a response object
    response = make_response(jsonify({"success": True}))

    # Clear the session cookie
    response.set_cookie(
        '__session',
        value='',
        expires=0,  # Expire the cookie immediately
        secure=True,  # Ensure the cookie is only sent over HTTPS
        httponly=True,  # Prevent JavaScript from accessing the cookie
        samesite='Lax'  # Prevent CSRF attacks
    )

    # Update the application state
    current_app.isLogged = False

    # Set caching headers
    response.headers['Cache-Control'] = 'private, max-age=300, s-maxage=600'

    return response

