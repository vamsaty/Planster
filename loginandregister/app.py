# -*- coding: utf-8 -*-
"""
Created on Mon Oct 14 09:10:45 2019

@author: satys
"""    
import json
from flask import Flask, render_template, Markup, request, redirect, jsonify, abort, session, redirect, url_for, escape

import requests
from flask_cors import CORS
#from form import myForm
from flask_static_compress import FlaskStaticCompress
#from currenttime import yourtime, prettytime
import logging
from flask_pymongo import PyMongo
import pymongo
from bson.objectid import ObjectId


app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb+srv://satyam:mongodb1234@planster-c1-tjz95.mongodb.net/test?retryWrites=true&w=majority"

mongo = pymongo.MongoClient('mongodb+srv://satyam:mongodb1234@planster-c1-tjz95.mongodb.net/test?retryWrites=true&w=majority', maxPoolSize=50, connect=False)

#mongo = PyMongo(app)

db = pymongo.database.Database(mongo, 'db1')
usercol = pymongo.collection.Collection(db, 'usercol')
groupscol=pymongo.collection.Collection(db,'groupscol')


@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
def index():
    if('username' in session):
        print("Currents user's ID is %s" % session['id'])
        return 'Logged in as %s' % escape(session['username'])
    return 'You are not logged in'


@app.route('/api/v1/register',methods=['POST'])
def registration():
    name =  request.form['name']
    email =  request.form['email']
    username =  request.form['username']
    password = request.form['password']
    age = request.form['age']
    phone = request.form['phone']
    address = request.form['address']
    city = request.form['city']
                         
    if(usercol.find_one({"Email":email})):
        return "Email exists!",400
    if(usercol.find_one({"Username":username})):
        return "Username exists!",400
    usercol.insert({"Name":name,"Email":email,"Username":username,"Password":password,"Age":age, "Phone":phone, "Address":address, "City":city, "Total Expense": 0, "Current_Groups":[], "Old_Groups":[],"Friends":[], "Trips":[]});
    return "",201

@app.route('/api/v1/login',methods=['POST'])
def login():
    username =  request.form['username'];
    password = request.form['password'];
    x=usercol.find_one({"Username":username})
    print(x)
    if(not(x)):
        return "Username does not exist!",400
    if(x):
        if(x['Password']==password):
            session['id']= str(x['_id'])
            session['username'] = x['Username']
            print(str(session['id']))
            print("Done")
            return "",200
        else:
            return "Password Incorrect!",400

@app.route('/api/v1/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    session.pop('id', None)
    return "",201

@app.route('/api/v1/add_friend/<friend_username>', methods=['POST'])
def add_friend(friend_username):
    friend = usercol.find_one({"Username":friend_username}) 
    if(friend):
        print("Found")
        user=usercol.find_one({"_id":ObjectId(session['id'])})
        print(user)
        """new_friends = user['Friends']
        new_friends.append(friend)
        usercol.update_one({"_id":ObjectId(current_user_id)},{ "$set" :{"Friends":new_friends}})"""
        usercol.update({'_id': ObjectId(session['id'])}, {'$push': {'Friends': friend['_id']}})
        usercol.update({'_id': friend['_id']}, {'$push': {'Friends': user['_id']}})
        return "Friend Added", 200
    return "This username does not exist", 204
    
@app.route('/api/v1/groups/create',methods=['POST'])
def create_group():
    admin_id= request.form['user_id']
    name=request.form['Name']
    group_id=groupscol.insert({"Name":name,"AdminId":admin_id,"Expense":0,"Current_Users":[admin_id],"Old_Users":[],"Trips":[]})
    user=usercol.find_one({"_id":ObjectId(admin_id)})
    group_id=str(group_id)
    #print(x)
    current_groups=user['Current_Groups']
    current_groups.append([group_id,0])
    #print(new_groups)
    usercol.update_one({"_id":ObjectId(admin_id)},{ "$set" :{"Current_Groups":current_groups}})
    return "",201

@app.route('/api/v1/groups/<group_name>', methods=['GET'])
def view_group(group_name):
    current_group_id = groupscol.find_one({"Name":group_name})["_id"]
    if(current_group_id):
        return "",200
    return "Group Not Found",204

@app.route('/api/v1/groups/add_user',methods=['POST'])
def add_friend_to_group():
    admin_id=request.form['admin_id']
    username=request.form['username']
    group_id=request.form['group_id']
    group=groupscol.find_one({"_id":ObjectId(group_id)})
    user=usercol.find_one({"Username":username})
    user_id=user.get('_id')
    if(group['AdminId']==admin_id):
        current_users=group["Current_Users"]
        current_users.append(user_id)
        groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"Current_Users":current_users}})
        current_groups=user['Current_Groups']
        current_groups.append([group_id,0])
        usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"Current_Groups":current_groups}})
        return "",201
    return "Permission Denied",403


    
