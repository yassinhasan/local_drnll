from flask import Blueprint, redirect, render_template, current_app, url_for
from helpers.responses import get_response

# Create a Blueprint for the "notfound" routes
notfound_bp = Blueprint("notfound", __name__)


# Route for the custom "Not Found" page
@notfound_bp.route("/notfound")
def not_found():
    # Render the 404 template with a custom page title
    template = render_template("404.html", pagetitle="(Not Found Page) ✌ Dr.Null")
    return get_response(template)