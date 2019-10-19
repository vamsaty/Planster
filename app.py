# -*- coding: utf-8 -*-
"""
Created on Mon Oct 14 09:10:45 2019
@author: satys
"""    
import json
from flask import Flask, render_template, Markup, request, redirect, jsonify, abort
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
tripscol = pymongo.collection.Collection(db,'tripscol')


@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
def home():
    """Landing page."""
    #data={"userame":"test1","password":"pass","name":"T"}
    #usercol.insert(data)

    #recent_searches = list(col_results)
    #return "Hello"

@app.route('/api/v1/trips/create',methods=['POST'])
def create_trip():
    admin_id= request.form['user_id']
    location= request.form['Location']
    group_id= request.form['groupid']
    ndays= request.form['no_of_days']
    trip_id=tripscol.insert({"AdminId":admin_id,"Location":location,"groupID":group_id,"NoOfDays":ndays, "IndividualExpense":[]})
    trip_id=str(trip_id)
    group=groupscol.find_one({"_id":ObjectId(group_id)})
    if(group['AdminId']==admin_id):
        new_trips=group["Trips"]
        new_trips.append(trip_id)
        groupscol.update_one({"_id":ObjectId(group_id)},{"$set":{"Trips":new_trips}})
    return "",201


  




if __name__ == '__main__':
    app.run(debug=True)