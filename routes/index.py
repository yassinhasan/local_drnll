from flask import Blueprint, render_template, redirect, url_for
from helpers.auth import handle_noneed_logged_user, is_user_logged
from helpers.responses import get_response
from flask_wtf.csrf import generate_csrf

index_bp = Blueprint('index', __name__)

@index_bp.route("/")
def homepage():
    """Render main homepage"""
    if is_user_logged():
        return redirect(url_for('upload.upload_page'))
    return handle_noneed_logged_user("index.html", pagetitle="(H.meady)✌Dr.Null" ,isLogged=False , csrf_token=generate_csrf())



