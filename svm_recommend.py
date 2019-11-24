import nltk
from sklearn.svm import SVC
clf = SVC(kernel='linear')
import nltk
import pandas as pd 

def recom(query):

    data = pd.read_csv("../../../../../deploy/Recommender/restaurant.csv") 
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

        
    def clean(s):
        punctuations = ","
        no_punct = ""
        for char in s:
            if char not in punctuations:
                no_punct = no_punct + char
        return(no_punct)

    for i in list(tags.keys()):
        tag = " ".join(tags[i])
        tag = clean(tag)
        tokens = nltk.word_tokenize(tag)
        tags[i] = tokens
            
        
    outputs = list(tags.keys())

    BoW = []
    for i in outputs:
        for j in tags[i]:
            BoW.append(j)
    BoW = list(set(BoW))



    def generateVector(x,y):
        vec = []
        for i in x:
            if i in y:
                vec.append(1)
            else:
                vec.append(0)
        return(vec)


    vectors = []
    for i in outputs:
        vectors.append(generateVector(BoW,tags[i]))

    y = []
    for i in range(1,len(list(tags.keys()))+1):
        y.append(i)


    clf.fit(vectors,y)    
    
    x = nltk.word_tokenize(query.lower()) 

    for i in x:
        if i not in BoW:
            x.remove(i)


    query_vector = generateVector(BoW,x)


    out = list(clf.predict([query_vector]))
    return (outputs[out[0]])
    print(outputs[out[0]])

