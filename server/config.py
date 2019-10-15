# -*- coding: utf-8 -*-
"""
Created on Mon Oct 14 09:21:15 2019

@author: satys
"""

import pymongo
from bson.json_util import dumps
import json

mongo = pymongo.MongoClient('mongodb+srv://satyam:mongodb1234@planster-c1-tjz95.mongodb.net/test?retryWrites=true&w=majority', maxPoolSize=50, connect=False)

db = pymongo.database.Database(mongo, 'db1')
col = pymongo.collection.Collection(db, 'usercol')


db.usercol.insert_one({
        "title":123
        });

#col_results = json.loads(dumps(col.find().limit(5).sort("time", -1)))