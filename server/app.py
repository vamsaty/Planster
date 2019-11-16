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
# import recommender1 as recom
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

#DONE
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
                         
    if(usercol.find_one({ "email" : email })):
        return "email exists!", 400

    if(usercol.find_one({ "username" : username })):
        return "username exists!", 400
    
    usercol.insert_one({
                "name":name,"email":email,
                "username":username,"password":password,
                "age":age, "phone":phone, "address":address, 
                "city":city, "total_expense": 0, 
                "current_groups":[], "old_groups":[],
                "friends":[], "trips":[]
                })

    return "registered Successfully", 201

#DONE
@app.route('/api/v1/login',methods=['POST'])
def login():
    #received
    username =  request.json['username']
    password = request.json['password']

    # token_bool = request.json['returnSecureToken']

    current_user = usercol.find_one({ "username" : username })
    
    if current_user:
        if current_user['password'] == password:
            # maybe have the other one as user_id and token

            user_id = str(current_user['_id'])
            token = username
            name = current_user['name']
            return jsonify({
                "userId" : user_id,
                "token" : token,
                "name": name
                }), 200
        else:
            return "password incorrect!",400
    
    return "username does not exist!",400



@app.route('/api/v1/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    session.pop('user_id', None)
    return "",200

#DONE
@app.route('/api/v1/user/friend/add', methods=['POST'])
def add_friend():

    username = request.json['username']
    friend_username = request.json['friend_username']

    friend = usercol.find_one({ "username" : friend_username })
    user = usercol.find_one({ "username" : username })
    
    if friend :
        
        friend_id = str(friend.get('_id'))
        user_id = str(user.get('_id'))
        
        usercol.update({ '_id' : user['_id'] },
        { '$push': { 'friends': friend_id } })

        usercol.update({ '_id': friend['_id'] },
        { '$push': { 'friends': user_id } })

        return "friend added", 200

    return "this username does not exist", 400



@app.route('/api/v1/user/friend/delete',methods = ['DELETE'])
def del_friend():
    friend_username = request.json['friend_username']
    current_username = request.json['current_username']

    friend = usercol.find_one({"username":friend_username}) 
    

    user = usercol.find_one({"username" : current_username})
    
    

    if(friend and user):
        user_id = (user.get('_id'))
        friend_id = (friend.get('_id'))

        usercol.update_one({'_id' : ObjectId(user['_id'])},
        {'$pop': {'friends': friend_id }})
        usercol.update_one({'_id': ObjectId(friend['_id'])}, 
        {'$pop': {'friends': user_id}})

        return "friend removed",201
        
    return "username doesn't exist",404


#DONE
@app.route('/api/v1/groups/create/<username>',methods=['POST'])
def create_group(username):

    username = request.json['username']
    user = usercol.find_one({ "username" : username })
    admin_id = str(user.get('_id'))
 
    name = request.json['name']
 
    group_id = groupscol.insert({ "name" : name, "admin_id" : admin_id, "expense" : 0, "current_users" : [admin_id], "old_users" : [], "trips" : []})
    group_id = str(group_id)

    current_groups = user['current_groups']
    current_groups.append([group_id,0])
    usercol.update_one({"_id":ObjectId(admin_id)},{ "$set" :{ "current_groups" : current_groups } })
    return jsonify({ 
        "message":"Created" 
        }), 201



@app.route('/api/v1/groups/<group_name>', methods=['GET'])
def view_group(group_name):
    current_group = groupscol.find_one({"name":group_name})

    if(current_group):
        # session['group_id']= str(current_group.get('_id'))
        # print(str(session['group_id']))
        
        group_id = str(current_group.get('_id'))

        a = []

        for x in current_group:
            
            if x == "current_users":
                
                c_users = []
                for user in current_group[x]:
                    user_name = usercol.find_one({'_id' : ObjectId(user)})
                    if user_name :
                        c_users.append({ '_id' : str(user_name['_id']), 'value' : user_name['username'] })

                a.append( { 'name' : x, 'value' : c_users})

            elif x == 'trips':
                
                trips = []
                for trip in current_group[x]:
                    trip_name = tripscol.find_one({'_id' : ObjectId(trip)})
                    
                    if trip_name:
                        trips.append({ '_id' : str(trip_name['_id']), 'value' : trip_name['name'] })

                a.append( { 'name' : x, 'value' : trips})

            elif x == 'old_users':
                
                o_users = []
                for user in current_group[x]:
                    user_name = usercol.find_one({'_id' : ObjectId(user)})
                    if user_name :
                        c_users.append({ '_id' : str(user_name['_id']), 'value' : user_name['username'] })

                a.append( { 'name' : x, 'value' : o_users})

            elif x != '_id':
                    a.append( { 'name':x, 'value' : current_group[x] } )

            # else : 
            #     a.append( {'name' : x, 'value' : str(current_group[x] ) } )

        return json.dumps(a), 200

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
    
    group_id = request.json['groupId']
    current_user = request.json['current_user']
    friend_username = request.json['friend_username']

    # group = groupscol.find_one({"_id":ObjectId(group_id)})
    group = groupscol.find_one({"name" : group_id})
    user = usercol.find_one({"username":friend_username})
    

    if(group['admin_id'] == current_user and user):
        
        current_users = group["current_users"]
        current_users.append(str(user.get('_id')))

        group_id = str(group.get('_id'))
        groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"current_users":current_users}})
        
        current_groups = user['current_groups']
        current_groups.append([group_id,0])
        usercol.update_one({"username" : user['username']},{ "$set" :{"current_groups":current_groups}})
        
        return "Added successfully",201

    return "permission denied",403

