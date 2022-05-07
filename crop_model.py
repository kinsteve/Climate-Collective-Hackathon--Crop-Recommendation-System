import sys
import pickle
import pandas as pd
import json
from sklearn.neighbors import KNeighborsClassifier

temp=sys.argv[1]
temp=float(temp)
humidity = sys.argv[2]
humidity=float(humidity)
rain = sys.argv[3]
rain=float(rain)

# print(type(temp),type(rain),type(humidity))

def func(temp,humidity,rain):

    temp = (temp-25.616244)/5.063749
    humidity = (humidity-71.481779)/71.481779
    rain = (rain - 103.463655)/54.958389


    with open('CROP.pkl' , 'rb') as f:
        lr = pickle.load(f)

    crop = pd.read_csv('Crop_recommendation(1).csv')

    distances, indices = lr.kneighbors([[temp,humidity,rain]],  n_neighbors=5)

    ls=[]
    for idx in indices:
        ls.append(list(crop.loc[idx]['label']))
        # print(crop.loc[idx]['label'])

    ls2=[]
    for i in ls[0]:
        ls2.append(i)

    res = list(set(ls2))

    return res

cropList=func(temp,humidity,rain)
crop=''
for i in cropList:
    crop=crop+i+" "
fi=open("predCrop.txt","w")
fi.write(crop)
fi.close()
print(cropList)



