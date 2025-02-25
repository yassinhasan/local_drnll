from flask import Blueprint, current_app, request, jsonify
import requests
from helpers.auth import handle_logged_in_user, is_user_logged
from helpers.responses import json_response

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



@expire_bp.route("/drslogin", methods=['POST'])
def get_login():
    try:
        # Get the request data from the frontend
        data = request.json
        user_id = data.get('userId')
        password = data.get('password')

        # Step 1: Send a login request to the local server
        login_url = 'http://localhost:8000/Account/Login'  # Replace with the correct local URL
        login_headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        login_payload = {
            'UserID': user_id,
            'Password': password,
            'RememberMe': 'true',
        }

        # Send the login request
        login_response = requests.post(login_url, headers=login_headers, data=login_payload)

        # Check if the login was successful
        if login_response.status_code != 200:
            return jsonify({'error': 'Login failed'}), 401

        # Step 2: If login is successful, make a second request to retrieve data
        data_url = 'http://localhost:8000/GoodsReceived/GetGrTransactions'  # Replace with the correct local URL
        data_headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        data_payload = {
            'fromDate': '1/1/2024 12:00:00 AM',  # Replace with actual data
            'toDate': '1/1/2025 12:00:00 AM',    # Replace with actual data
        }

        # Send the data retrieval request
        data_response = requests.post(data_url, headers=data_headers, data=data_payload)

        # Check if the data retrieval was successful
        if data_response.status_code != 200:
            return jsonify({'error': 'Failed to retrieve data'}), 500

        # Step 3: Return the retrieved data to the frontend
        return jsonify(data_response.json()), 200

    except Exception as e:
        # Handle errors
        return jsonify({'error': str(e)}), 500