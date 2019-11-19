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
from dateutil import parser
from bson.objectid import ObjectId
from bson import json_util
import base64
import svm_recommend

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb+srv://satyam:mongodb1234@planster-c1-tjz95.mongodb.net/test?retryWrites=true&w=majority"

mongo = pymongo.MongoClient('mongodb+srv://satyam:mongodb1234@planster-c1-tjz95.mongodb.net/test?retryWrites=true&w=majority', maxPoolSize=50, connect=False)

#mongo = PyMongo(app)

db = pymongo.database.Database(mongo, 'db1')
usercol = pymongo.collection.Collection(db, 'usercol')
groupscol=pymongo.collection.Collection(db,'groupscol')
tripscol=pymongo.collection.Collection(db,'tripscol')
filescol = pymongo.collection.Collection(db,'files')
chatscol = pymongo.collection.Collection(db,'chats')
billSplitCol = pymongo.collection.Collection(db, 'billSplit')


@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
def index():
    if('username' in session):
        print("currents user's id is %s" % session['user_id'])
        return 'logged in as %s' % escape(session['username'])
    return 'you are not logged in'

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

@app.route('/api/v1/groups/create/<username>',methods=['POST'])
def create_group(username):
    user = usercol.find_one({"username" : username})
    admin_id = str(user.get('_id'))
    print(admin_id)
    name = request.json['name']
    print(name)
    for i in groupscol.find({}):
        if(i["name"]==name):
            return "Oops!Group name already taken",400
    group_id=groupscol.insert({"name":name,  "admin_id":admin_id,"expense":0,"current_users":[admin_id],"old_users":[],"trips":[]})
    group_id=str(group_id)
    current_groups = user['current_groups']
    current_groups.append([group_id,0])
    usercol.update_one({"_id":ObjectId(admin_id)},{ "$set" :{"current_groups":current_groups}})
    return jsonify({"message":"Created"}),201

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

@app.route('/api/v1/groups/is_admin',methods=['POST'])
def is_admin():
    username=request.json["username"]
    user=usercol.find_one({"username":username})
    admin_id=str(user.get("_id"))
    group_name=request.json["group_name"]
    group=groupscol.find_one({"name":group_name})
    group_admin_id=group["admin_id"]
    if(admin_id==group_admin_id):
        return "Yes",200
    return "No",400

    

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


@app.route('/api/v1/groups/add_friend/<groupname>',methods=['POST'])
def add_friend_to_group(groupname):
    username=request.json['friendname']
    group=groupscol.find_one({"name":groupname})
    group_id=str(group.get("_id"))
    
    user=usercol.find_one({"username":username})
    if(not(user)):
        return "User does not exist!",400
    user_id=str(user.get('_id'))
    #print(type(user_id)
    current_users=group["current_users"]
    current_users.append(user_id)
    groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"current_users":current_users}})
    current_groups=user['current_groups']
    current_groups.append([group_id,0])
    usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"current_groups":current_groups}})
    return "",201
    #return "permission denied",403


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

@app.route('/api/v1/groups/list/members/<groupname>',methods=['GET'])
def list_members(groupname):
    group=groupscol.find_one({"name":groupname})
    members=[]
    for i in group["current_users"]:
        user=usercol.find_one({"_id":ObjectId(i)})
        members.append(user["name"])
    print(members)
    return jsonify({"members":members}),200



@app.route('/api/v1/groups/del_user/<groupname>/<username>',methods=['DELETE'])
def del_user_from_group(groupname,username):
    #username=request.json["username"]
    #groupname=request.json["groupname"
    print(groupname,username)
    group=groupscol.find_one({"name":groupname})
    user=usercol.find_one({"username":username})
    user_id=str(user.get("_id"))
    current_users=group["current_users"]
    current_users.remove(user_id)
    groupscol.update_one({"name":groupname},{"$set":{"current_users":current_users}})
    group_id=str(group.get("_id"))
    current_groups=user["current_groups"]
    for x in current_groups:
        if(x[0]==group_id):
            current_groups.remove(x)
            break
    usercol.update_one({"_id":ObjectId(user_id)},{ "$set" :{"current_groups":current_groups}})
    return "",204
    

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
    

