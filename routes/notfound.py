from flask import Blueprint, redirect, render_template, current_app, url_for
from helpers.auth import handle_noneed_logged_user
from helpers.responses import get_response
from flask_wtf.csrf import generate_csrf


# Create a Blueprint for the "notfound" routes
notfound_bp = Blueprint("notfound", __name__)


# Route for the custom "Not Found" page
@notfound_bp.route("/notfound")
def not_found():
    # Render the 404 template with a custom page title
    return handle_noneed_logged_user("404.html", pagetitle="(Not Found Page) ✌ Dr.Null" ,isLogged=current_app.isLogged , csrf_token=generate_csrf())

