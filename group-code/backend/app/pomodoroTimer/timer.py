from sqlalchemy.orm import Session
from .. import models, schemas
from datetime import datetime, timedelta
from collections import defaultdict


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
        
    return extracted_values

def getSessionsWithinDateRange(db: Session, start_date, end_date, username:str):
    start_week = datetime.strptime(start_date, "%d/%m/%Y")
    end_week=datetime.strptime(end_date, "%d/%m/%Y")
    print(start_date, end_date)
    sessions_within_range = (
        db.query(models.PomodoroSession)
        .filter(models.PomodoroSession.username == username)
        .filter(models.PomodoroSession.time.between(start_week, end_week))
        .all()
    )
    print(sessions_within_range)
    daily_accumulation = defaultdict(int, {day: 0 for day in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']})

    for session in sessions_within_range:
        day = session.time.date()
        daily_accumulation[day.strftime('%A')] += session.focusTimeMinutes

    print(dict(daily_accumulation))
    return dict(daily_accumulation)


def addDummyPomodoroSessions(db:Session, username: str, email: str):
    
    for day in range(1, 6):  # Monday to Friday
        # Generate a datetime object for the specific day at 12:00 PM
        session_datetime = datetime(2023, 11, 13 + day, 13, 0)

        # Create a PomodoroSession using the model
        new_pomodoro = models.PomodoroSession(
            username=username,
            email=email,
            focusTimeMinutes=30  # Replace with the actual focus time
        )

        # Add the generated datetime to the Pomodoro session
        new_pomodoro.time = session_datetime
        
        # Add the Pomodoro session to the database
        db.add(new_pomodoro)
        db.commit()
        db.refresh(new_pomodoro)

        print(f"Dummy data added for {session_datetime.strftime('%A')}")
    return