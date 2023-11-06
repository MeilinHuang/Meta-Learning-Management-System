from sqlalchemy import Numeric, cast
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session
from .. import models, schemas
import datetime

# need to develop a backend call such that you can upload a pomodoro. to a user.
def addPomodoroSession(db:Session, user: schemas.User, session_data: schemas.PomodoroSession) -> bool:
    try:
        # Create a new Pomodoro session in the database
        new_pomodoro = models.PomodoroSession(
            username=session_data.username,
            email=session_data.email,
            focusTimeMinutes=session_data.focusTimeMinutes
        )

        db.add(new_pomodoro)
        db.commit()
        db.refresh(new_pomodoro)

        return True  # Return True if the session was successfully created
    except Exception as e:
        # Log the error or handle it as needed
        return False

# need to develop a backend call such that you can retrieve all your pomodoros to get a report. 
def getAllPomodoroSessions(db:Session, username: str) -> []:

    pomodoro_sessions = db.query(models.PomodoroSession).filter_by(username=username).all()
    extracted_values = []
    for session in pomodoro_sessions:
        extracted_values.append({
            "time": session.time,
            "focusTimeMinutes": session.focusTimeMinutes
        })
    
    return extracted_values