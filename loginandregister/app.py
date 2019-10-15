# -*- coding: utf-8 -*-
"""
Created on Mon Oct 14 09:10:45 2019

@author: satys
"""    

from flask import Flask, render_template, Markup, request, redirect,jsonify,abort
import requests
from flask_cors import CORS
#from form import myForm
from flask_static_compress import FlaskStaticCompress
#from currenttime import yourtime, prettytime
import logging
from flask_pymongo import PyMongo
import pymongo
import json


app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb+srv://satyam:mongodb1234@planster-c1-tjz95.mongodb.net/test?retryWrites=true&w=majority"

mongo = pymongo.MongoClient('mongodb+srv://satyam:mongodb1234@planster-c1-tjz95.mongodb.net/test?retryWrites=true&w=majority', maxPoolSize=50, connect=False)

#mongo = PyMongo(app)

db = pymongo.database.Database(mongo, 'db1')
usercol = pymongo.collection.Collection(db, 'usercol')


@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
def home():
    """Landing page."""
    #data={"userame":"test1","password":"pass","name":"T"}
    #usercol.insert(data)

    #recent_searches = list(col_results)
    #return "Hello"

@app.route('/register',methods=['POST'])
def registration():
    name =  request.form['name'];
    email =  request.form['email'];
    username =  request.form['username'];
    password = request.form['password'];
    age = request.form['age'];
    if(usercol.find_one({"Email":email})):
        return "Email exists!",400
    if(usercol.find_one({"Username":username})):
        return "Username exists!",400
    usercol.insert({"Name":name,"Email":email,"Username":username,"Password":password,"Age":age});
    return "",201

@app.route('/login',methods=['POST'])
def login():
    username =  request.form['username'];
    password = request.form['password'];
    x=usercol.find_one({"Username":username})
    if(not(x)):
        return "Username does not exists!",400
    if(x):
        if(x['Password']==password):
            return "",201
        else:
            return "Password Incorrect!",400

    

if __name__ == '__main__':
    app.run(debug=True)
    