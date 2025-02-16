from flask import Blueprint, jsonify, make_response, render_template, request , current_app
from helpers.responses import get_response 
from services.youtube import GetDownloadOptions
from helpers.auth import is_user_logged
ydownload_bp = Blueprint("ydownload",__name__)

@ydownload_bp.route("/download",methods=["GET"])
def downloadpage():
    if is_user_logged() == True:
        current_app.isLogged = True
    template =   render_template("download.html",pagetitle="(download))✌Dr.Null",isLogged=current_app.isLogged) 
    return get_response(template)

import logging

@ydownload_bp.route("/downloadvideo", methods=["POST"])
def downloadvideo():
    try:
        url = request.form.get('url')
        if not url:
            return jsonify({"error": "URL is required"}), 400

        results = GetDownloadOptions(url)
        return jsonify({"success": results})
    except Exception as e:
        logging.error(f"Error in downloadvideo: {e}",exc_info=True)
        return jsonify({"error": "Invalid URL or something went wrong!"}), 500