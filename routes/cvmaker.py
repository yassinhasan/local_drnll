from flask import Blueprint, render_template , current_app
from helpers.responses import get_response
from helpers.auth import is_user_logged
cvmaker_bp = Blueprint("cvmaker",__name__)

@cvmaker_bp.route("/cvmaker")
def cvmakerpage():
    if is_user_logged() == True:
        current_app.isLogged = True
    template =   render_template("cvmaker.html",pagetitle="(Cv Maker))✌Dr.Null",isLogged=current_app.isLogged) 
    return get_response(template)