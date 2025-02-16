from flask import Blueprint, render_template , current_app

from helpers.responses import get_response
from helpers.auth import is_user_logged

offline_bp = Blueprint("offline" , __name__)
@offline_bp.route("/offline")
def offlinepage():
    if is_user_logged() == True:
        current_app.isLogged = True
    template =   render_template("offline.html",pagetitle="(offline))✌Dr.Null",isLogged=current_app.isLogged) 
    return get_response(template)