from sqlalchemy.orm import Session
from .. import models, schemas
import datetime

def addPomodoroSession(db:Session, session_data: schemas.PomodoroSession) -> bool:
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
        return False

def getAllPomodoroSessions(db:Session, username: str) -> []:
    
    pomodoro_sessions = db.query(models.PomodoroSession).filter_by(username=username).all()
    
    extracted_values = []
    for session in pomodoro_sessions:
        extracted_values.append({
            "time": session.time,
            "focusTimeMinutes": session.focusTimeMinutes
        })
        
    # file_path = "pomodoro_data.txt"
    # with open(file_path, "a") as file:
    #     file.write(f"username: {username} pomodoro_sessions: {pomodoro_sessions}, values:{extracted_values}\n")
    return extracted_values