@app.route('/api/v1/groups/list/<username>',methods=['GET'])
def list_group(username):
    user=usercol.find_one({"Username":username})
    return jsonify({"Current_Groups":user["Current_Groups"],"Old_Groups":user["Old_Groups"]}),200

@app.route('/api/v1/groups/del_user',methods=['DELETE'])
def del_user_from_group():
    admin_id=request.form['admin_id']
    username=request.form['username']
    group_id=request.form['group_id']
    group=groupscol.find_one({"_id":ObjectId(group_id)})
    if(group['AdminId']==admin_id):
        user=usercol.find_one({"Username":username})
        user_id=user.get("_id")
        current_users=group["Current_Users"]
        current_users.remove(user_id)
        old_users=group["Old_Users"]
        old_users.append(user_id)
        groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"Current_Users":current_users}})
        groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"Old_Users":old_users}})
        current_groups=user["Current_Groups"]
        for x in current_groups:
            if(x[0]==group_id):
                current_groups.remove(x)
                break
        old_groups=user["Old_Groups"]
        old_groups.append(x)
        usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"Current_Groups":current_groups}})
        usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"Old_Groups":old_groups}})
        return "",204
    return "Permission Denied",403

@app.route('/api/v1/groups/user_leave',methods=['DELETE'])
def user_leave_from_group():
    user_id=request.form['user_id']
    group_id=request.form['group_id']
    group=groupscol.find_one({"_id":ObjectId(group_id)})
    user=usercol.find_one({"_id":ObjectId(user_id)})
    current_users=group["Current_Users"]
    current_users.remove(user_id)
    old_users=group["Old_Users"]
    old_users.append(user_id)
    groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"Current_Users":current_users}})
    groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"Old_Users":old_users}})
    current_groups=user["Current_Groups"]
    for x in current_groups:
        if(x[0]==group_id):
            current_groups.remove(x)
            break
    old_groups=user["Old_Groups"]
    old_groups.append(x)
    usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"Current_Groups":current_groups}})
    usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"Old_Groups":old_groups}})
    return "",204
    
@app.route('/api/v1/groups/del/<group_name>',methods=['DELETE'])
def del_group(group_name):
    group_id = groupscol.find_one({"Name":group_name})["_id"]
    admin_id=request.form['admin_id']
    group=groupscol.find_one({"_id":ObjectId(group_id)})
    for x in usercol.find():
        current_groups=x['Current_Groups']
        old_groups=x['Old_Groups']
        expenses=0
        for y in current_groups:
            if(y[0]==group_id):
                current_groups.remove(y)
                expenses+=y[1]
        for y in old_groups:
            if(y[0]==group_id):
                old_groups.remove(y)
                expenses+=y[1]
        usercol.update_one({"_id":ObjectId(x["_id"])},{ "$set" :{"Current_Groups":current_groups}})
        usercol.update_one({"_id":ObjectId(x["_id"])},{ "$set" :{"Old_Groups":old_groups}})
        usercol.update_one({"_id":ObjectId(x["_id"])},{ "$set" :{"Total Expenses":expenses}})
    for x in group['Trips']:
        requests.delete('http://127.0.0.1:5000/api/v1/trips/del'+x)
    group=groupscol.delete_one({"_id":ObjectId(group_id)})
    return "",204

app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'


if __name__ == '__main__':
    app.run(debug=True)
    