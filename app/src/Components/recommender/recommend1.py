import nltk
from scipy import spatial

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
    #print(tags[i])
    vectors.append(generateVector(BoW,tags[i]))

y = [1,2,3]
clf.fit(vectors,y)    
    
query = 'party cheap restaurant near banshankari'
x = nltk.word_tokenize(query.lower())    
query_vector = generateVector(BoW,x)



maxi = 0
pos = 0
for i in range(len(vectors)):
    result = 1 - spatial.distance.cosine(vectors[i],query_vector)
    if(result>maxi):
        maxi = result
        pos = i
print(outputs[pos])
