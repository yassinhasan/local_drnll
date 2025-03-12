from flask import Blueprint, render_template , current_app

from helpers.responses import get_response
from helpers.auth import handle_noneed_logged_user, is_user_logged
from flask_wtf.csrf import generate_csrf


offline_bp = Blueprint("offline" , __name__)
@offline_bp.route("/offline")
def offlinepage():
    if is_user_logged() == True:
        current_app.isLogged = True
    return handle_noneed_logged_user("offline.html", pagetitle="(offline)✌Dr.Null" ,isLogged=current_app.isLogged , csrf_token=generate_csrf())

