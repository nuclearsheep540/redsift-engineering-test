# Redsift Python Engineering Test

## Installation
Setup a python 3.7.2 virtual environment<br>
Within your env, `pip install -r` the requirements file<br>
Run `python app.py` and you're done!

## Using the API
This api takes in a single array of URLs within the body of the request. You do not have to include the `http` protocol prefix for each URL if you wish.

Make all requests to 127.0.0.1:5000

## Endpoints

Post your array of websites to:
`localhost:5000/domains` `[POST]`

To see a list of all requests made:
`localhost:5000/domains` `[GET]`

To check stats (aggregate average download speed):
`localhost:5000/stats` `[GET]`

To clear the data collection in mongo:
`localhost:5000/clear` `[POST]`


# Conclusion
### Future improvements
  - Implement Access Tokens
  - Rate limiting each access token so not to overload the API
  - To manage multiple simultaneous requests, could use a processpool for each request to utilise the threadpool, so other users wont be waiting for current tasks to complete

### Incomplete tasks
Need to add the count of how many times the API has been invoked. Could use the mongodb aggregate pipeline to collect this data by counting number of requests.

Average response time is currently against each URL endpoint the API has hit and not the call time from the API _or_ move my timer to wrap the ThreadPoolExecutor instead then append this time value to the data we post to mongoDB.

### Bugs
If a website's title has an id in it, my regex doesn't capture it and so no title is returned. I currently handle this by returning a string of `'Error: No title found.'`.

### Challenges
- I was new to mongo, so had a lot of reading up to do especially around the aggregate pipeline.
- Also I am new to flask, so had to brush up on how to setup the project
- New to parallelism/MT processing - this is the first project I've utilised multi-threading with which was really exciting. Learning how multithreading collects tasks and uses futures to determine completed tasks was interesting and new for me.
- Getting the product to an MVP state within the time limit was a challenge due to the amount of documentation I had to learn in order to complete the task, however I'm happy that the product works succesfully and I've learnt a lot in the process.