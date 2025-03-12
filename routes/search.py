from flask import Blueprint, current_app ,jsonify, make_response, request, redirect, url_for, render_template
import requests
from helpers.responses import get_response
from helpers.auth import handle_noneed_logged_user, is_user_logged
from flask_wtf.csrf import generate_csrf

search_bp = Blueprint("search",__name__)

@search_bp.route("/search")
def searchpage():
    if is_user_logged() == True:
        current_app.isLogged= True
    return handle_noneed_logged_user("search.html", pagetitle="(search)✌Dr.Null" ,isLogged=current_app.isLogged , csrf_token=generate_csrf())


@search_bp.route("/searchItem", methods=['POST']) 
def searchItem():
        try:

            keyword = request.form.get('keyword')
            cookie = request.form.get('cookie')
            url = "https://dawaok.al-dawaa.com/instore/jquery-functions/ajax-customer-sku-search.php"

            payload = f'keyword={keyword}'
            headers = {
            'Cookie': f'{cookie}',
            'Content-Type': 'application/x-www-form-urlencoded'
            }   
            response = requests.request("POST", url, headers=headers, data=payload)
            code = response.status_code
            if(code == 404):
                response= jsonify({"error":"ok"}) 
            else:
                
                response= jsonify({"success":"ok","result": response.text})  

        except :
            response= jsonify({"error":"ok"})  
        return response


# @search_bp.route("/testSession", methods=['POST']) 
# def testsession():
#         try:

#             keyword = request.form.get('test')
#             cookie = request.form.get('cookie')
#             url = "https://dawaok.al-dawaa.com/instore/jquery-functions/ajax-customer-sku-search.php"

#             payload = f'keyword={keyword}'
#             headers = {
#             'Cookie': f'{cookie}',
#             'Content-Type': 'application/x-www-form-urlencoded'
#             }   
#             response = requests.request("POST", url, headers=headers, data=payload)
#             code = response.status_code
#             if(code == 404):
#                 response= jsonify({"error":"ok" ,"result":code}) 
#             else:
                
#                 response= jsonify({"success":"ok","result":code})  

#         except :
#             response= jsonify({"error":"ok"})  
#         return response
