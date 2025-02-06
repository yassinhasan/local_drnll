import datetime
from threading import Thread
from uuid import uuid4
from flask import Flask, flash, jsonify, redirect ,render_template,request,make_response,session, url_for
from flask_wtf import CSRFProtect
import requests
from download import GetDownloadOptions
import pyrebase
import os
import firebase_admin
from  firebase_admin import auth as auth
from firebase_admin import credentials ,db 
from config import config

from helper import    getResponse, isUserLogged
from sendmail import sendemail , sendevents

cred = credentials.Certificate(config)
firebase_admin.initialize_app(cred, {
    'databaseURL': config['databaseURL']
})



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

# mail config



@app.route("/index.html")
def indexpage():
        return redirect(url_for('homepage')) 

@app.route("/")
def homepage():
    global isLogged
    if isUserLogged() == True:
        isLogged = True
        return redirect(url_for('uploadpage')) 
    else:
        isLogged = False
        template = render_template("index.html",pagetitle="(H.meady)✌Dr.Null",isLogged=isLogged)
        return getResponse(template)

@app.route("/download")
def downloadpage():
    if isUserLogged() == True:
        global isLogged 
        isLogged = True
    template =   render_template("download.html",pagetitle="(download))✌Dr.Null",isLogged=isLogged) 
    return getResponse(template)

@app.route("/data")
def bookpage():
    if isUserLogged() == True:
        global isLogged 
        isLogged = True
    template =   render_template("data.html",pagetitle="Mixed Data",isLogged=isLogged) 
    return getResponse(template)

@app.route("/cvmaker")
def cvmakerpage():
    if isUserLogged() == True:
        global isLogged 
        isLogged = True
    template =   render_template("cvmaker.html",pagetitle="(Cv Maker))✌Dr.Null",isLogged=isLogged) 
    return getResponse(template)

@app.route("/privacy")
def privacypage():
    if isUserLogged() == True:
        global isLogged 
        isLogged = True
    template =   render_template("privacy.html",pagetitle="(Privacy))✌Dr.Null",isLogged=isLogged) 
    return getResponse(template)



@app.route("/notes")
def notespage():
    if isUserLogged() == True:
        isLogged = True
        uid = request.cookies.get('__session') 
        try:

            signedUser =  database.child("users").child(uid).get().val()
            template =   render_template("notes.html",pagetitle="(Notes))✌Dr.Null",username=signedUser['username'],isLogged=isLogged) 
            return getResponse(template)
        except:
            response = make_response()
            response= jsonify({"error":"somthing error"})  
            return response
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


@app.route("/testSession", methods=['POST']) 
def testsession():
        try:

            keyword = request.form.get('test')
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
                response= jsonify({"error":"ok" ,"result":code}) 
            else:
                
                response= jsonify({"success":"ok","result":code})  

        except :
            response= jsonify({"error":"ok"})  
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

    
@app.route("/contactme", methods=['POST']) 
def contactme():

        try:
            
            msg = {
                "name" :  request.form.get('contact-name'),
                "email" :request.form.get('contact-email') ,
                "phone" :  request.form.get('contact-phone') ,
                "msg" : request.form.get('contact-msg')
            }
            
            sendemail(msg)
            response = make_response()
            response= jsonify({"success":"Mail has sent"})  
            return response
        except Exception as e:
            response = make_response()
            response= jsonify({"error":"somthing error"})  
            return response



@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route("/upload", methods=['GET'])
def uploadpage():
    
    token = request.args.get('token')
    # if user is already logged
    if isUserLogged() == True:
        isLogged = True
        uid = request.cookies.get('__session') 
        try:  
            signedUser =  database.child("users").child(uid).get().val()
            template =   render_template("upload.html",pagetitle="(Upload))✌Dr.Null",username=signedUser['username'],isLogged=isLogged) 
            return getResponse(template)
        except:
            response = make_response()
            response= jsonify({"error":"somthing error"})  
            return response
    # if user not logged check token if already exists so get user
        # token is not found so user not logged or has token so logged out
    if token is None:
        isLogged = False
        messages = {
            "type" : "warning" , 
            "msg" : "You shoud login first!!"  ,
            "mustLogin" : True
        }
        template = render_template("index.html",pagetitle="(H.meady)✌Dr.Null",isLogged=isLogged,messages=messages)
        return getResponse(template) 
    else:
        # user here does not logged but has token so check token
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
            # user not loeeged but has token is invalid
            isLogged = False
            messages = {
                "type" : "warning" , 
                "msg" : "You shoud login first!!  or Token is invalid!!" ,
                "mustLogin" : True
            }

        
