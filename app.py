# -*- coding: utf-8 -*-
"""
Created on Mon Oct 14 09:10:45 2019

@author: satys
"""    
import json
from flask import Flask, render_template, Markup, request, redirect, jsonify, abort, session, redirect, url_for, escape
from datetime import datetime
import requests
from flask_cors import CORS
#from form import myForm
from flask_static_compress import FlaskStaticCompress
#from currenttime import yourtime, prettytime
import logging
from flask_pymongo import PyMongo
import pymongo

from bson.objectid import ObjectId
from bson import json_util

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
        print("currents user's id is %s" % session['user_id'])
        return 'logged in as %s' % escape(session['username'])
    return 'you are not logged in'


@app.route('/api/v1/register',methods=['POST'])
def registration():
    name =  request.json['name']
    email =  request.json['email']
    username =  request.json['username']
    password = request.json['password']
    age = request.json['age']
    phone = request.json['phone']
    address = request.json['address']
    city = request.json['city']
                         
    if(usercol.find_one({"email":email})):
        return "Email exists!",400
    if(usercol.find_one({"username":username})):
        return "Username already exists!",400
    
    usercol.insert({
                "name":name,"email":email,
                "username":username,"password":password,
                "age":age, "phone":phone, "address":address, 
                "city":city, "total_expense": 0, 
                "current_groups":[], "old_groups":[],
                "friends":[], "trips":[]
                })

    return "",201

@app.route('/api/v1/login',methods=['POST'])
def login():
    username =  request.json['username']
    password = request.json['password']
    current_user=usercol.find_one({"username":username})
    
  
    
    print(current_user)
    if(not(current_user)):
        return "Username does not exists!",400
    
    if(current_user):
        if(current_user['password']==password):
            session['user_id']= str(current_user['_id'])
            session['username'] = current_user['username']
            print(str(session['user_id']))
            print("done")
            print(current_user["name"])
            return jsonify({"userData" : session['username'],"Name":current_user["name"]}),200
        else:
            return "Password Incorrect!",400

@app.route('/api/v1/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    session.pop('user_id', None)
    return "",200

@app.route('/api/v1/user/friend/del/<friend_username>',methods=['DELETE'])
def del_friend(friend_username):
    username = request.json["username"]
    friend = usercol.find_one({"name":friend_username}) 
    user = usercol.find_one({"username" : username})
    x=[]
    print(friend)
    if(friend):
        x=user["friends"]
        x.remove(str(friend.get('_id')))
        y=friend["friends"]
        y.remove(str(user.get('_id')))
        usercol.update_one({"_id":friend["_id"]},{ "$set" :{"friends":y}})
        usercol.update_one({"_id":user["_id"]},{ "$set" :{"friends":x}})
        return "",204
        


@app.route('/api/v1/user/friend/add/<username>', methods=['POST'])
def add_friend(username):
    friend_username=request.json['friend_username']
    friend = usercol.find_one({"username":friend_username}) 
    user = usercol.find_one({"username" : username})
    print("gffnujfnf"+friend_username)
    # return friend_username

    if(friend):

        print("found")
        # user=usercol.find_one({"_id":ObjectId(session['user_id'])})
        # print(user)
        
        """new_friends = user['friends']
        new_friends.append(friend)
        usercol.update_one({"_id":ObjectId(current_user_id)},{ "$set" :{"friends":new_friends}})"""


        # usercol.update({'_id': ObjectId(session['user_id'])}, {'$push': {'friends': str(friend.get('_id'))}})

        usercol.update({'_id' : user['_id']}, {'$push': {'friends': str(friend.get('_id'))}})
        usercol.update({'_id': friend['_id']}, {'$push': {'friends': str(user.get('_id'))}})

        return "friend added", 200

    return "This username does not exist", 400
    
@app.route('/api/v1/groups/create/<username>',methods=['POST'])
def create_group(username):
    user = usercol.find_one({"username" : username})
    admin_id = str(user.get('_id'))
    print(admin_id)
    name = request.json['name']
    print(name)
    group_id=groupscol.insert({"name":name,"admin_id":admin_id,"expense":0,"current_users":[admin_id],"old_users":[],"trips":[]})
    group_id=str(group_id)
    current_groups = user['current_groups']
    current_groups.append([group_id,0])
    usercol.update_one({"_id":ObjectId(admin_id)},{ "$set" :{"current_groups":current_groups}})
    return jsonify({"message":"Created"}),201

@app.route('/api/v1/groups/<group_name>', methods=['GET'])
def view_group(group_name):
    current_group = groupscol.find_one({"name":group_name})
    if(current_group):
        session['group_id']= str(current_group.get('_id'))
        print(str(session['group_id']))
        return "",200
    return "group does not exist",404

@app.route('/api/v1/details/<username>', methods=['GET'])
def get_details(username):
    current_user = usercol.find_one({"username" : username})

    # current_user = usercol.find_one({"_id":ObjectId(session['user_id'])})
    if(current_user):
        current_groups = groupscol.find_one({
            "admin_id" : current_user['_id']
        })
    else:
        return jsonify({}),401
    
    user_details = {
        'name' : current_user['name'],
        'email' : current_user['email'],
        'age' : current_user['age'],
        'address' : current_user['address'],
        'groups' : json_util.dumps(current_user["current_groups"])
    }

    return jsonify({
            "details": user_details
        }), 200


@app.route('/api/v1/groups/add_friend',methods=['POST'])
def add_friend_to_group():
    admin_id=session['user_id']
    username=request.json['username']
    group_id=session['group_id']
    group=groupscol.find_one({"_id":ObjectId(group_id)})
    user=usercol.find_one({"username":username})
    user_id=str(user.get('_id'))
    #print(type(user_id))
    if(group['admin_id']==admin_id):
        current_users=group["current_users"]
        current_users.append(user_id)
        groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"current_users":current_users}})
        current_groups=user['current_groups']
        current_groups.append([group_id,0])
        usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"current_groups":current_groups}})
        return "",201
    return "permission denied",403


