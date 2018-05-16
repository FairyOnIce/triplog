from json import loads
from urllib2 import Request, urlopen
import sys
import pandas as pd
sys.path.append("app/")
from personal import MY_API_KEY


GoogleMap_API="https://maps.googleapis.com/maps/api/"

def initiaize_gps_data_pretrip():
    dir_data = "static/data/"
    ## read in all the csv
    mytrip = pd.read_csv(dir_data + "/mytrip.csv").fillna("--").to_dict()
    mytrip_items = {}
    for pid in mytrip["PID"].keys():
        try:
            fnm = dir_data + "/mytrip_item/mytrip_{:05.0f}.csv".format(pid)
            mytrip_items[pid] = pd.read_csv(fnm).fillna("--").to_dict()
        except Exception as e:
            print(e)
            pass

    maxPIDm1 = len(mytrip["PID"]) - 1

    ## mytrip.keys()
    ## Out[87]: ['placename', 'schedule', 'altitude', 'PID', 'lat', 'lng', 'Day']
    ##
    ## mytrip_items.keys()
    ## Out[88]: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    ## mytrip_items[0].keys()
    ## Out[89]: ['distance', 'placename', 'altitude', 'lat', 'duration', 'lng']

    return(mytrip, mytrip_items, maxPIDm1)
def get_path_and_altitutde(origin,destination):
    '''

    :param
    origin: Point object (lat,lng)
    destination: Point object (lat,lng)
    :return:
    locations: list containing (lat,lng) to connect the origin and destination
    '''
    km, dur = 0, 0
    info = [{"lat":origin.latlng[0],
             "lng":origin.latlng[1],
             "placename":origin.placename,
             "altitude":origin.altitude,
             "distance":km,
              "duration":dur}]
    req = request_path(origin.latlng,destination.latlng)
    if origin.placename != destination.placename:
        try:
            places = request_load(req)
            for r in places["routes"][0]["legs"][0]["steps"]:
                km += r["distance"]["value"]
                dur += r["duration"]["value"]/60.0
                startdict = r["start_location"]
                startdict["placename"] = ""
                startdict["distance"] = km
                startdict["duration"] = dur
                ## request altitude
                req = request_alt((startdict["lat"],
                                   startdict["lng"]))
                places = request_load(req)
                startdict["altitude"] = places['results'][0]['elevation'];
                info.append(startdict)
        except Exception as e:
            print(e)
            km, dur = 1, 1
            pass
    else:
        km, dur = 1, 1
    info.append({"lat": destination.latlng[0],
                 "lng": destination.latlng[1],
                 "placename": destination.placename,
                  "altitude":destination.altitude,
                  "distance":km,
                  "duration":dur})
    info = pd.DataFrame(info)
    return(info)

def request_path(origin,dest):
    requeststr = GoogleMap_API + 'directions/json?origin={},{}&destination={},{}&key={}&mode=walking'.format(
                  origin[0],origin[1],
                  dest[0],dest[1],MY_API_KEY)
    return(requeststr)

def request_alt(loc):
    requeststr = GoogleMap_API + 'elevation/json?locations={},{}&key={}'.format(
    loc[0], loc[1], MY_API_KEY)
    return(requeststr)


def request_load(requeststr):
    request  = Request(requeststr)
    response = urlopen(request).read()
    places   = loads(response)
    return(places)

class Point(object):
    def __init__(self,place,detail,ID):
        self.placename = place
        self.latlng    = self.find_latlng_textsearch([place,"Nepal"])
        self.altitude = self.find_altitude(self.latlng)
        self.schedule  = detail
        self.day = ID
        self.path2next = None

    def add_path(self,path):
        self.path2next = path


    def find_latlng_geocoding(self,keywords):
        '''
        using google map API find the lat long given an address created with keywwords
        e.g., keywords = ["Nepal","Lukila"]
        :return:
        '''
        address = keywords[0].replace(" ","+")
        for keyword in keywords[1:]:
            address += "+"+keyword.replace(" ","+")
        requeststr = GoogleMap_API + "geocode/json?address={}&key={}".format(
            address,MY_API_KEY)
        try:
            places = request_load(requeststr)
            loc = places["results"][0]["geometry"]["location"]
        except:
            loc ={"lat":None,"lng":None}
        return (loc["lat"],loc["lng"])

    def find_latlng_textsearch(self,keywords):
        '''

        :param keywords:
        :return:
        '''
        address = keywords[0].replace(" ","+")
        for keyword in keywords[1:]:
            address += "+" + keyword.replace(" ","+")
        requeststr = GoogleMap_API + "place/textsearch/json?query={}&key={}".format(
            address,MY_API_KEY)
        try:
            places = request_load(requeststr)
            loc = places["results"][0]["geometry"]["location"]
        except Exception as e:
            print(e)
            print(address)
            print(requeststr)
            loc = {"lat": None, "lng": None}
        return (loc["lat"], loc["lng"])

    def find_altitude(self,loc):
        requeststr = GoogleMap_API + 'elevation/json?locations={},{}&key={}'.format(
                      loc[0], loc[1], MY_API_KEY)
        try:
            places = request_load(requeststr)
            elevation  = places['results'][0]['elevation'];
        except Exception as e:
            elevation = -1;
        return elevation

class Trip(object):
    def __init__(self):
        self.points = []
    def add_point(self,point):
        self.points.append(point)

if __name__ == '__main__':

    dir_data = 'static/data/'
    file = pd.read_csv(dir_data + "/mytrip.csv")
    ## mytrip.csv :
    ## placename column contains integer starting from 0,1,...
    ## placename of i^th Day is the destination of the i^th Day

    ## define mytrip object
    mytrip = Trip()
    for irow in range(file.shape[0]):
        row = file.iloc[irow,:]
        text = row["schedule"]
        mypoint = Point(row["placename"],row["schedule"],row["Day"])
        mytrip.add_point(mypoint)

    for point in mytrip.points:
        print(point.placename, point.latlng)




    for start, end in zip(mytrip.points[:-1],mytrip.points[1:]):
        info = get_path_and_altitutde(start,end)
        end.add_path(info)


    for i in range(len(mytrip.points)):
        print(mytrip.points[i].path2next)


    ## create a csv containing
    ## ID placename, description, latitude, lontitude, altitude
    text = []
    ## enumerate starts from 1 because 0^th day only contain starting date
    ## mytrip_00003.txt contains the 3rd date path
    ## mytrip.points[3] contains the destination of the 3rd date
    ## PID starts from 1
    for pid,point in enumerate(mytrip.points):
        pid_string = "{:05.0f}".format(pid)
        text.append([pid_string,
                     point.day,
                     point.placename,
                     point.schedule,
                     point.latlng[0],
                     point.latlng[1],
                     point.altitude])
        ## point.path2next is None for the mytrip.points[0]
        if point.path2next is not None:
            pd.DataFrame(point.path2next).to_csv(dir_data + "/mytrip_item/mytrip_"+pid_string+".csv",
                                             index=False)

    dftrip = pd.DataFrame(text,
                          columns=["PID", "Day","placename","schedule","lat","lng","altitude"])
    dftrip["PID"] = dftrip["PID"].astype('str')
    dftrip.to_csv(dir_data + "/mytrip.csv",index=False)