@app.route("/dashboard", methods=['GET'])
def dashboardpage():
    token = request.args.get('token')
    # user is logged to he has session and has un session uid get user
    if isUserLogged() == True:
        isLogged = True
        uid = request.cookies.get('__session') 
        try:     
            signedUser =  database.child("users").child(uid).get().val()
            # check if user is found and has role admin 
            if(signedUser and  signedUser['role'] == 'admin'):
                template =   render_template("dashboard.html",pagetitle="(Dashboard))✌Dr.Null",username=signedUser['username'],isLogged=isLogged,admin=True) 
                return getResponse(template)
            # IF USER not admin
            elif signedUser and  signedUser['role'] != 'admin' :
                messages = {
                        "type" : "warning" , 
                        "msg" : "this user doesn't has access  to this page!!" ,
                    }
                
                return redirect(url_for('uploadpage'))
            else:
            # if user is not found or not admin or user
                isLogged = False
                messages = {
                    "type" : "warning" , 
                    "msg" : "You shoud login first or not has access to this page!!" ,
                    "mustLogin" : True
                }
                template = render_template("index.html",pagetitle="(H.meady)✌Dr.Null",isLogged=isLogged,messages=messages)
                return getResponse(template) 
        except:
            response = make_response()
            response= jsonify({"error":"somthing error"})  
            return response
    # if not logged before and has not token
    if token is None:
        isLogged = False
        messages = {
            "type" : "warning" , 
            "msg" : "You shoud login first!!" ,
            "mustLogin" : True
        }
        template = render_template("index.html",pagetitle="(H.meady)✌Dr.Null",isLogged=isLogged,messages=messages)
        return getResponse(template) 
    else:
        try :
            # user here come from logging and hasa token check token
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token['uid']
            try:

                signedUser =  database.child("users").child(uid).get().val()
                # if user is found and is admin
                if signedUser and  signedUser['role'] == 'admin' :
                    isLogged = True
                    template =   render_template("dashboard.html",pagetitle="(Dashboard))✌Dr.Null",username=signedUser['username'],isLogged=isLogged,admin=True) 
                    response = make_response(template)
                    response.set_cookie('__session', value=uid ,max_age = None, expires = expires)
                    response.headers['Cache-Control'] = 'private, max-age=300, s-maxage=600'
                    return response
                else :
                
                    messages = {
                        "type" : "warning" , 
                        "msg" : "this user doesn't has access  to this page!!" ,
                    }
                    template = render_template("index.html",pagetitle="(H.meady)✌Dr.Null",isLogged=isLogged,messages=messages)
                    response = make_response(template)
                    return response
            except:
                response = make_response()
                response= jsonify({"error":"somthing error"})  
                return response
        except Exception as e:
            # token is not invalid so logged out
            isLogged = False
            messages = {
                "type" : "warning" , 
                "msg" : "You shoud login first or Token is invalid!!" ,
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



@app.route("/usersdata",methods=['POST'])
def usersdata():
    try:
        users = []
        page = auth.list_users()
        while page:
            for user in page.users:
               
                user = auth.get_user(user.uid)
               
                userdata  = {
                    "userId" : user.uid ,
                    "email" :user.email ,
                    "creationTime" :user.user_metadata.creation_timestamp ,
                    "lastLogin" :user.user_metadata.last_sign_in_timestamp ,
                    "email_verified": user.email_verified
                }
                users.append(userdata)
            page = page.get_next_page()
        response = make_response()
        response= jsonify({"results":"ok","users":users})  
        return response
    except Exception as e:
        response = make_response()
        response= jsonify({"error": e})  
        return response 

@app.route("/editusers",methods=['POST'])
def editusers():
    try:
        
        users = db.reference("users").get()
        response = make_response()
        response= jsonify({"results":"ok","users":users})  
        return response
    except Exception as e:
        response = make_response()
        response= jsonify({"error": e})  
        return response 

@app.route("/deleteuser",methods=['POST'])
def deleteuser():


        try:

            uid=request.form.get('uid')  
            user = db.reference("users").child(uid)
            user.delete()
            auth.delete_user(uid)
        # delete from auth and delte from realtime authentiocation 
            response= jsonify({"results":"ok","users":uid})  
            return response
        except Exception as e:
            response = make_response()
            response= jsonify({"error": "error"})  
            return response 
    

@app.route("/sendemailevents",methods=['POST'])
def sendemailevents():
    emails=request.form.getlist('email-user')
    subject= request.form.get('email-subject')
    msg=request.form.get('content')

    try:
       
        if len(emails) == 1:
                emails = emails[0].split(",")
        
        for email in emails:
            
             Thread(target=sendevents, args=(email,subject,msg)).start()
            #  sendevents(email,subject,messages)
        response = make_response()
        response= jsonify({"success":"ok","msg":msg})  
        return response
    except Exception as e:
        response = make_response()
        response= jsonify({"error": e})  
        return response 

@app.route("/upload",methods=['POST'])
def upload():
     subject= request.form.get('upload')
     print(subject)

if __name__ == "__main__":
    # app.run(debug=True,port=int(os.environ.get('PORT',8080)) ,host="192.168.1.146")
    app.run(debug=True,port=int(os.environ.get('PORT',8080)))
   

