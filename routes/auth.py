from flask import Blueprint, current_app ,jsonify, make_response
import datetime

logout_bp = Blueprint('logout', __name__)
expires_in = datetime.timedelta(days=30)

@logout_bp.route("/logout", methods=['POST'])
def logoutpage():
    response = make_response()
    response= jsonify({"success":True})  
    response.set_cookie('__session','', expires=0)
    current_app.isLogged = False
    response.headers['Cache-Control'] = 'private, max-age=300, s-maxage=600'
    return response