@app.route('/api/v1/groups/add_friend/suggest',methods=['POST'])
def suggest_friend():
    #admin_id=session['user_id']
    #group_id=session['group_id']
    admin =request.json["admin"] 
    groupname = request.json["group"]
    group=groupscol.find_one({"name":groupname})
    print(group["name"])
    suggested_friends_ids = set()
    admin_user = usercol.find_one({"username":admin})
    admin_id=str(admin_user.get("_id"))
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
    else:
        for s_id in admin_user["friends"]:
            if(s_id not in group["current_users"]):
                user = usercol.find_one({"_id":ObjectId(s_id)})
                suggested_friends.add(user["name"])
                
    if len(suggested_friends)== 0:
        return "No more suggestions", 204
    print(list(suggested_friends))
    return jsonify({
            "suggested": list(suggested_friends)
        }), 200

@app.route('/api/v1/trips/set_dates', methods=['POST'])
def set_free_dates():
    username = request.json['username']
    tripname = request.json['tripname']
    date=request.json['date']
    start_date=date[0]
    end_date=date[1]
    pref_date_range = {"start_date":start_date, "end_date":end_date}
    user_pref_date = {"username":username, "pref_range":pref_date_range}
    print(user_pref_date)
    tripscol.update({'location':tripname}, {'$push':{'preferred_dates':user_pref_date}})
    return "Your preference has beet registered", 200

@app.route('/api/v1/trips/schedule_trip', methods = ['POST'])
def schedule_dates():
    tripname = request.json['tripname']
    current_trip = tripscol.find_one({"location":tripname})
    pref_dates =current_trip["preferred_dates"]
    print(pref_dates)
    start_date_list = []
    end_date_list = []
    for date in pref_dates:
        start_date_list.append(date["pref_range"]["start_date"])
        end_date_list.append(date["pref_range"]["end_date"])
    final_start_date = max(s for s in start_date_list)
    final_end_date = min(e for e in end_date_list)
    if (parser.parse(final_end_date) - parser.parse(final_start_date)).days <=0 :
        return "No dates scheduled", 400
    tripscol.update_one({"location":tripname},{ "$set" :{"scheduled":"true"}})
    tripscol.update_one({"location":tripname},{ "$set" :{"scheduled_dates":[final_start_date, final_end_date]}})
    return jsonify({"final_dates":[final_start_date, final_end_date]}), 200

@app.route('/api/v1/trips/check_scheduled/<tripname>',methods=["GET"])
def check_scheduled(tripname):
    current_trip = tripscol.find_one({"location":tripname})
    try:
        start_date=current_trip["scheduled_dates"][0].split('T')[0]
        end_date=current_trip["scheduled_dates"][1].split('T')[0]
    except:
        start_date=0
        end_date=0
        print(current_trip["scheduled"])
    return jsonify({"scheduled":current_trip["scheduled"],"scheduled_dates":[start_date,end_date]})


@app.route('/api/v1/trips/create',methods=['POST'])
def create_trip():
    #request.json={'description': 'in thailand', 'date': ['2019-11-05T18:30:00.000Z', '2019-11-16T18:29:59.999Z'], 'name': 'Bangkok, Thailand', 'group': 'Mumbai'}
    """print(request.json["description"])
    print(request.json["location"])
    print(request.json["date"])
    print(request.json["group"])"""
    location= request.json['location']
    groupname=request.json["group"]
    date=request.json['date']
    description=request.json['description']

    #print(location,group)
    #location='Bangkok, Thailand'
    #description= 'in thailand'
    #date= ['2019-11-05T18:30:00.000Z', '2019-11-16T18:29:59.999Z']
    #group='Mumbai'
    date1=parser.parse(date[0])
    date2=parser.parse(date[1])
    print(date2-date1)
    admin_name=request.json["admin"]

    admin = usercol.find_one({"username" : admin_name})
    admin_id=str(admin.get("_id"))
    group = groupscol.find_one({"name":groupname})
    group_id=str(group.get('_id'))
    trip_id=tripscol.insert({"scheduled":"false","preferred_dates":[],"scheduled_dates":[],"description":description,"admin_id":admin_id,"location":location,"group_id":group_id,  "tentative_date_range":date})
    trip_id=str(trip_id)
    #group=groupscol.find_one({"_id":ObjectId(group_id)})
    new_trips=group["trips"]
    new_trips.append(trip_id)
    groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"trips":new_trips}})
    return "",201

