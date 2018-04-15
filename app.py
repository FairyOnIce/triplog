from flask import Flask, render_template
import pandas as pd
from backend import *
## Heroku reference
# https://github.com/datademofun/heroku-basic-flask


app = Flask(__name__)

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

@app.route("/") ## If I could create another trip's back log, I should create a summary page here
def index():
    return render_template("ebc.html",
                           maxPIDm1=maxPIDm1,
                           mytrip=mytrip,
                           mytrip_items=mytrip_items)
@app.route("/ebc")
def index_ebc():
    return render_template("ebc.html",
                           maxPIDm1=maxPIDm1,
                           mytrip=mytrip,
                           mytrip_items=mytrip_items)


@app.route("/ebc/ebc_beforetrip")
def tab_page():
    return render_template("ebc_beforetrip.html")

@app.route("/ebc/ebc_beforetrip_challenges")
def tab_challenge():
    return render_template("ebc_beforetrip_challenges.html")


@app.route("/ebc/ebc_beforetrip_gear")
def tab_gear():
    return render_template("ebc_beforetrip_gear.html")

@app.route("/ebc/out/<string:pid>")
def index_with_specific_marker(pid):
    ## pid must be greater than 0
    ## pid=1,2,...
    pid = int(pid)
    mt = {}
    ## mytrip.keys() contains PID starting from 0, 1, 2,.. len(mytrip.keys())
    ## 0^th PID is ignored
    print(pid)
    for key in mytrip.keys(): ## key goes over distance, placename,,
        mt[key] =  [mytrip[key][pid-1], ## pid > 0
                    mytrip[key][pid]]

    mt["PID"] = 0
    mti = {"0":mytrip_items[pid]}
    return render_template("ebc.html",
                           maxPIDm1=maxPIDm1,
                           mytrip=mt,
                           mytrip_items=mti)



if __name__ == "__main__":
    app.run(host='0.0.0.0')