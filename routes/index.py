from flask import Blueprint, render_template, redirect, url_for
from helpers.auth import is_user_logged
from helpers.responses import get_response

index_bp = Blueprint('index', __name__)

@index_bp.route("/")
def homepage():
    """Render main homepage"""
    if is_user_logged():
        return redirect(url_for('upload.upload_page'))
    return get_response(render_template("index.html", pagetitle="(H.meady)✌Dr.Null"))



