# -*- coding: utf-8 -*-
"""
Created on Mon Oct 14 09:10:45 2019

@author: satys
"""    
import json
from flask import Flask, render_template, Markup, request, redirect,jsonify,abort
import requests
from flask_cors import CORS
#from form import myForm
from flask_static_compress import FlaskStaticCompress
#from currenttime import yourtime, prettytime
import logging
from flask_pymongo import PyMongo
import pymongo
from bson import ObjectId


app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb+srv://satyam:mongodb1234@planster-c1-tjz95.mongodb.net/test?retryWrites=true&w=majority"

mongo = pymongo.MongoClient('mongodb+srv://satyam:mongodb1234@planster-c1-tjz95.mongodb.net/test?retryWrites=true&w=majority', maxPoolSize=50, connect=False)

#mongo = PyMongo(app)

db = pymongo.database.Database(mongo, 'db1')
usercol = pymongo.collection.Collection(db, 'usercol')
groupscol=pymongo.collection.Collection(db,'groupscol')


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
    usercol.insert({"Name":name,"Email":email,"Username":username,"Password":password,"Age":age,"Groups":[]});
    return "",201

@app.route('/login',methods=['POST'])
def login():
    username =  request.form['username'];
    password = request.form['password'];
    x=usercol.find_one({"Username":username})
    print(x)
    if(not(x)):
        return "Username does not exist!",400
    if(x):
        if(x['Password']==password):
            return "",201
        else:
            return "Password Incorrect!",400

@app.route('/api/v1/groups/create',methods=['POST'])
def create_group():
    admin_id= request.form['user_id']
    group_id=groupscol.insert({"AdminId":admin_id,"Expense":0,"Users":[admin_id],"Trips":[]})
    user=usercol.find_one({"_id":ObjectId(admin_id)})
    group_id=str(group_id)
    #print(x)
    new_groups=user['Groups']
    new_groups.append([group_id,0])
    print(new_groups)
    usercol.update_one({"_id":ObjectId(admin_id)},{ "$set" :{"Groups":new_groups}})
    return "",201


@app.route('/api/v1/groups/add_user',methods=['POST'])
def add_friend():
    admin_id=request.form['admin_id']
    user_id=request.form['user_id']
    group_id=request.form['group_id']
    group=groupscol.find_one({"_id":ObjectId(group_id)})
    if(group['AdminId']==admin_id):
        new_users=group["Users"]
        new_users.append(user_id)
        groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"Users":new_users}})
        user=usercol.find_one({"_id":ObjectId(user_id)})
        new_groups=user['Groups']
        new_groups.append([group_id,0])
        usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"Groups":new_groups}})
        return "",201
    return "Permission Denied",403

@app.route('/api/v1/groups/list/<user_id>',methods=['GET'])
def list_group(user_id):
    groups=[]
    for x in groupscol.find():
        for y in x['Users']:
            if(y==user_id):
                groups.append(str(x.get("_id")))
                break
    return jsonify({"Groups":groups}),200

@app.route('/api/v1/groups/del_user/<group_id>/<user_id>',methods=['DELETE'])
def del_user(group_id,user_id):
    print(group_id)
    print(user_id)

    return "",204


if __name__ == '__main__':
    app.run(debug=True)
    