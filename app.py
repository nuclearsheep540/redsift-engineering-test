import json
import re
import time

from flask import Flask, request
from urllib import request as urlrequest
from urllib.error import HTTPError, URLError
from pymongo import MongoClient

from concurrent.futures import ThreadPoolExecutor, as_completed

# Bare-bones setup of flask app and mongo backend
# I've set this up as minimal as possible
# for the purpose of this exercise
app = Flask(__name__)
client = MongoClient("mongodb://localhost:27017/")
db = client["mydatabase"]

# Create a collection to store our requests in
all_requests = db["all_requests"]


def fetch_site_data(url):
    """
    Method requests endpoint URL, timing the time to complete
    request, and returns the page title and time taken to complete
    """

    # check protocol, ensure https
    if not re.match(url, '^https?://'):
        url = f'https://{url}'

    # start timer
    start = time.perf_counter()
    try:
        res = urlrequest.urlopen(url).read()
    except (HTTPError, URLError):
        res = ''
    # stop timer
    stop = time.perf_counter()

    # get title
    try:
        res_title = str(res).split('<title>')[1].split('</title>')[0]
    except:
        res_title = 'Error: No title found.'

    # calc duration in ms
    dur = int((stop - start) * 1000)

    return {"url": url, "title": res_title, "ms": dur}


# CRUD Endpoints
@app.route('/domains', methods=['POST'])
def post_domains():
    data = json.loads(request.data)

    # Use ThreadPoolExecutor for multi thread
    future_tasks = []
    complete_tasks = []
    with ThreadPoolExecutor(max_workers=8) as executor:
        for url in data:
            # define task and submit to pool
            future = executor.submit(fetch_site_data, url)
            future_tasks.append(future)

        for f in as_completed(future_tasks):
            complete_tasks.append(f.result())

    res = {"requests": [item for item in complete_tasks]}

    try:
        all_requests.insert_one(res)
        return {"response": res["requests"]}
    except:
        return {"msg": "error"}


@app.route('/domains', methods=['GET'])
def fetch_domains():
    # Mongodb collections are an object.
    # using list comprehension we can return
    # an iterable soft copy of the data in this collection
    data = [i for i in db.all_requests.find()]

    # In order to return our data, we need to serialize the ObjectId in
    # each row. We can template the response, and use comprehension to
    # build our new response
    res = {
        "response": [{"id": str(i["_id"]), "requests": i["requests"]} for i in data]
    }

    return res


@app.route('/stats', methods=['GET'])
def fetch_stats():
    # use mongo aggregration pipeline to retrieve average
    # ms to download each unique site

    # expand requests (collection) object
    # use id is each unique site
    pipeline = [
        {"$unwind": "$requests"},
        {
            "$group": {
                "_id": "$requests.url",
                "avg_ms": {
                    "$avg": "$requests.ms"
                }
            }
        }
    ]

    cursor = db.all_requests.aggregate(pipeline)

    res = {
        "response": [{"url": item["_id"], "average_ms": int(item["avg_ms"])} for item in cursor]
    }
    return res


@app.route('/clear', methods=['POST'])
def clear_data():
    """
    Method will try to clear all data in the all_requests collection.
    This is useful for testing
    """
    try:
        db.all_requests.remove()
        return {"msg": "complete"}
    except:
        return {"msg": "error"}


if __name__ == "__main__":
    app.run(debug=True)