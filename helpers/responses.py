from flask import make_response, jsonify
from functools import wraps
from flask_wtf.csrf import generate_csrf


def get_response(template, status_code=200):
    """
    Create a standardized HTTP response with security headers
    Args:
        template (str): Rendered HTML template content
        status_code (int): HTTP status code (default: 200)
    Returns:
        Response: Flask response object with security headers
    """
    csrf_token = generate_csrf()

    response = make_response(template, status_code )
    response.set_cookie(
        'csrf_token',
        csrf_token ,
        httponly=True,  # Prevent JavaScript from accessing the cookie
        secure=True,     # Only send over HTTPS
        samesite='Lax'   # Prevent CSRF attacks
    )
    response.headers['Cache-Control'] = 'private, max-age=300, s-maxage=600'
#     response.headers['X-Content-Type-Options'] = 'nosniff'
#     response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    return response

def json_response(data, status_code=200):
    """
    Create a standardized JSON response
    Args:
        data (dict): Data to be JSON-encoded
        status_code (int): HTTP status code (default: 200)
    Returns:
        Response: JSON-formatted Flask response
    """
    response = jsonify({
        'status': 'success' if 200 <= status_code < 400 else 'error',
        'data': data
    })
    response.status_code = status_code
    return response

from flask import jsonify

def error_response(message, status_code=400, details=None):
    """
    Create a standardized error response.

    Args:
        message (str): Human-readable error message.
        status_code (int): HTTP status code (default: 400).
        details (dict): Additional error details (optional).

    Returns:
        Response: JSON-formatted error response.
    """
    response_data = {
        'status': 'error',
        'code': status_code,
        'message': message
    }
    if details:
        response_data['details'] = details  # Add details as a nested object
    response = jsonify(response_data)
    response.status_code = status_code
    return response

# Common HTTP error helpers
def bad_request(message="Invalid request parameters", details=None):
    return error_response(message, 400, details)

def unauthorized(message="Authentication required"):
    return error_response(message, 401)

def forbidden(message="Insufficient permissions"):
    return error_response(message, 403)

def not_found(message="Resource not found"):
    return error_response(message, 404)

def internal_error(message="Internal server error"):
    return error_response(message, 500)

def handle_api_errors(f):
    """
    Decorator for standardized error handling in API routes
    """
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValueError as e:
            return bad_request(str(e))
        except PermissionError as e:
            return forbidden(str(e))
        except Exception as e:
            return internal_error("An unexpected error occurred")
    return wrapper
# from flask import make_response


# def getResponse(template):
#         response = make_response(template)
#         response.headers['Cache-Control'] = 'private, max-age=300, s-maxage=600'
#         return response