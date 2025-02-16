from flask import Blueprint, request
from helpers.responses import get_response, json_response, error_response, handle_api_errors
from services.sendmail import send_feedback_email

contactme_bp = Blueprint("contactme", __name__)

@contactme_bp.route("/contactme", methods=['POST'])
@handle_api_errors  # Use the error-handling decorator
def contactme():
    # Extract form data
    msg = {
        "name": request.form.get('contact-name'),
        "email": request.form.get('contact-email'),
        "phone": request.form.get('contact-phone'),
        "msg": request.form.get('contact-msg')
    }

    # Validate required fields (excluding 'phone')
    required_fields = ["name", "email", "msg"]
    if not all(msg[field] for field in required_fields):
        return error_response("Name, email, and message are required fields", 400)

    try:
        # Send the email
        send_feedback_email(msg)
        # Return a success response
        return json_response({"message": "Mail has been sent successfully"}, 200)
    except Exception as e:
        # Log the error (you can add logging here if needed)
        print(f"Error sending email: {e}")
        # Return an error response
        return error_response("Something went wrong while sending the email", 500)