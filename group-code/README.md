# MetaLMS

## Backend

### Setup

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

### Start backend server

Perform these steps every time you want to use the backend server.

1. Navigate to the root folder.
2. Activate your existing virtual environment.  
   `source backend/venv/bin/activate`
3. Start the backend server. (make sure you're in th `group-code/` directory)
   `uvicorn backend.app.main:app --reload`

### Update dependencies

Every time you install a new python module in your virtual environment, update the `requirements.txt` file by running this command.  
`python3 -m pip freeze > requirements.txt`

## Frontend

### Setup

1. From the root folder, navigate to the frontend folder.  
   `cd frontend`
2. Install node modules.  
   `npm install`

### Start frontend server

To start the frontend server, navigate to the frontend folder and run `npm start`.

### Tailwind CSS

https://tailwindcss.com/docs/installation

Tailwind CSS works by giving users a set of classes they can use to add styles. For example,  
`<p className="text-black">This text is black</p>`
is equivalent to making this CSS class in your stylesheet:  
`.text-black {
    color: rgb(0 0 0); 
}`

These predefined classes make it easier to write CSS and make styles more consistent. After adding a new Tailwind class to your components, run this command to add the corresponding CSS class to your stylesheet.  
`npx tailwindcss -i ./src/index.css -o ./public/output.css`

For convenience, run the frontend server from step in one terminal, then open another terminal and run this command:  
`npx tailwindcss -i ./src/index.css -o ./public/output.css --watch`

This will automatically rebuild the CSS as you edit your classes so you don't need to run the command every time.

The site has a list of available classes with their corresponding CSS. The quick search is very useful in finding relevant classes.

### Tailwind UI

Tailwind UI components are just normal React components that have Tailwind CSS classes added to them. To use Tailwind UI, sign in to https://tailwindui.com/ from VLAB, go to Components from the top nav bar, find the component you need, copy and paste the code they provide and edit the code to customise.

To find the Tailwind CSS documentation in this website: https://tailwindcss.com/docs/installation