#DONE
@app.route('/api/v1/groups/list/<username>',methods=['GET'])
def list_group(username):
    user = usercol.find_one({"username":username})
    # user = usercol.find_one({"_id": session['user_id']})
    groups = []
    
    for i in user['current_groups']:
        group=groupscol.find_one({"_id":ObjectId(i[0])})
        groups.append(group["name"])
    
    return jsonify({
        "groups" : groups
    }),200
    

@app.route('/api/v1/trips/list/<username>/<group>',methods=['GET'])
def list_trips(username,group):
    user = usercol.find_one({"username" : username})
    user_id = user['_id']

    trips = []
    groups = groupscol.find({ "name" : group })
    for group in groups:
        for x in group['current_users']:
            if user_id == x[1]:
                trips.append(group['trips'])

    return jsonify({
        "trips" : trips
    }),200



@app.route('/api/v1/groups/del_user',methods=['DELETE'])
def del_user_from_group():
    

    admin_id = request.json['userId']
    group_id = request.json['groupId']
    #friend's username
    username = request.json['username']

    # group_id=session['group_id']

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
        return "Delete the user",204
    return "permission denied",403


@app.route('/api/v1/groups/user_leave',methods=['DELETE'])
def user_leave_from_group():
    # user_id=session['user_id']
    # group_id=session['group_id']

    user_id = request.json['userId']
    group_id = request.json['groupId']

    group = groupscol.find_one({"_id":ObjectId(group_id)})
    user = usercol.find_one({"_id":ObjectId(user_id)})
    current_users = group["current_users"]
    current_users.remove(user_id)
    old_users = group["old_users"]
    old_users.append(user_id)
    groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"current_users":current_users}})
    groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"old_users":old_users}})
    current_groups=user["current_groups"]
    
    for x in current_groups:
        if(x[0] == group_id):
            current_groups.remove(x)
            break

    old_groups = user["old_groups"]
    old_groups.append(x)
    usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"current_groups":current_groups}})
    usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"old_groups":old_groups}})
    
    return "Left the group",204
    

