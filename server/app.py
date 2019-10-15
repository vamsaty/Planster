# -*- coding: utf-8 -*-
"""
Created on Mon Oct 14 09:10:45 2019

@author: satys
"""    

from flask import Flask, render_template, Markup, request, redirect
import requests
from form import myForm
from flask_static_compress import FlaskStaticCompress
from currenttime import yourtime, prettytime
import logging
from flask_pymongo import PyMongo
import pymongo
import jsonify
from flask_cors import CORS



current_user = ''

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb+srv://satyam:mongodb1234@planster-c1-tjz95.mongodb.net/test?retryWrites=true&w=majority"

#mongo = PyMongo(app)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Origin','127.0.0.1')
  return response


@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
def home():
        return 'dfd'
    
    
@app.route('/register',methods=['POST'])
def register():
    mongo = pymongo.MongoClient('mongodb+srv://satyam:mongodb1234@planster-c1-tjz95.mongodb.net/test?retryWrites=true&w=majority')
    db = pymongo.database.Database(mongo, 'db1')
    usercol = pymongo.collection.Collection(db, 'usercol')    
    username = request.json['username']    
    db.usercol.insert({"username":username})
    
    return jsonify({}),200


@app.route('/getUser',methods=['GET'])
def getUser():
    return current_user


@app.route('/login',methods=['POST'])
def login():
    return "asf"
    #mongo = pymongo.MongoClient('mongodb+srv://satyam:mongodb1234@planster-c1-tjz95.mongodb.net/test?retryWrites=true&w=majority', maxPoolSize=50, connect=False)    
    #db = pymongo.database.Database(mongo, 'db1')
    #usercol = pymongo.collection.Collection(db, 'usercol')
    return jsonify({}),200
    if request.method == 'POST':
        inputUser = request.json['username']
        inputPass = request.json['password']
        
        #exuser = db.usercol.find({"username":inputUser})
        '''
        if inputUser in exuser:
            if exuser.password == inputPass:
                current_user = inputUser
                return jsonify({}),200
            else:
                return jsonify({}),400        
                    
            '''
    return jsonify({}),200
    
    
    
    
if __name__ == '__main__':
    app.run(debug=True)    
    
    
    
    
    
    