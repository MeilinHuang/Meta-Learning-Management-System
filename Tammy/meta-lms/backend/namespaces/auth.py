# modfified for lms from COMP6080
from app import api,db
from util.globals import *
from util.models import *
from util.request_handling import *
from flask_restplus import Resource, abort, reqparse, fields
from flask import request
auth = api.namespace('auth', description='Authentication Services')

@auth.route('/login', strict_slashes=False)
class Login(Resource):
    @auth.response(200, 'Success',token_details)
    @auth.response(400, 'Missing Email/Password')
    @auth.response(403, 'Invalid Email/Password')
    @auth.expect(login_details)
    @auth.doc(description='''
        This is used to authenticate a verified account created through signup.
        Returns a auth token which should be passed in subsequent calls to the api
        to verify the user.
    ''')
    def post(self):
        j = get_request_json()
        (em,ps) = unpack(j,'email','password')
        if em == '' or ps == '':
            abort(400, 'Email and password cannot be empty')
        if not db.exists('USER').where(email=em,password=ps):
            abort(403,'Invalid Email/Password')
        t = gen_token()
        db_r = db.update('USER').set(curr_token=t).where(email=em)
        db_r.execute()
        return {
            'token': t
        }

@auth.route('/signup', strict_slashes=False)
class Signup(Resource):
    @auth.response(200, 'Success',token_details)
    @auth.response(400, 'Missing Email/Password')
    @auth.response(409, 'Email Taken')
    @api.expect(signup_details)
    @auth.doc(description='''
        Use this endpoint to create a new account,
        username must be unique and password must be non empty
        After creation api retuns a auth token, same as /login would
    ''')
    def post(self):
        j = get_request_json()
        # (un,ps,em,n) = unpack(j,'username','password','email','name')
        (em,n,ps) = unpack(j,'email','name','password')

        if db.exists('USER').where(email=em):
            abort(409, 'Email Taken')
        if em == '' or ps == '':
            abort(400, 'Email and password cannot be empty')

        t = gen_token()
        db_r = db.insert('USER').with_values(
            curr_token=t,
            email=em,
            name=n,
            password=ps,
        )
        db_r.execute()
        return {
            'token': t
        }
