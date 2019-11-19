from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC, LinearSVC
import nltk
from scipy import spatial
import nltk
import pandas as pd
import numpy as np
 

def recom(query):
    data = pd.read_csv("restaurant.csv") 
    data = data.drop(["Unnamed: 0","Unnamed: 0.1"], axis=1)
    data = data.rename(columns={"listed_in(type)": "food_type",})
    data.head()


    for i in range(len(data)):
        if (type(data.iloc[i].dish_liked) ==float):
            data.at[i, 'dish_liked'] = " "
        if (type(data.iloc[i].dish_liked) ==float):
            data.at[i, 'cuisines'] = " "
        if (type(data.iloc[i].food_type) ==float):
            data.at[i, 'food_type'] = " "
        if (type(data.iloc[i].rest_type) ==float):
            data.at[i, 'rest_type'] = " "
        
    tags = {}
    for rows in data.itertuples():
        tags[rows.name] = [rows.location,rows.rest_type,rows.dish_liked, rows.cuisines, rows.food_type,rows.cost]
        #tags[rows.name] = [rows.location,rows.rest_type,rows.dish_liked, rows.cuisines]
    
    def clean(s):
        punctuations = ","
        no_punct = ""
        for char in s:
            if char not in punctuations:
                char = char.lower()
                no_punct = no_punct + char
        return(no_punct)


    restaurants = []
    for i in list(tags.keys()):
        tag = " ".join(tags[i])
        tag = clean(tag)
        tokens = nltk.word_tokenize(tag)
        tags[i] = tag
        restaurants.append(tag)

    #print(restaurants)    


    outputs = list(tags.keys())


    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(restaurants)


    y = []
    for i in range(1,len(list(tags.keys()))+1):
        y.append(i)

    clf = LinearSVC(class_weight="balanced")
    clf.fit(X,y)
    
    query = query
    q = vectorizer.transform([query.lower()])



    out = list(clf.predict(q))
    return (outputs[out[0]])