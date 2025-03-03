from flask import Blueprint, request, jsonify
import datetime
from helpers.auth import is_user_logged, get_firebase_services, json_response, error_response

# Create a Blueprint for the lastactive route
lastactive_bp = Blueprint('lastactive', __name__)

@lastactive_bp.route("/updateactivity", methods=['POST'])
def lastactive_page():
    """Handle the lastactive page route."""

    # Check if the user is already logged in
    if is_user_logged():
        uid = request.cookies.get('__session') 
        if uid:
            return update_last_access_time(uid)  # Return the response from update_last_access_time
        else:
            return error_response("User ID not found in session.", 400)
    else:
        return error_response("User is not logged in.", 401)

def update_last_access_time(uid):
    """Update the last access time for the user."""
    firebase_services = get_firebase_services()
    admin_db = firebase_services['admin_db']
    try:
        # Update the last access time in Firebase Realtime Database
        admin_db.reference("users").child(uid).update({
            "last_access": str(datetime.datetime.now())  # Correct: No extra {}
        })
        return json_response({"message": "Last access time updated successfully."})
    except Exception as e:
        print(str(e))
        return error_response("Failed to update last access time.", 500, {"error": str(e)})