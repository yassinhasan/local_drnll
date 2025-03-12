from flask import Blueprint, render_template , current_app
from helpers.responses import get_response
from flask_wtf.csrf import generate_csrf
from helpers.auth import handle_noneed_logged_user, is_user_logged
cvmaker_bp = Blueprint("cvmaker",__name__)

@cvmaker_bp.route("/cvmaker")
def cvmakerpage():
    if is_user_logged() == True:
        current_app.isLogged = True
    return handle_noneed_logged_user("cvmaker.html",pagetitle="(Cv Maker))✌Dr.Null",isLogged=current_app.isLogged , csrf_token=generate_csrf())