#DONE
@app.route('/api/v1/groups/del/<group_name>',methods=['DELETE'])
def del_group(group_name):
    group = groupscol.find_one({ "name" : group_name })
    group_id = str(group.get('_id'))
    
    username = request.json['username']
    current_user = usercol.find_one({'username' : username})
    admin_id = str(current_user['_id'])
    
    if admin_id == group["admin_id"] :

        for x in usercol.find():
            current_groups = x['current_groups']
            old_groups = x['old_groups']
            expenses = 0
            for y in current_groups:
                if y[0] == group_id :
                    current_groups.remove(y)
                    expenses += y[1]
            for y in old_groups:
                if y[0] == group_id:
                    old_groups.remove(y)
                    expenses += y[1]
            new_expenses = x['total_expense']
            new_expenses = new_expenses-expenses
            usercol.update_one(
                { "_id":ObjectId(x["_id"]) },
                { "$set" : { "current_groups" : current_groups }})
            usercol.update_one(
                {"_id":ObjectId(x["_id"])},
                { "$set" : { "old_groups" : old_groups } })
            usercol.update_one(
                {"_id":ObjectId(x["_id"])},
                { "$set" : {"total expenses" : new_expenses } })
            
        for x in group['trips']:
            trip = tripscol.find_one({"_id":ObjectId(x)})
            requests.delete('http://127.0.0.1:5000/api/v1/trips/del_trip/' + trip['name'])
        group = groupscol.delete_one({ "_id" : ObjectId(group_id) })

        return "Deleted Successfully",204
    return "permission denied!",403


#DONE
@app.route('/api/v1/trips/create',methods=['POST'])
def create_trip():
    
    admin_id = request.json['current_user']
    
    # group_name actually
    group_id = request.json['groupId']
    group_id = groupscol.find_one({'name' : group_id })

    location = request.json['location']
    ndays = request.json['no_of_days']
    name = request.json['name']

    tentative_date_range={}

    group = group_id
    group_id = str(group.get('_id'))


    if group['admin_id'] == admin_id :

        trip_id = tripscol.insert({
            "admin_id" : admin_id,
            "name" : name,
            "location" : location,
            "group_id" : group_id,
            "no_of_days" : ndays,
            "individual_expense" : [],
            "tentative_date_range" : tentative_date_range,
            'events' : []
        })
        
        trip_id = str(trip_id)
        new_trips = []

        for x in group['trips']:
            new_trips.append(x)

        new_trips.append(trip_id)
        groupscol.update_one(
            { "_id" : ObjectId(group_id) },
            {"$set" : { "trips":new_trips }
        })

        for x in group["current_users"]:
            user = usercol.find_one({ "_id" : ObjectId(x) })
            new_trips = []
            for i in user['trips']:
                new_trips.append(i)

            new_trips.append(trip_id)

        usercol.update_one({"_id" : ObjectId(x)}, { "$set" :{"trips" : new_trips }})

        return "", 201

    else:

        return "", 403


#DONE
@app.route('/api/v1/trips/del_trip/<trip_name>', methods=['DELETE'])
def delete_trip(trip_name):

    trip = tripscol.find_one({"name":trip_name})
    trip_id = str(trip.get('_id'))
    group_id = trip["group_id"]
    group = groupscol.find_one({"_id" : ObjectId(group_id)})
    old_trips = group["trips"]
    
    new_trips = []
    for i in old_trips:
        if i == trip_id :
            continue
        else:
            new_trips.append(i) 

    groupscol.update_one({"_id" : ObjectId(group_id)},{"$set" : {"trips" : new_trips}})

    for x in group["current_users"]:
            user = usercol.find_one({"_id" : ObjectId(x)})
            new_trips = user["trips"]
            new_trips.remove(trip_id)
            usercol.update_one({"_id" : ObjectId(x)},{ "$set" : {"trips" : new_trips}})

    for x in group["old_users"]:
            user = usercol.find_one({"_id" : ObjectId(x)})
            new_trips = user["trips"]
            new_trips.remove(trip_id)
            usercol.update_one({"_id" : ObjectId(x)},{ "$set" : {"trips" : new_trips}})

    tripscol.delete_one({"_id" : ObjectId(trip_id)})
    return "",204




@app.route('/api/v1/trips/<trip_name>', methods=['GET'])
def view_trip(trip_name):
    current_trip = tripscol.find_one({ "name" : trip_name})
    if current_trip :
        pass
        # session['trip_id']= str(current_trip['_id'])
        # print(str(session['trip_id']))
        return "",200

    return "trip not created yet",404
    


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
    



#DONE
@app.route('/api/v1/friends/list/<current_user>', methods=['GET'])
def list_friends(current_user):

    user = usercol.find_one({'username' : current_user })
    friends = user["friends"]
    friends = []

    for i in user['friends']:
        friend = usercol.find_one({ "_id" : ObjectId(i) })
        friends.append(friend["username"])
    
    return jsonify({ "friends" : friends }), 200


