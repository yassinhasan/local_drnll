from flask import Blueprint, render_template , current_app

from helpers.responses import get_response
from helpers.auth import is_user_logged

privacy_bp = Blueprint("privacy" , __name__)
@privacy_bp.route("/privacy")
def privacypage():
    if is_user_logged() == True:
        current_app.isLogged = True
    template =   render_template("privacy.html",pagetitle="(Privacy))✌Dr.Null",isLogged=current_app.isLogged) 
    return get_response(template)