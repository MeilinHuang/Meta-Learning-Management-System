# meta-lms

Run backend before frontend.

## meta-lms-frontend
Make sure the two constants in src/api/global.js is updated
(i.e. "token" value is what you get from registering an account via the backend API,
"URL" is the url for the API running)
> yarn install && yarn start

## backend
requirement.txt was generated via `pip3 freeze > requirements.txt`... I only
learnt about virtual env and setting it up after I had began... so there is a lot more
than what is used in requirements.txt.

First time (make sure database.sqlite3 does not exist in db/ before doing below):
> sh setup.sh # will create a db database.sqlite3
> python3 run.py
Then, go to the API interface and "register" an account with some dummy data to
grab a token (will be needed in meta-lms-frontend)
That was a placeholder intended for accounts to be implemented...

After the first time:
> python3 run.py

# Notes
If there are any questions or issues, feel free to ping Tammy via FB or discord.

Some code comes from or are based on code from courses I've gone through 
and online examples.

If you are trying to run it, sorry it may get a bit fiddly!

The code was written with the intention to be read by only me and for self-learning purposes;
there is a lot of redundant/commented out/repeated code/notes/links referring 
to trial and errors/learnings from me,
or links which I used code from or found useful... Please ignore. 

(Ignore some comments I have throughout code base, they were random notes to self
and mostly no longer relevant)
