# -*- coding: utf-8 -*-
"""
Created on Mon Oct 14 09:10:45 2019

@author: satys
"""    
import json
from flask import Flask, render_template, Markup, request, jsonify, abort, session, redirect, url_for, escape
from datetime import datetime, timedelta
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
tripscol=pymongo.collection.Collection(db,'tripscol')


@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
def index():
    if('username' in session):
        print("Currents user's ID is %s" % session['user_id'])
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
    usercol.insert({"Name":name,"Email":email,"Username":username,"Password":password,"Age":age, "Phone":phone, "Address":address, "City":city, "Total Expense": 0, "Groups":[], "Friends":[], "Trips":[]});
    return "",201

@app.route('/api/v1/login',methods=['POST'])
def login():
    username =  request.form['username'];
    password = request.form['password'];
    current_user=usercol.find_one({"Username":username})
    print(current_user)
    if(not(current_user)):
        return "Username does not exist!",400
    if(current_user):
        if(current_user['Password']==password):
            session['user_id']= str(current_user['_id'])
            session['username'] = current_user['Username']
            print(str(session['user_id']))
            print("Done")
            return "",200
        else:
            return "Password Incorrect!",400

@app.route('/api/v1/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    session.pop('id', None)
    return "",201
    
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

@app.route('/api/v1/add_friend/<friend_username>', methods=['POST'])
def add_friend(friend_username):
    friend = usercol.find_one({"Username":friend_username}) 
    if(friend):
        print("Found")
        user=usercol.find_one({"_id":ObjectId(session['user_id'])})
        print(user)
        """new_friends = user['Friends']
        new_friends.append(friend)
        usercol.update_one({"_id":ObjectId(current_user_id)},{ "$set" :{"Friends":new_friends}})"""
        usercol.update({'_id': ObjectId(session['user_id'])}, {'$push': {'Friends': friend['_id']}})
        usercol.update({'_id': friend['_id']}, {'$push': {'Friends': user['_id']}})
        return "Friend Added", 200
    return "This username does not exist", 204

@app.route('/api/v1/groups/add_user',methods=['POST'])
def add_friend_to_group():
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


@app.route('/api/v1/trips/<trip_name>', methods=['GET'])
def view_trip(trip_name):
    current_trip = tripscol.find_one({"Name":trip_name})
    if(current_trip):
        session['trip']= str(current_trip['_id'])
        print(str(session['trip']))
        return "",200
    return "Trip Not Created Yet",404
    return "", 200
    
@app.route('/api/v1/trips/set_dates', methods=['POST'])#@app.route('/api/v1/trips/<trip_name>/set_dates', methods=['POST'])
def set_free_dates():#def set_free_dates(trip_name):
    print(session['trip'])
    current_trip = tripscol.find_one({"_id":ObjectId(session['trip'])})
    print(current_trip)
    start_date = datetime.strptime(request.form['start_date'], '%d %m %Y')
    end_date = datetime.strptime(request.form['end_date'], '%d %m %Y')
    if((end_date - start_date).days > int(current_trip['NoOfDays'])):
        return "Choose lesser days", 400
    date_range = {'start_date': start_date, 'end_date': end_date} 
    #pref_date = 
    tripscol.update({'_id': current_trip['_id']}, {'$push': {'TentativeDateRange': {session['user_id']: date_range}}})
    return "", 200


@app.route('/api/v1/groups/<group_name>', methods=['GET'])
def view_group(group_name):
    current_group = groupscol.find_one({"Name":group_name})["_id"]
    if(current_group):
        session['group']= str(current_group['_id'])
        print(str(session['group']))
        return "",200
    return "Group Does Not Exist",404
    
@app.route('/api/v1/groups/list/<user_id>',methods=['GET'])
def list_group(user_id):
    groups=[]
    for x in groupscol.find():
        for y in x['Users']:
            if(y==user_id):
                groups.append(str(x.get("_id")))
                break
    return jsonify({"Groups":groups}),200

@app.route('/api/v1/user/friends', methods=['GET'])
def list_friends():
    current_user = usercol.find_one({"_id":ObjectId(session['user_id'])})
    friends = current_user["Friends"]
    return jsonify({"Friends":friends}), 200

@app.route('/api/v1/user/expenses', methods=['GET'])#HAVE TO CHANGE LATER
def get_expense():
    current_user = usercol.find_one({"_id":ObjectId(session['user_id'])})
    expense = current_user["Expense"]
    return jsonify({"Expense":expense}), 200

@app.route('/api/v1/trips/schedule_trip', methods = ['POST'])
def schedule_dates():
    current_trip = tripscol.find_one({"_id":ObjectId(session['trip'])})
    if(session['user_id'] == current_trip['AdminId']):
        pref_dates =current_trip["TentativeDateRange"]
        for date in pref_dates:
            s_d = max(d['start_date'] for d in date.values())
            e_d = min(d['end_date'] for d in date.values())
            if((e_d - s_d).days > current_trip['NoOfDays']):
                e_d = s_d + timedelta(days=5)
            elif((e_d - s_d).days < 0):
                return "Cannot Schedule Trip", 400
            f_d ={"start_date":s_d, "end_date":e_d}
            tripscol.update({'_id': current_trip['_id']}, {'$set': {'FinalDate': f_d}})
        return "", 201
    return "", 401
    
@app.route('/api/v1/groups/del_user/<group_id>/<user_id>',methods=['DELETE'])
def del_user_from_group(group_id,user_id):
    print(group_id)
    print(user_id)

    return "",204

@app.route('/api/v1/del_user', methods=['DELETE'])
def del_user():
    print(session[id])
    return "", 204


app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'

if __name__ == '__main__':
    app.run(debug=True)
    