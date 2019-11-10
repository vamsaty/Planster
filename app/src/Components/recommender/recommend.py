import nltk
from sklearn.svm import SVC
clf = SVC(kernel='linear')

tags = {
    'Harrys': ['bar','pub','restaurant','large-group','koromangala','small-group','party','expensive'],
    'McD': ['restaurant','indiranagar','small-group','party','cheap'], 
    'Vidyarthi Bhavan' : ['restaurant','banshankari','small-group','family','cheap']}

outputs = list(d.keys())

BoW = []
for i in outputs:
    for j in tags[i]:
        BoW.append(j)
BoW = list(set(BoW))

for i in x:
    if i not in BoW:
        x.remove(i)


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

y = [1,2,3]
clf.fit(vectors,y)    
    
query = 'party pub near koromangala'
x = nltk.word_tokenize(query.lower())    
query_vector = generateVector(BoW,x)


out = list(clf.predict([query_vector]))
print(outputs[out[0]])
