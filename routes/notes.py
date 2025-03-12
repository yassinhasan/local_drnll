from flask import Blueprint, current_app ,jsonify, make_response, request, redirect, url_for, render_template
from helpers.auth import admin_required, handle_unauthenticated_user, is_user_logged
from helpers.responses import  get_response
from flask_wtf.csrf import generate_csrf


notes_bp = Blueprint("notes",__name__)
@notes_bp.route("/notes")
def notespage():
    firebase_services = current_app.firebase_services
    database = firebase_services['database']         # 
    if is_user_logged() == True:
        isLogged = True
        uid = request.cookies.get('__session') 
        try:

            signedUser =  database.child("users").child(uid).get().val()
            template =   render_template("notes.html",pagetitle="(Notes))✌Dr.Null",username=signedUser['username'],isLogged=isLogged ,csrf_token=generate_csrf()) 
            return get_response(template)
        except:
            response = make_response()
            response= jsonify({"error":"somthing error"})  
            return response
    else:
       return  handle_unauthenticated_user()