@app.route('/api/v1/user/expenses', methods=['GET'])#HAVE TO CHANGE LATER
def get_expense():
    current_user = usercol.find_one({"_id" : ObjectId(session['user_id'])})
    expense = current_user["total_expense"]
    return jsonify({"expense":expense}), 200
    

@app.route('/api/v1/del_user', methods=['DELETE'])
def del_user():
    print(session['user_id'])
    return "", 204
  

  
# @app.route('/api/v1/places/recommend',methods=['POST'])
# def recommend_places():
#     # cost=request.json('cost')
#     # seating=request.json('seating')
#     # location=request.json('location')
#     # category=request.json('category')
#     # preference=request.json('preference')
#     # output=dummy_recommender(cost,seating,location,category,preference)
#     query = request.json['query']
#     output = recom.recommender(query)
    
#     return jsonify({"Places":output}),200 #a string ,not a list,map UI accordingly


@app.route('/api/v1/trips/create_event', methods=['POST'])
def create_event():
    name = request.json['name']
    location = request.json['location']
    time = request.json['time']
    current_trip = tripscol.find_one({"_id":ObjectId(session['trip_id'])})
    new_event = {"event_name": name, "location":location, "time":time}
    tripscol.update({'_id':current_trip['_id']}, {'$push':{'events':new_event}})
    
@app.route('/api/v1/trips/view_events', methods=['GET'])
def view_events():
    current_trip = tripscol.find_one({"_id":ObjectId(session['trip_id'])})
    events = current_trip["events"]
    return jsonify({"events":events}), 200

@app.route('/api/v1/trips/delete_event/<event_name>', methods=['GET'])
def delete_event(event_name):
    tripscol.update({"_id":ObjectId(session['trip_id'])}, { "$pull": { "events": {"name":event_name }}})
    return "", 200
        
#HAVE TO ADD UPDATE EVENT







@app.route('/api/v1/groups/add_friend/suggest',methods=['GET'])
def suggest_friend():
    #admin_id=session['user_id']
    #group_id=session['group_id']
    admin_id = "5db8edbd25ba4817314eb20d"
    group_id = "5dc759acad237b7741e40f13"
    group=groupscol.find_one({"_id":ObjectId(group_id)})
    print(group["name"])
    suggested_friends_ids = set()
    admin_user = usercol.find_one({"_id":ObjectId(admin_id)})
    #print(admin_user["name"])
    for u_id in group["current_users"]:
        if u_id != admin_id:
            user = usercol.find_one({"_id":ObjectId(u_id)})
            #print(user["name"])
            common_friends = set(user["friends"]) & set(admin_user["friends"])
            #print(common_friends)
            suggested_friends_ids.update(common_friends - set(group["current_users"]))
    suggested_friends = set()
    if(len(suggested_friends_ids) != 0):
        for s_id in suggested_friends_ids:
            user = usercol.find_one({"_id":ObjectId(s_id)})
            suggested_friends.add(user["name"])
        
    return jsonify({
            "suggested": list(suggested_friends)
        }), 200



# TRACKER

@app.route('/api/v1/setlocation/<name>',methods=['POST'])
def setlocation(name):
    latitude=request.json['latitude']
    longitude=request.json['longitude']
    print(latitude)
    usercol.update_one({"name":name},{ "$set" :{"latitude":latitude}})
    usercol.update_one({"name":name},{ "$set" :{"longitude":longitude}})
    return "",200


@app.route('/api/v1/getlocation/<name>',methods=['GET'])
def getlocation(name):
    user=usercol.find_one({"name":name})
    print(user["latitude"])
    print(user["longitude"])
    return jsonify({"latitude":user["latitude"],"longitude":user["longitude"],"name":name}),200



@app.route('/api/v1/groups/list/members/<groupname>',methods=['GET'])
def list_members(groupname):
    group=groupscol.find_one({"name":groupname})
    members=[]
    for i in group["current_users"]:
        user=usercol.find_one({"_id":ObjectId(i)})
        members.append(user["name"])
    print(members)
    return jsonify({"members":members}),200


app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'


if __name__ == '__main__':
    app.run(debug=True)
    
