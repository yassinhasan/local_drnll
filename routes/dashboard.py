from threading import Thread
from datetime import datetime, timezone
import time
from flask import Blueprint, current_app, jsonify, make_response, request, redirect, url_for, render_template
from helpers.auth import get_firebase_services, is_user_logged
from helpers.responses import error_response, get_response, internal_error, json_response
from helpers.time import check_user_activity
from flask_wtf.csrf import generate_csrf
from services.sendmail import send_event_email

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route("/dashboard", methods=['GET'])
def dashboardpage():
    """Handle the dashboard page route."""
    firebase_services = get_firebase_services()
    admin_auth = firebase_services['admin_auth']
    database = firebase_services['database']
    token = request.args.get('token')

    # Case 1: User is logged in (has a session cookie)
    if is_user_logged():
        isLogged = True
        uid = request.cookies.get('__session')
        try:
            signedUser = database.child("users").child(uid).get().val()

            # Case 1a: User is found and is an admin
            if signedUser and signedUser['role'] == 'admin':
                template = render_template(
                    "dashboard.html",
                    pagetitle="(Dashboard)✌Dr.Null",
                    username=signedUser['username'],
                    isLogged=isLogged,
                    admin=True,
                    csrf_token=generate_csrf()
                )
                return get_response(template)

            # Case 1b: User is found but not an admin
            elif signedUser and signedUser['role'] != 'admin':
                messages = {
                    "type": "warning",
                    "msg": "This user doesn't have access to this page!!"
                }
                return redirect(url_for('upload.upload_page'))

            # Case 1c: User is not found or invalid
            else:
                isLogged = False
                messages = {
                    "type": "warning",
                    "msg": "You should login first or do not have access to this page!!",
                    "mustLogin": True
                }
                template = render_template(
                    "index.html",
                    pagetitle="(H.meady)✌Dr.Null",
                    isLogged=isLogged,
                    messages=messages
                    ,csrf_token=generate_csrf()
                )
                return get_response(template)

        except Exception as e:
            # Handle database or other errors
            response = make_response()
            response = jsonify({"error": "Something went wrong"})
            return response

    # Case 2: User is not logged in and has no token
    if token is None:
        isLogged = False
        messages = {
            "type": "warning",
            "msg": "You should login first!!",
            "mustLogin": True
        }
        template = render_template(
            "index.html",
            pagetitle="(H.meady)✌Dr.Null",
            isLogged=isLogged,
            messages=messages
            ,csrf_token=generate_csrf()
        )
        return get_response(template)

    # Case 3: User is not logged in but has a token
    else:
        try:
            # Verify the token
            decoded_token = admin_auth.verify_id_token(token)
            uid = decoded_token['uid']

            try:
                signedUser = database.child("users").child(uid).get().val()
                # Case 3a: User is found and is an admin
                if signedUser and signedUser['role'] == 'admin':
                    isLogged = True
                    template = render_template(
                        "dashboard.html",
                        pagetitle="(Dashboard)✌Dr.Null",
                        username=signedUser['username'],
                        isLogged=isLogged,
                        admin=True,
                        csrf_token=generate_csrf()
                    )
                    response = make_response(template)
                    response.set_cookie('__session', value=uid, max_age=None, expires=current_app.expires)
                    response.headers['Cache-Control'] = 'private, max-age=300, s-maxage=600'
                    return response

                # Case 3b: User is found but not an admin
                else:
                    messages = {
                        "type": "warning",
                        "msg": "This user doesn't have access to this page!!"
                    }
                    template = render_template(
                        "index.html",
                        pagetitle="(H.meady)✌Dr.Null",
                        isLogged=isLogged,
                        messages=messages
                        ,csrf_token=generate_csrf()
                    )
                    response = make_response(template)
                    return response

            except Exception as e:
                # Handle database or other errors
                response = make_response()
                response = jsonify({"error": "Something went wrong"})
                return response

        except Exception as e:
            # Case 3c: Token is invalid
            isLogged = False
            messages = {
                "type": "warning",
                "msg": "You should login first or the token is invalid!!",
                "mustLogin": True
            }
            template = render_template(
                "index.html",
                pagetitle="(H.meady)✌Dr.Null",
                isLogged=isLogged,
                messages=messages,
                csrf_token=generate_csrf()
            )
            return get_response(template)




@dashboard_bp.route("/usersdata", methods=['POST'])
def usersdata():
    try:
        firebase_services = get_firebase_services()
        admin_auth = firebase_services['admin_auth']
        admin_db = firebase_services['admin_db']
        users = []

        # Fetch all users from Firebase Authentication
        page = admin_auth.list_users()
        while page:
            for user in page.users:
                user_data = admin_auth.get_user(user.uid)

                # Fetch additional user details from Firebase Realtime Database
                user_db_data = admin_db.reference("users").child(user.uid).get()

                # Get last login time from Firebase Authentication
                # last_login = user_data.user_metadata.last_sign_in_timestamp
                # last_login_str = datetime.fromtimestamp(last_login / 1000, tz=timezone.utc).strftime('%Y-%m-%d %H:%M:%S') if last_login else "Never logged in"

                # Get last active time from Firebase Realtime Database (access_time)
                access_time = user_db_data.get('last_access')
                is_active = check_user_activity(access_time)
                last_active_str = datetime.strptime(access_time, "%Y-%m-%d %H:%M:%S.%f").strftime('%Y-%m-%d %H:%M:%S') if access_time else "Never accessed"
                # Append user data to the list
                users.append({
                    "userId": user_data.uid,
                    "email": user_data.email,
                    "creationTime": datetime.fromtimestamp(user_data.user_metadata.creation_timestamp / 1000, tz=timezone.utc).strftime('%Y-%m-%d %H:%M:%S'),
                    "lastActive": last_active_str,  # From Firebase Realtime Database (access_time)
                    "email_verified": user_data.email_verified,
                    "role": user_db_data.get('role', 'user'),  # Default to 'user' if role is not set
                    "status": user_db_data.get('status', 'pending'),  # Default to 'pending' if status is not set
                    "is_active": is_active  # Based on last active time (access_time)
                })
            page = page.get_next_page()

        return json_response(users)
    except Exception as e:
        return error_response(str(e))

@dashboard_bp.route("/updateuser", methods=['POST'])
def updateuser():
    try:
        firebase_services = get_firebase_services()
        admin_db = firebase_services['admin_db']
        user_id = request.form.get('userId')
        role = request.form.get('role')
        status = request.form.get('status')

        # Update the user's role and status in the database
        admin_db.reference("users").child(user_id).update({
            "role": role,
            "status": status
        })

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@dashboard_bp.route("/deleteuser", methods=['POST'])
def deleteuser():
    try:
        firebase_services = get_firebase_services()
        admin_auth = firebase_services['admin_auth']
        admin_db = firebase_services['admin_db']
        uid = request.form.get('uid')
        user = admin_db.reference("users").child(uid)
        user.delete()
        admin_auth.delete_user(uid)
        return json_response(uid)
    except Exception as e:
        return error_response(str(e))


@dashboard_bp.route("/sendemailevents", methods=['POST'])
def sendemailevents():
    emails = request.form.getlist('email-user')
    subject = request.form.get('email-subject')
    msg = request.form.get('content')

    try:
        if len(emails) == 1:
            emails = emails[0].split(",")

        for email in emails:
            Thread(target=send_event_email, args=(email, subject, msg)).start()
        return jsonify({"success": "ok", "msg": msg})
    except Exception as e:
        return jsonify({"error": str(e)}) # Return error message