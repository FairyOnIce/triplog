import requests, json
import pandas as pd
from personal import flikr_api_key as api_key
from personal import user_id as uid
from backend import dir_data

user_id = uid.replace("@", "%40")


def get_requestURL(endpoint="getList"):

    url_upto_apikey = ("https://api.flickr.com/services/rest/?method=flickr.photosets." +
                       endpoint +
                       "&api_key=" + api_key +
                       "&user_id=" + user_id +
                       "&format=json&nojsoncallback=1")
    return (url_upto_apikey)


def get_photo_url(farmId, serverId, Id, secret):
    return (("https://farm" + str(farmId) +
             ".staticflickr.com/" + serverId +
             "/" + Id + '_' + secret + ".jpg"))


def get_picURL_of_album(photoset_id):

    url = get_requestURL(endpoint="getPhotos") + "&photoset_id=" + photoset_id
    print(url)
    strlist = requests.get(url).content

    json1_data = json.loads(strlist)

    urls = []
    for pic in json1_data["photoset"]["photo"]:  ## for each picture in an album
        urls.append(get_photo_url(pic["farm"], pic['server'], pic["id"], pic["secret"]))
    return (urls)


## ---------------

def initialize_gps_data_aftertrip():
    trekking = (pd.read_csv(dir_data + "trekking.csv"))
    points = []
    for lat, lon in zip(trekking["lat"].values, trekking["lon"].values):
        points.append({"lat":lat,"lng":lon})

    return(points)