@app.route('/api/v1/groups/list/<username>',methods=['GET'])
def list_group(username):
    user=usercol.find_one({"username":username})
    groups = []
    for i in user['current_groups']:
        group=groupscol.find_one({"_id":ObjectId(i[0])})
        groups.append(group["name"])
    return jsonify({
        "groups" : groups
    }),200
    # return jsonify({}),201


@app.route('/api/v1/groups/del_user',methods=['DELETE'])
def del_user_from_group():
    admin_id=session['user_id']
    username=request.json['username']
    group_id=session['group_id']
    group=groupscol.find_one({"_id":ObjectId(group_id)})
    if(group['admin_id']==admin_id):
        user=usercol.find_one({"username":username})
        user_id=str(user.get("_id"))
        current_users=group["current_users"]
        current_users.remove(user_id)
        old_users=group["old_users"]
        old_users.append(user_id)
        groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"current_users":current_users}})
        groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"old_users":old_users}})
        current_groups=user["current_groups"]
        for x in current_groups:
            if(x[0]==group_id):
                current_groups.remove(x)
                break
        old_groups=user["old_groups"]
        old_groups.append(x)
        usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"current_groups":current_groups}})
        usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"old_groups":old_groups}})
        return "",204
    return "permission denied",403

@app.route('/api/v1/groups/user_leave',methods=['DELETE'])
def user_leave_from_group():
    user_id=session['user_id']
    group_id=session['group_id']
    group=groupscol.find_one({"_id":ObjectId(group_id)})
    user=usercol.find_one({"_id":ObjectId(user_id)})
    current_users=group["current_users"]
    current_users.remove(user_id)
    old_users=group["old_users"]
    old_users.append(user_id)
    groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"current_users":current_users}})
    groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"old_users":old_users}})
    current_groups=user["current_groups"]
    for x in current_groups:
        if(x[0]==group_id):
            current_groups.remove(x)
            break
    old_groups=user["old_groups"]
    old_groups.append(x)
    usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"current_groups":current_groups}})
    usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"old_groups":old_groups}})
    return "",204
    
@app.route('/api/v1/groups/del/<group_name>',methods=['DELETE'])
def del_group(group_name):
    group = groupscol.find_one({"name":group_name})
    group_id=str(group.get('_id'))
    username=request.json['username']
    print('username')
    user = usercol.find_one({"username" : username})
    admin_id = str(user.get('_id'))
    if(admin_id==group["admin_id"]):
        for x in usercol.find():
            current_groups=x['current_groups']
            old_groups=x['old_groups']
            expenses=0
            for y in current_groups:
                if(y[0]==group_id):
                    current_groups.remove(y)
                    expenses+=y[1]
            for y in old_groups:
                if(y[0]==group_id):
                    old_groups.remove(y)
                    expenses+=y[1]
            new_expenses=x['total_expense']
            new_expenses=new_expenses-expenses
            usercol.update_one({"_id":ObjectId(x["_id"])},{ "$set" :{"current_groups":current_groups}})
            usercol.update_one({"_id":ObjectId(x["_id"])},{ "$set" :{"old_groups":old_groups}})
            usercol.update_one({"_id":ObjectId(x["_id"])},{ "$set" :{"total expenses":new_expenses}})
            print(new_expenses)
        for x in group['trips']:
            trip=tripscol.find_one({"_id":ObjectId(x)})
            requests.delete('http://127.0.0.1:5000/api/v1/trips/del_trip/'+trip['name'])
        group=groupscol.delete_one({"_id":ObjectId(group_id)})
        return "",204
    return "permission denied!",403


