import datetime
from flask import render_template, request, current_app, make_response, redirect, url_for
from helpers.responses import error_response, get_response, json_response
from functools import wraps
from flask_wtf.csrf import generate_csrf
def is_user_logged():
    """Check if the user is logged in using the session cookie."""
    return '__session' in request.cookies

def admin_required(func):
    """Decorator to require admin privileges."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        firebase_services = current_app.firebase_services
        database = firebase_services['database']  # Pyrebase DB
        uid = request.cookies.get('__session')
        if  not is_user_logged:
            return redirect(url_for('index.homepage'))
        
        user = database.child("users").child(uid).get().val()
        if not user or user.get('role') != 'admin':
            return redirect(url_for('index.homepage'))
        
        return func(*args, **kwargs)
    return wrapper

def get_firebase_services():
    """Retrieve Firebase services from the app context."""
    return current_app.firebase_services

def get_user_data(uid):
    """Retrieve user data from Firebase database."""
    firebase_services = get_firebase_services()
    database = firebase_services['database']
    return database.child("users").child(uid).get().val()
def handle_logged_in_user(database, template_name, pagetitle, csrf_token=None):
    """
    Handle the logic for a logged-in user.
    - Renders the specified template for logged-in users.
    """
    # Get the user ID from the session cookie
    uid = request.cookies.get('__session')
    if not uid:
        return handle_unauthenticated_user()

    # Fetch user data from the database
    signed_user = database.child("users").child(uid).get().val()
    if not signed_user:
        return handle_unauthenticated_user()

    # Generate CSRF token if not provided
    if not csrf_token:
        csrf_token = generate_csrf()

    # Create a response object
    response = make_response()

    # Set CSRF token in a cookie
    response.set_cookie(
        'csrf_token',
        csrf_token,
        httponly=True,  # Prevent JavaScript from accessing the cookie
        secure=True,     # Only send over HTTPS (configurable for development)
        samesite='Lax'   # Prevent CSRF attacks
    )

    # Set caching headers
    response.headers['Cache-Control'] = 'private, max-age=300, s-maxage=600'

    # Render the template
    current_app.isLogged = True
    template = render_template(
        template_name,
        pagetitle=pagetitle,
        username=signed_user['username'],
        isLogged=current_app.isLogged,
        csrf_token=csrf_token
    )

    # Set the rendered template as the response content
    response.set_data(template)
    return response
def handle_token_authentication(token, database, admin_auth, template_name, pagetitle, csrf_token=None):
    """
    Handle the logic for token-based authentication.
    - Verifies the token and renders the specified template for authenticated users.
    - Sets the CSRF token in a cookie for CSRF protection.
    """
    try:
        # Verify the Firebase ID token
        decoded_token = admin_auth.verify_id_token(token)
        uid = decoded_token['uid']

        # Fetch user data from the database
        signed_user = database.child("users").child(uid).get().val()
        if not signed_user:
            return handle_unauthenticated_user("User not found in the database.")

        # Generate CSRF token if not provided
        if not csrf_token:
            csrf_token = generate_csrf()

        # Render the template
        current_app.isLogged = True
        template = render_template(
            template_name,
            pagetitle=pagetitle,
            username=signed_user['username'],
            isLogged=current_app.isLogged,
            csrf_token=csrf_token
        )

        # Create a response object
        response = make_response(template)

        # Set the session cookie
        response.set_cookie(
            '__session',
            value=uid,
            max_age=None,
            expires=current_app.expires,
            secure=True,  # Ensure the cookie is only sent over HTTPS
            httponly=True,  # Prevent JavaScript from accessing the cookie
            samesite='Lax'  # Prevent CSRF attacks
        )

        # Set the CSRF token in a cookie
        response.set_cookie(
            'csrf_token',
            value=csrf_token,
            secure=True,  # Ensure the cookie is only sent over HTTPS
            httponly=True,  # Prevent JavaScript from accessing the cookie
            samesite='Lax'  # Prevent CSRF attacks
        )

        # Set caching headers
        response.headers['Cache-Control'] = 'private, max-age=300, s-maxage=600'

        return response

    except Exception as e:
        # Handle token verification errors or other exceptions
        return handle_unauthenticated_user("You should login first or the token is invalid!!")

def handle_unauthenticated_user(message=None, csrf_token=None):
    """
    Handle the logic for an unauthenticated user (no token).
    - Renders the index template with a warning message.
    - Sets the CSRF token in a cookie for CSRF protection.
    """
    # Set the user as unauthenticated
    current_app.isLogged = False

    # Prepare the warning message
    messages = {
        "type": "warning",
        "msg": 'You should login first!!' if message is None else message,
        "mustLogin": True
    }

    # Generate CSRF token if not provided
    if not csrf_token:
        csrf_token = generate_csrf()

    # Render the template
    template = render_template(
        "index.html",
        pagetitle="(H.meady)✌Dr.Null",
        isLogged=current_app.isLogged,
        messages=messages,
        csrf_token=csrf_token
    )

    # Create a response object
    response = make_response(template)

    # Set the CSRF token in a cookie
    response.set_cookie(
        'csrf_token',
        value=csrf_token,
        secure=True,  # Ensure the cookie is only sent over HTTPS
        httponly=True,  # Prevent JavaScript from accessing the cookie
        samesite='Lax'  # Prevent CSRF attacks
    )

    # Set caching headers (optional)
    response.headers['Cache-Control'] = 'private, max-age=300, s-maxage=600'

    return response


def handle_noneed_logged_user(template_name, pagetitle, csrf_token=None , isLogged=False):


    # Generate CSRF token if not provided
    if not csrf_token:
        csrf_token = generate_csrf()

    # Create a response object
    response = make_response()

    # Set CSRF token in a cookie
    response.set_cookie(
        'csrf_token',
        csrf_token,
        httponly=True,  # Prevent JavaScript from accessing the cookie
        secure=True,     # Only send over HTTPS (configurable for development)
        samesite='Lax'   # Prevent CSRF attacks
    )

    # Set caching headers
    response.headers['Cache-Control'] = 'private, max-age=300, s-maxage=600'

    # Render the template
    current_app.isLogged = isLogged
    template = render_template(
        template_name,
        pagetitle=pagetitle,
        isLogged=isLogged ,
        csrf_token=csrf_token
    )

    # Set the rendered template as the response content
    response.set_data(template)
    return response