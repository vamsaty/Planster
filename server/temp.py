# -*- coding: utf-8 -*-
"""
Spyder Editor

"""


import pymongo
from bson.json_util import dumps
import json

mongo = pymongo.MongoClient('mongodb+srv://satyam:mongodb1234@planster-c1-tjz95.mongodb.net/test?retryWrites=true&w=majority', maxPoolSize=50, connect=False)

db = pymongo.database.Database(mongo, 'db1')
col = pymongo.collection.Collection(db, 'usercol')

col_results = json.loads(dumps(col.find().limit(5).sort("time", -1)))


#app = Flask(__name__)

#app.run()