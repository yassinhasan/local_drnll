from flask import make_response, request, session



def isUserLogged():
    return '__session' in request.cookies

def getResponse(template):
        response = make_response(template)
        response.headers['Cache-Control'] = 'private, max-age=300, s-maxage=600'
        return response


