# MetaLMS
For developer documentation, please see the [Frontend Docs](./documentation/FRONTEND-DOCS.md) and [Backend Docs](./documentation/BACKEND-DOCS.md).

## Running with Docker
### Frontend and Backend
Make sure you have Docker installed on your machine. Then, run the following commands from the root directory of the project to start the `Dev` environment, where hot-reloading is enabled:

```
docker-compose up
```

Front-end is accessible via `localhost:3000` and backend via `localhost:8000`.

NOTE: The first run will always take longer as Docker downloads and builds the container images.

If you make changes to your application, simply turn off the containers with `Ctrl+C` and run the command again.

If you make changes to the Dockerfile, you will need to rebuild the images with the following command:

```
docker-compose up --build
```

If you want to run the `Prod` environment (frontend uses Nginx with static file compilation), run the following command:

```
docker-compose -f docker-compose.prod.yml up
```

## Running Manually
These steps are if you want to install and run frontend and backend manually.

### Backend

#### Setup

Perform these steps the first time you clone the repository to set up a virtual environment and install dependencies.

1. From the root folder, navigate to the backend folder.  
   `cd backend`
2. Create a virtual environment.  
   `python3 -m venv venv`
3. Activate the virtual environment.  
   - Linux: `source venv/bin/activate`
   - Windows: `venv/Scripts/activate.bat`
4. Install dependencies from requirements.txt.
   `python3 -m pip install -r requirements.txt`

#### Start backend server

Perform these steps every time you want to use the backend server.

1. Navigate to the root folder.
2. Activate your existing virtual environment.  
   `source backend/venv/bin/activate`
3. Start the backend server. (make sure you're in th `group-code/` directory):
   - Linux: `uvicorn backend.app.main:app --reload`
   - Windows: `python3 -m uvicorn backend.app.main:app --reload`

#### Update dependencies

Every time you install a new python module in your virtual environment, update the `requirements.txt` file by running this command.  
`python3 -m pip freeze > requirements.txt`

### Frontend

#### Setup

1. From the root folder, navigate to the frontend folder.  
   `cd frontend`
2. Install node modules.  
   `npm install`

#### Start frontend server

To start the frontend server, navigate to the frontend folder and run `npm start`.