@app.route('/api/v1/trips/create',methods=['POST'])
def create_trip():
    admin_id= session['user_id']
    location= request.json['location']
    group_id= session['group_id']
    ndays= request.json['no_of_days']
    name= request.json['name']
    tentative_date_range={}
    trip_id=tripscol.insert({"admin_id":admin_id,"name":name,"location":location,"group_id":group_id,"no_of_days":ndays, "individual_expense":[], "tentative_date_range":tentative_date_range})
    trip_id=str(trip_id)
    group=groupscol.find_one({"_id":ObjectId(group_id)})
    if(group['admin_id']==admin_id):
        new_trips=group["trips"]
        new_trips.append(trip_id)
        groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"trips":new_trips}})
        for x in group["current_users"]:
            user=usercol.find_one({"_id":ObjectId(x)})
            new_trips=user["trips"]
            new_trips.append(trip_id)
            usercol.update_one({"_id":ObjectId(x)},{ "$set" :{"trips":new_trips}})
    return "",201

@app.route('/api/v1/trips/del_trip/<trip_name>', methods=['DELETE'])
def delete_trip(trip_name):
    trip=tripscol.find_one({"name":trip_name})
    trip_id=str(trip.get('_id'))
    group_id=trip["group_id"]
    group=groupscol.find_one({"_id":ObjectId(group_id)})
    old_trips=group["trips"]
    print(old_trips)
    new_trips=[]
    for i in old_trips:
        if(i==trip_id):
            continue
        else:
            new_trips.append(i) 
    print(new_trips)           
    groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"trips":new_trips}})
    for x in group["current_users"]:
            user=usercol.find_one({"_id":ObjectId(x)})
            new_trips=user["trips"]
            new_trips.remove(trip_id)
            usercol.update_one({"_id":ObjectId(x)},{ "$set" :{"trips":new_trips}})
    for x in group["old_users"]:
            user=usercol.find_one({"_id":ObjectId(x)})
            new_trips=user["trips"]
            new_trips.remove(trip_id)
            usercol.update_one({"_id":ObjectId(x)},{ "$set" :{"trips":new_trips}})
    tripscol.delete_one({"_id":ObjectId(trip_id)})
    return "",204

@app.route('/api/v1/trips/<trip_name>', methods=['GET'])
def view_trip(trip_name):
    current_trip = tripscol.find_one({"name":trip_name})
    if(current_trip):
        session['trip_id']= str(current_trip['_id'])
        print(str(session['trip_id']))
        return "",200
    return "trip not created yet",404
    return "", 200
    
@app.route('/api/v1/trips/set_dates', methods=['POST'])#@app.route('/api/v1/trips/<trip_name>/set_dates', methods=['POST'])
def set_free_dates():#def set_free_dates(trip_name):
    print(session['trip_id'])
    current_trip = tripscol.find_one({"_id":ObjectId(session['trip_id'])})
    print(current_trip)
    start_date = datetime.strptime(request.json['start_date'], '%d %m %y')
    end_date = datetime.strptime(request.json['end_date'], '%d %m %y')
    if((end_date - start_date).days > int(current_trip['no_of_days'])):
        return "choose lesser days", 400
    date_range = {'start_date': start_date, 'end_date': end_date} 
    #pref_date = 
    #tripscol.update({'_id': current_trip['_id']}, {'$push': {'tentative_date_range': {session['user_id']: date_range}}})
    return "", 200

@app.route('/api/v1/trips/schedule_trip', methods = ['POST'])
def schedule_dates():
    current_trip = tripscol.find_one({"_id":ObjectId(session['trip_id'])})
    if(session['user_id'] == current_trip['admin_id']):
        pref_dates =current_trip["tentative_date_range"]
        for date in pref_dates:
            s_d = max(d['start_date'] for d in date.values())
            e_d = min(d['end_date'] for d in date.values())
            if((e_d - s_d).days > current_trip['no_of_days']):
                e_d = s_d + timedelta(days=5)
            elif((e_d - s_d).days < 0):
                return "cannot schedule trip", 400
            f_d ={"start_date":s_d, "end_date":e_d}
            #tripscol.update({'_id': current_trip['_id']}, {'$set': {'final_date': f_d}})
        return "", 201
    return "", 401
    

    

@app.route('/api/v1/user/friends/list/<current_user>', methods=['GET'])
def list_friends(current_user):
    # current_user = usercol.find_one({"_id":ObjectId(session['user_id'])})

    user = usercol.find_one({'username' : current_user })

    friends = user["friends"]
    friends = []
    for i in user['friends']:
        friend=usercol.find_one({"_id":ObjectId(i)})
        friends.append(friend["name"])
    
    return jsonify({"friends":friends}), 200

@app.route('/api/v1/user/expenses', methods=['GET'])#HAVE TO CHANGE LATER
def get_expense():
    current_user = usercol.find_one({"_id":ObjectId(session['user_id'])})
    expense = current_user["total_expense"]
    return jsonify({"expense":expense}), 200
    

@app.route('/api/v1/del_user', methods=['DELETE'])
def del_user():
    print(session['user_id'])
    return "", 204
  
@app.route('/api/v1/places/recommend',methods=['POST'])
def recommend_places():
    cost=request.json('cost')
    seating=request.json('seating')
    location=request.json('location')
    category=request.json('category')
    preference=request.json('preference')
    output=dummy_recommender(cost,seating,location,category,preference)
    return jsonify({"Places":output}),200


app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'


if __name__ == '__main__':
    app.run(debug=True)
    
