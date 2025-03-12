from flask import Blueprint, render_template , current_app

from helpers.responses import get_response
from helpers.auth import handle_noneed_logged_user, is_user_logged
from flask_wtf.csrf import generate_csrf

privacy_bp = Blueprint("privacy" , __name__)
@privacy_bp.route("/privacy")
def privacypage():
    if is_user_logged() == True:
        current_app.isLogged = True
    return handle_noneed_logged_user("privacy.html", pagetitle="(privacy)✌Dr.Null" ,isLogged=current_app.isLogged , csrf_token=generate_csrf())
