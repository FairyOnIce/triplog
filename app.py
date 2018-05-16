from flask import Flask, render_template
# https://github.com/johnschimmel/Instagram---Python-Flask-example/blob/master/app.py
from backend import *
from personal import photoset_ids
from backend_aftertrip import get_picURL_of_album
from random import randint

## Heroku reference
# https://github.com/datademofun/heroku-basic-flask


app = Flask(__name__)



mytrip, mytrip_items, maxPIDm1 = initiaize_gps_data_pretrip()





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

@app.route("/ebc/ebc_aftertrip")
def index_ebc_after():

    photoset_id = photoset_ids[randint(0, len(photoset_ids))]
    randompics = get_picURL_of_album(photoset_id)
    print("aaa")
    return render_template("ebc_aftertrip.html",
                           randompics=randompics)


@app.route("/ebc/ebc_beforetrip_challenges")
def tab_challenge():
    return render_template("ebc_beforetrip_challenges.html")


@app.route("/ebc/ebc_beforetrip_gear")
def tab_gear():
    return render_template("ebc_beforetrip_gear.html")

@app.route("/ebc/ebc_beforetrip_reminder")
def tab_reminder():
    return render_template("ebc_beforetrip_reminder.html")

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