@app.route('/api/v1/trips/del_trip/<trip_name>', methods=['DELETE'])
def delete_trip(trip_name):
    trip=tripscol.find_one({"location":trip_name})
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
    tripscol.delete_one({"_id":ObjectId(trip_id)})
    return "",204

"""@app.route('/api/v1/groups/check_admin',methods=["POST"])
def check_admin():
    groupname=groupscol.find_one({"name":request.json["groupname"]})
    admin_username="""
@app.route('/api/v1/groups/get_trips/<groupname>',methods=["GET"])
def get_trips(groupname):
    group = groupscol.find_one({"name":groupname})
    group_id=str(group.get('_id'))
    trips=[]
    for i in group["trips"]:
        print(i)
        temp=tripscol.find_one({"_id":ObjectId(i)})
        print(temp)
        trips.append(temp["location"])
    return jsonify({"trips":trips}),200

@app.route('/api/v1/trips/<trip_name>', methods=['GET'])
def view_trip(trip_name):
    current_trip = tripscol.find_one({"name":trip_name})
    if(current_trip):
        session['trip_id']= str(current_trip['_id'])
        print(str(session['trip_id']))
        return "",200
    return "trip not created yet",404
    return "", 200
    




    

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
    return jsonify({"Places":output}),200 #a string ,not a list,map UI accordingly


@app.route('/show_gallery/<groupId>',methods=['GET'])
def dispaly(groupId):
    
    group = filescol.find_one({
        'group' : groupId
    })
    data = []

    if group :
        for i in group['files']:
            data.append(json.loads(json_util.dumps(i)))

        return jsonify(data), 200
    
    return "nothing to show",400


@app.route('/file_upload', methods=['POST'])
def fileUpload():

    file = request.files['file']
    group = request.form['group']

    if file:
        encoded_string = base64.b64encode(file.read())
        pres = filescol.find_one({'group' : group})
        if not pres:
            filescol.insert_one(
                {'group' : group,'files' : [encoded_string] }
            )
        else:
            filescol.update_one(
                {'group' : group},{'$push' : { 'files' : encoded_string}}
            )

        return 'done',200
    return 'fail', 400
    

##chat app

@app.route('/chat/<group>',methods=['GET'])
def getChats(group):
    chatBox = chatscol.find_one({'group' : group})
    data = []
    if chatBox:
        for chat in chatBox['chats']:
            data.append(chat)
        
        return jsonify(data), 200
    else:
        return 'empty', 400

@app.route('/chat',methods=['POST'])
def postChat():
    msg = request.json['msg']
    username = request.json['username']
    group = request.json['group']
    
    chatBox = chatscol.find_one({'group' : group})
    if not chatBox:
        chatscol.insert_one({'group' : group,
            'chats' : [ {'sender' : username,'msg' : msg} ]})
    else:
        chatscol.update_one(
            {'group' : group},
            {'$push' : {'chats' : {'sender' : username,'msg' : msg}}}
        )
    return 'sent', 200

  
  

@app.route('/api/v1/billSplit',methods=['POST'])
def initialize():
    group = request.json['group']
    member = request.json['member']

    billSplitCol.insert_one({
        'group' : group,
        'expenses' : [{'name' : member,'amount' : 0}]
    })
                            
    return "",200
    
