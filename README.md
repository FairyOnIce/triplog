
This file contains the script to produce my trip log webpage:
https://yumi-trip-backlog.herokuapp.com/ebc/ebc_aftertrip/7


## Open pycharm project

## --------------------------- ##
## Test locally
## --------------------------- ##
python app.py

## --------------------------- ##
## Upload the change to Heroku
## --------------------------- ##
## Step 1: add change to git
git add .
## Step 2: commit with comments
git commit . -m "ABC changes"
## Step 3: push the commit
git push heroku master
## Step 4: go to the webpage and to make sure the change
## Step 5: force refresh
command - shift - R


## --------------------------- ##
## Real time logging
## --------------------------- ##

heroku logs --tail
