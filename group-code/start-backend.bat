@REM Run the following in command prompt, not powershell
cd backend
python3 -m venv venv
CALL venv\Scripts\activate.bat
python3 -m pip install -r requirements.txt
cd ..
python3 -m uvicorn backend.app.main:app --reload