@app.route('/api/v1/new_user',methods=["POST"])
def new_user_init():
    member = request.json['member']
    group = request.json['group']
    # return member, 200

    billSplitCol.update_one(
        {'group':group},
        {'$push': {'expenses' : { 'name' : member, 'amount' : 0 }} }
    )
    
    return "added",200
    
@app.route('/api/v1/split',methods=['POST'])
def split():

    group = request.json['group']    
    amount = float(request.json['amount'])
    paid_by = request.json['paid_by']

    users = billSplitCol.find_one({'group' : group})
    userList = []
    for i in users['expenses']:
        userList.append(i['name'])

    individual_cost = amount/len(userList)

    new_cost = []
    for i in users['expenses']:
        val = -individual_cost
        if i['name'] == paid_by:
            val = amount
        
        new_cost.append({'name':i['name'], 'amount' : i['amount'] + val})

    billSplitCol.update_one(
        {'group' : group},
        {'$set' : {'expenses' : new_cost}}
    )
    
    return "split done!",201

def distribute(users):
        ret_arr = []
        n = len(users)
        for i in range(n):
            ret_arr.append([0]*n)
        users1 = sorted(users.items())
        users2 = []
        for i in users1:
            users2.append(list(i))
        users1 = users2.copy()
        for i in range(n):
            if(users1[i][1]>=0):
                continue
            for j in range(n):
                if(i==j):
                    continue
                if(users1[j][1]>0):
                    if(abs(users1[i][1])>=users1[j][1]):
                        users1[i][1]+=users1[j][1]
                        ret_arr[i][j] = users1[j][1]
                        users1[j][1] = 0
                    else:
                        users1[j][1]+=users1[i][1]
                        ret_arr[i][j] = abs(users1[i][1])
                        users1[i][1] = 0
        return ret_arr

def minimize_settlement(settle,ll,ret):
        n = len(settle)
        amount = [0 for i in range(n)]
        for p in range(n):
            for i in range(n):
                amount[p]+=(settle[i][p] - settle[p][i])
        
        min_settle_rec(amount,ll,ret)

def min_settle_rec(amount,ll,ret):
        cred = amount.index(max(amount))
        debt = amount.index(min(amount))
        
        if(amount[cred]==0 and amount[debt]==0):
            return 0
        
        mi = min(-amount[debt],amount[cred])
        amount[cred]-=mi
        amount[debt]+=mi
        
        stmt = ll[debt]+" pays "+str(mi)+" to "+ll[cred]
        ret.append(stmt)

        min_settle_rec(amount,ll,ret)

@app.route('/api/v1/summary/<group>',methods=['GET'])  
def settle_payments(group):
    #users = request.json['users']
    userList = billSplitCol.find_one({'group' : group})
    if not userList:
        return "failed", 404

    userList = userList['expenses']
    users = {}
    
    for i in userList:
        users[i["name"]] = i["amount"]
    settlement = distribute(users)
    ll = list(users.keys())
    ll.sort()
    ret = []
    minimize_settlement(settlement,ll,ret)
    return jsonify(ret),200
        
@app.route('/api/v1/payment',methods=['POST'])
def payment():
    sender = request.json['sender']
    receiver = request.json['receiver']
    amount = request.json['amount']
    group = request.json['group']

    t1 = billSplitCol.find_one({"group" : group})
    
    if not t1:
        return 'failed',400
    amount = float(amount)
    record = []
    for x in t1['expenses']:
        val = 0
        if x['name'] == sender:
            val = -amount
        elif x['name'] == receiver:
            val = amount

        record.append({'name' : x['name'] , 'amount' : x['amount'] + val })

    billSplitCol.update_one({
        'group':group
    },{
      '$set' : {  'expenses' : record}
    })
    
    return "updated Balance",200
        

def dummy_recommender(a,b,c,d,e):
    return "output"

app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'


if __name__ == '__main__':
    app.run(debug=True)
    
