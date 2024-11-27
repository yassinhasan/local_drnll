import datetime
from functools import wraps
import json
from multiprocessing import pool
import subprocess
import time
from uuid import uuid4
from flask import Flask, flash, jsonify, redirect ,render_template,request,make_response,session, url_for
from flask_wtf import CSRFProtect
import requests
import urllib3
from download import GetDownloadOptions
import pyrebase
from flask_cors import CORS,cross_origin
import os
import firebase_admin
from  firebase_admin import auth
from firebase_admin import credentials ,db 
from multiprocessing.pool import ThreadPool

from config import config
from helper import    getResponse, isUserLogged
import urllib.request
import asyncio
from search import getDawaresults, getMuthdaresults, getNahdiresults
import concurrent.futures
from threading import Thread

cred = credentials.Certificate(config)
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://drnull-f3805-default-rtdb.firebaseio.com'
})
ref = db.reference('users')


firebase = pyrebase.initialize_app(config)
database = firebase.database()
pyrbase_auth = firebase.auth()
# Read the data at the posts reference (this is a blocking operation)
# print(ref.get())

uniqueId  = uuid4()

app = Flask(__name__)

app.secret_key = 'hasanmeady0546035917'

app.config["SESSION_PERMANENT"] = True
app.config["SECRET_KEY"] = "hasanmeady0546035917"
app.config['WTF_CSRF_ENABLED'] = True
scrf = CSRFProtect(app)

# sessions = db.collection('sessions')
expires_in = datetime.timedelta(days=30)
expires = datetime.datetime.now() + expires_in
isLogged = False
messages = None





@app.route("/index.html")
def indexpage():
        return redirect(url_for('homepage')) 

@app.route("/")
def homepage():
    if isUserLogged() == True:
        return redirect(url_for('uploadpage')) 
    else:
        isLogged = False
        template = render_template("index.html",pagetitle="(H.meady)✌Dr.Null",isLogged=isLogged)
        return getResponse(template)

@app.route("/download")
def downloadpage():
    if isUserLogged() == True:
        global isLogged 
        isLogged= True
    template =   render_template("download.html",pagetitle="(download))✌Dr.Null",isLogged=isLogged) 
    return getResponse(template)



@app.route("/notes")
def notespage():
    if isUserLogged() == True:
        isLogged = True
        uid = request.cookies.get('__session') 
        signedUser =  database.child("users").child(uid).get().val()
        template =   render_template("notes.html",pagetitle="(Notes))✌Dr.Null",username=signedUser['username'],isLogged=isLogged) 
        return getResponse(template)
    else:
        isLogged = False
        messages = {
            "type" : "warning" , 
            "msg" : "you shoud login first!",
             "mustLogin" : True
        }
        template = render_template("index.html",pagetitle="(H.meady)✌Dr.Null",isLogged=isLogged,messages=messages)
        return getResponse(template) 
    
@app.route("/search")
def searchpage():
    if isUserLogged() == True:
        global isLogged 
        isLogged= True
    template =   render_template("search.html",pagetitle="(Search))✌Dr.Null",isLogged=isLogged) 
    return getResponse(template)


@app.route("/searchItem", methods=['POST']) 
def searchItem():
        item = request.form.get('item')
        items = []
        
        # items = getresults(item)
        # urls = [f'https://unitedpharmacy.sa/ar/catalogsearch/result/?q={item}',f'https://www.nahdionline.com/ar/?q={item}',f'https://www.al-dawaa.com/english/?q={item}' ]
        # urls = {
        #     "dawa" :  f'https://www.al-dawaa.com/english/?q={item}',
           
        #     "muthda" :  f'https://unitedpharmacy.sa/ar/catalogsearch/result/?q={item}',
        #      "nahdi" :  f'https://www.nahdionline.com/ar/?q={item}',
        # }
        
        # with concurrent.futures.ThreadPoolExecutor(max_workers=60) as executor:
        #     # Submit each download task to the thread pool
        #     futures = [executor.submit(getresults, urls[url],url) for url in urls]
        #     # Wait for all tasks to complete and retrieve the results
        #     results = [future.result() for future in concurrent.futures.as_completed(futures)]
        #     for result in results:
        #        items.append(result)  
            
        results = []
        pool = ThreadPool(3)
        results.append(pool.apply_async(getDawaresults,args=[item])) 
        results.append(pool.apply_async(getNahdiresults,args=[item])) # tuple of args for foo)
        results.append(pool.apply_async(getMuthdaresults,args=[item])) # tuple of args for foo)

        items = [r.get() for r in results]
        pool.close()
        pool.join()  
        response = make_response()
        response= jsonify({"success":"ok","result": items})  
        return response
    
@app.route("/downloadvideo", methods=['POST']) 
def downloadvideo():

    try:
        url = request.form.get('url')
        results = GetDownloadOptions(url)
        response = make_response()
        response= jsonify({"success":results})  
        return response
        # here i will return respone fetch to post request
    except Exception as e:
        response = make_response()
        response= jsonify({"error":"invaid url!!"})  
        return response
    


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route("/upload", methods=['GET'])
def uploadpage():
    token = request.args.get('token')
    if isUserLogged() == True:
        isLogged = True
        uid = request.cookies.get('__session') 
        signedUser =  database.child("users").child(uid).get().val()
        template =   render_template("upload.html",pagetitle="(Upload))✌Dr.Null",username=signedUser['username'],isLogged=isLogged) 
        return getResponse(template)
    if token is None:
        isLogged = False
        messages = {
            "type" : "warning" , 
            "msg" : "token is missed!!" ,
            "mustLogin" : True
        }
        template = render_template("index.html",pagetitle="(H.meady)✌Dr.Null",isLogged=isLogged,messages=messages)
        return getResponse(template) 
    else:
        try :
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token['uid']
            signedUser =  database.child("users").child(uid).get().val()
            isLogged = True
            template =   render_template("upload.html",pagetitle="(Upload))✌Dr.Null",username=signedUser['username'],isLogged=isLogged) 
            response = make_response(template)
            response.set_cookie('__session', value=uid ,max_age = None, expires = expires)
            response.headers['Cache-Control'] = 'private, max-age=300, s-maxage=600'
            return response
        except Exception as e:
            isLogged = False
            messages = {
                "type" : "warning" , 
                "msg" : "Token is invalid!!" ,
                "mustLogin" : True
            }
            template = render_template("index.html",pagetitle="(H.meady)✌Dr.Null",isLogged=isLogged,messages=messages)
            return getResponse(template) 



@app.route("/logout",methods=['POST'])
def logoutpage():
    response = make_response()
    response= jsonify({"success":True})  
    response.set_cookie('__session','', expires=0)
    global isLogged
    isLogged = False
    response.headers['Cache-Control'] = 'private, max-age=300, s-maxage=600'
    return response


if __name__ == "__main__":
    app.run(debug=True,port=int(os.environ.get('PORT',8080)))
   

