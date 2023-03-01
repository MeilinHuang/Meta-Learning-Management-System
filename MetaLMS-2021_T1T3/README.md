# MetaLMS

Git repository for the Meta LMS Thesis project.

## To run backend:
Run npm install in `backend/` folder - npm version is 6.14.11

Next you need to set up the database, which uses PostgreSQL. `metalms.pgsql` contains a backup of the database. On Windows, you can set up Windows Subsystem for Linux and then follow this guide: https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart
You then need to restore the database using pg_dump and the metalms.pgsql file.

Setting up the database may be a little difficult, there should be a user with username "metalms" and password "metalms".

You can change which database the backend connects to in `backend/db/database.js`. Depending on where you set up the backend, if you set up the database on the same computer as where you are running the backend, the host should be "localhost".

## To run frontend:
Install yarn by typing `npm install -g yarn`, and then type `yarn install` in `frontend/` folder.

You can then run `yarn start` in the same folder, and a website called `localhost:3000` should open in your browser. Change the 

If you can go to localhost:8000, the backend is running correctly. Change the backend_url in `frontend/Constants.js` so its pointing to where the backend is running. By default it should be set to `localhost:8000`.

## To compile thesis documents:

### Windows
Download Windows Subsystem for Linux at https://docs.microsoft.com/en-us/windows/wsl/install-win10 and run:
```
sudo apt install latexmk
cd Thesis/ThesisA
```
Then run `latexmk -pdf thesisa.tex` and open thesisa.pdf

### Mac
Download MacTex at http://www.tug.org/mactex/ and run:
```
cd Thesis/ThesisA
pdflatex thesisa.tex
```
