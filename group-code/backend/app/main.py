from fastapi import Depends, FastAPI, HTTPException, Request, status, Query, Form, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.background import BackgroundTasks
from typing import List, Union, Annotated
from . import helper, models, schemas
from .database import SessionLocal, engine
from .auth import JWTBearer
from pathlib import Path
from io import BytesIO
from .chatgpt.chatgpt import send_message as chatgpt_send_message
from datetime import datetime
import os
import logging
import re
EMAILREG = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
USERREG = r'\b^[a-zA-Z0-9]+$\b'
models.Base.metadata.create_all(bind=engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()
logging.basicConfig(level=logging.INFO)

if (not os.path.exists("static")):
    os.mkdir("static")

app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [
    "http://staging.metalms.io",
    "https://staging.metalms.io",
    "http://metalms.io",
    "https://metalms.io",
    "http://localhost",
    "http://localhost:3000",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user(req: Request):
    token = req.headers["Authorization"]
    token = token.split('Bearer ')[1]
    # Here your code for verifying the token or whatever you use
    db = next(get_db())
    result, user = helper.verify_user(db, token)
    if result is not True or user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.post("/register")
async def register(details: schemas.UserCreate, db: Session = Depends(get_db)):
    # print(details)
    if (helper.usernameNotexists(db, details.username) == False):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User name already exists.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif (helper.emailNotexists(db, details.email) == False):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email already exists.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not re.fullmatch(EMAILREG, details.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not valid.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not re.fullmatch(USERREG, details.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username can only contain alphanumericals.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif len(details.full_name) >= 40 or len(details.username) >= 40 or len(details.email) >= 40:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inputs must be shorter than 40 characters.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = helper.create_user(
        db, details.username, details.password, details.email, details.full_name)
    user = helper.get_user_by_username(db, details.username)
    if (user is not None):
        username = user.username
        email = user.email
        userid = user.id
        fullname = user.full_name
        introduction = user.introduction
        return {"access_token": token, "token_type": "Bearer",
                "user_name": username, "email": email, "user_id": userid, "full_name": fullname, "introduction": introduction}
    # return {"access_token": token, "token_type": "Bearer"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Register failed",
        headers={"WWW-Authenticate": "Bearer"},
    )

# @app.post("/verifyEmail")
# async def verifyEmail(details: , db: Session = Depends(get_db)) {

# }

@app.post("/logout")
async def logout(details:schemas.OnlyToken, db: Session = Depends(get_db)):
    print("loging out")
    user = helper.extract_user(db, details.access_token.encode())
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    helper.invalidate_auth_token(db, user)
    return {"state": "logout_successed"}


@app.post("/editProfile")
async def editProfile(details: schemas.UserEdit, db: Session = Depends(get_db)):
    user = helper.extract_user(db, details.token)
    if user != None and user.username == details.username:
        return helper.edit_profile(db, user, details)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorised",
        headers={"WWW-Authenticate": "Bearer"},
    )



@app.post("/changePassword")
async def editPassword(details: schemas.UserPassword, db: Session = Depends(get_db)):
    print(details)
    user = helper.get_user_by_username(db, details.username)
    if (user is not None and helper.verify_password(details.password, user.password)):
        return helper.edit_password(db, user, details.newpassword)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="old possword incorrect",
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.get("/loadUsers/{search}")
async def loadUsers(request: Request, search: str, db: Session = Depends(get_db)):
    token = request.headers.get('Authorization')
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    isSuper = False
    if user.superuser == 1:
        isSuper = True
    if search != "@":
        return helper.get_users_search(db,search, isSuper)
    return helper.get_all_user_list(db, isSuper)


@app.get("/is_superuser")
async def is_superuser(token: str = Depends(JWTBearer(db_generator=get_db())), db: Session = Depends(get_db)):
    user = helper.extract_user(db, token)
    helper.updateLog(db, user, "")
    return {'is_superuser': user.superuser}


@app.get("/user/{id}")
async def getOneUser(request: Request, id: int, db: Session = Depends(get_db)):
    token = request.headers.get('Authorization')
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
 
    return {"user": helper.get_user_by_id(db, id, user.superuser == 1)}



@app.get("/authed")
async def test_auth(token: str = Depends(JWTBearer(db_generator=get_db())), db: Session = Depends(get_db)):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"username": user.username}


# token: str = Depends(JWTBearer(db_generator=get_db()))
@app.get("/admin/listsuperusers")
async def list_super_users(db: Session = Depends(get_db)):
    # user = helper.extract_user(db, token)
    # print(user)
    # if user.superuser is False:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Unauthorised",,
    #         headers={"WWW-Authenticate": "Bearer"},
    #     )
    res = helper.get_superuser_list(db)
    print(res)
    return res


# token: str = Depends(JWTBearer(db_generator=get_db()))
@app.get("/admin/listNonSuperusers")
async def list_non_super_users(db: Session = Depends(get_db)):
    # user = helper.extract_user(db, token)
    # print(user)
    # if user.superuser is False:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Unauthorised",,
    #         headers={"WWW-Authenticate": "Bearer"},
    #     )
    res = helper.get_non_superuser_list(db)
    return res


@app.post("/admin/promote")
async def promote_user(details: schemas.UserIDList, db: Session = Depends(get_db)):
    print(details)
    user = helper.extract_user(db, details.token)
    print(user)
    if user.superuser is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    print(details)
    print("here2")
    result = {"changed": 0, "ids": [], "new": []}
    for user_id in details.ids:
        if helper.promote_user(db, helper.get_user_by_id(db, user_id), user):
            result["changed"] += 1
            result['ids'].append(user_id)
    result["new"] = helper.get_superuser_list(db)
    return result


@app.post("/admin/demote")
async def demote_user(details: schemas.UserIDList, db: Session = Depends(get_db)):
    print(details)
    user = helper.extract_user(db, details.token)
    if user.superuser is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    result = {"changed": 0, "ids": [], "new": []}
    print("here2")
    for user_id in details.ids:
        if helper.demote_user(db, helper.get_user_by_id(db, user_id), user):
            result["changed"] += 1
            result['ids'].append(user_id)
    result["new"] = helper.get_superuser_list(db)
    return result


@app.get("/topic/{topic_id}/check_permission")
async def get_topic_permission(topic_id: int, flags: List[str] = Query(), db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    topic = db.query(models.Topic).filter_by(id=topic_id).one()
    user = helper.extract_user(db, token)
    perms = {}
    for flag in flags:
        if flag in vars(models.Role):
            perms.update(
                {flag: helper.check_permission(db, user, topic, flag)})
    return perms


@app.get("/topic/{topic_id}/roles")
async def get_topic_roles(topic_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    topic = db.query(models.Topic).filter_by(id=topic_id).one()
    if helper.check_permission(db, helper.extract_user(db, token), topic, "can_view_topic_roles"):
        return helper.get_topic_roles(db, topic)

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorised",
        headers={"WWW-Authenticate": "Bearer"},
    )

@app.get("/dummy")
async def dummy(db: Session = Depends(get_db)):
    topic = db.query(models.Topic).filter_by(topic_name="Linked Lists").first()
    if topic:
        enrollment = db.query(models.TopicEnrollment).filter_by(user_id=8, topic_id=topic.id).one()
        enrollment.complete = True
        db.commit()
    

@app.get("/users/{user_id}/{topic_id}/roles")
async def get_user_roles(user_id: int, topic_id: int = Query(None), db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    authenticator = helper.extract_user(db, token)
    topic = db.query(models.Topic).filter_by(id=topic_id).one()
    if helper.check_permission(db, authenticator, topic, "can_view_topic_roles"):
        return helper.get_user_roles(db, helper.get_user_by_id(db, user_id, True), topic)
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorised",
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.patch("/users/{user_id}/roles/add")
async def add_user_role(user_id: int, details: schemas.RoleGiveOrRemove, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    authenticator = helper.extract_user(db, token)
    topic = db.query(models.Topic).filter_by(id=details.topic_id).one()
    if helper.check_permission(db, authenticator, topic, "can_view_topic_roles"):
        return helper.give_user_role(db, helper.get_user_by_id(db, user_id), topic, db.query(models.Role).filter_by(id=details.role_id).one())
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorised",
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.patch("/users/{user_id}/roles/remove")
async def remove_user_role(user_id: int, details: schemas.RoleGiveOrRemove, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    authenticator = helper.extract_user(db, token)
    topic = db.query(models.Topic).filter_by(id=details.topic_id).one()
    if helper.check_permission(db, authenticator, topic, "can_view_topic_roles"):
        return helper.remove_user_role(db, helper.get_user_by_id(db, user_id), topic, db.query(models.Role).filter_by(id=details.role_id).one())
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorised",
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.patch("/users/{user_id}/roles/update")
async def update_user_roles(user_id: int, details: schemas.UserRolesUpdate, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    authenticator = helper.extract_user(db, token)
    topic = db.query(models.Topic).filter_by(id=details.topic_id).one()
    if helper.check_permission(db, authenticator, topic, "can_view_topic_roles"):
        return helper.update_user_roles(db, helper.get_user_by_id(db, user_id), topic, details.roles)
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorised",
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.post("/roles/create")
async def create_role(role_create: schemas.RoleCreate, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    topic = db.query(models.Role).filter_by(id=role_create.topic_id).one()
    if helper.check_permission(db, helper.extract_user(db, token), topic, "can_edit_topic_roles"):
        return helper.create_role(db, topic, role_create.role_name, role_create.permissions)
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorised",
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.get("/roles/{role_id}")
async def get_role(role_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    role = db.query(models.Role).filter_by(id=role_id).one()
    if helper.check_permission(db, helper.extract_user(db, token), role.topic, "can_view_topic_roles"):
        return helper.get_role(role)
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorised",
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.patch("/roles/{role_id}")
async def update_role(role_id: int, role_update: schemas.RoleUpdate, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    role = db.query(models.Role).filter_by(id=role_id).one()
    if helper.check_permission(db, helper.extract_user(db, token), role.topic, "can_edit_topic_roles"):
        return helper.update_role(db, role, role_update.role_name, role_update.permissions)
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorised",
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.post("/user/lookup/assessment/open")
async def find_open_assessment_by_id(token: schemas.UserToken, db: Session = Depends(get_db)):
    res = helper.verify_user(db, token.token)
    user = res[1]
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    result = helper.findOpenAssessmentByUserId(db=db, user_id=user.id)
    return result


@ app.delete("/roles/{role_id}")
async def delete_role(role_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    role = db.query(models.Role).filter_by(id=role_id).one()
    if helper.check_permission(db, helper.extract_user(db, token), role.topic, "can_edit_topic_roles"):
        return helper.delete_role(db, role)
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorised",

    )

# to call this function, the website is already checked the conversation between them is not exist,
# to prevent failuew, the fucntion will return a empty id if it exists


@app.post("/createConversation")
async def create_Conversation(details: schemas.createConversation, db: Session = Depends(get_db)):
    conver_id, conver_name = helper.checkExistConversation(
        db=db, sender_name=details.sender, receiver_name=details.receiver)
    if conver_name is not False:
        print("existed")
        return {"conversation_id": conver_id, "conversation_name": conver_name}
    new_conversation = helper.create_conversation(
        db, sender=details.sender, receiver=details.receiver, sender_id=details.sender_id, receiver_id=details.receiver_id)
    if new_conversation is not None:
        helper.create_group_member(
            db=db, user_id=details.sender_id, conversation_id=new_conversation.id)
        helper.create_group_member(
            db=db, user_id=details.receiver_id, conversation_id=new_conversation.id)
        print("here2")
        return {"conversation_id": new_conversation.id, "conversation_name": new_conversation.conversation_name}

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorised",
        headers={"WWW-Authenticate": "Bearer"},
    )


# only return the conversaitons


@app.post("/getAllConversations")
async def get_allconversations(details: schemas.onlyId, db: Session = Depends(get_db)):
    print("main get conversation")
    # print(details)
    res = helper.findConversations(db, details.id)
    return {"friends": res}

# will also return the messages of this conversation, used to load the chat page


@app.post("/addUserToConversation")
async def addUserToConversation(details: schemas.addNameToConversation, db: Session = Depends(get_db)):
    user = helper.get_user_by_username(db, details.username)
    conver = db.query(models.Conversation).filter_by(
        id=details.conversation_id).first()
    if conver is not None and user is not None:
        newGroupMember = helper.create_group_member(
            db=db, user_id=user.id, conversation_id=conver.id)
        if newGroupMember is None:
            return {"message": "user group member exits", "newName": "undefined"}
        result = helper.update_conversation_name(
            db=db, conversation_name=conver.conversation_name, user_name=user.username)
        print(result)
        return result


@app.get("/api/items/{conversation_name}")
async def get_One_conversation(request: Request, conversation_name, db: Session = Depends(get_db)):
    print(conversation_name)
    token = request.headers.get('Authorization')
    user1 = helper.extract_user(db, token)
    if user1 == None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )

    conver = helper.getOneConversation(db, conversation_name=conversation_name)
    # print(conver)
    if conver is not None:
        helper.updateLastSeen(db, user1, conver)
        # user1, user2 = helper.getBothSidesName(db, conversation_id=conver.id)
        messages = helper.getMessagesOnCon(db, conversation_id=conver.id)
        return {"conversation": conver, "mlist": messages}
    return {"conversation": None, "mlist": []}


@app.post("/sendMessage")
async def send_message(details: schemas.SendMessage, db: Session = Depends(get_db)):
    new_nessage = helper.create_message(
        db, details.conversation_id, details.content, details.sender_name)
    if new_nessage is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return new_nessage


# === Assessment ===


@app.post("/assessment/edit/check/permision")
async def assessmentEditCheckPermission(detail: schemas.CheckAssessmentPermission, db: Session = Depends(get_db)):
    print(detail.token)
    print(detail.topic_id)
    res = False
    user_list = helper.verify_user(db, detail.token)
    user = user_list[1]
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not login"
        )
    else:
        topic = db.query(models.Role).filter_by(id=detail.topic_id).one()
        result = db.query(models.TopicEnrollment).filter_by(
            user_id=user.id, topic_id=topic.id).all()
        print(result)
        if result == []:
            return res
        if helper.check_permission(db, user, topic, "can_edit_assessment"):
            res = True
        else:
            res = False
    return res


@ app.post("/loadAssessmentMain")
async def loadAssessmentMain(token: schemas.UserToken, db: Session = Depends(get_db)):
    # token = param.token
    print("here")
    print("token: " + token.token)
    res = helper.verify_user(db, token.token)
    user = res[1]
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not login"
        )
    result = helper.get_assessment_overview(db, user.id)
    return result


@app.post("/assessment/edit/overview")
async def assessmentEditOverview(token: schemas.UserToken, db: Session = Depends(get_db)):
    res = helper.verify_user(db, token.token)
    user = res[1]
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not login"
        )
    result = helper.get_assessment_edit_overview(db=db)
    helper.updateLog(db, user, "Editing Assessments")
    return result


@app.post("/assessment/detail")
async def assessmentDetail(topic_id: schemas.AssessmentDetail, db: Session = Depends(get_db)):
    result = helper.get_assessment_detail_by_id(db, topic_id.topic_id)
    return result


@app.post("/assessment/attempt/test/overview")
async def assessmentAttemptTestOverview(assessment_id: schemas.AssessmentId, db: Session = Depends(get_db)):
    print(assessment_id.assessment_id)
    result = helper.get_assessmentAttempts_by_assessmentid(
        db=db, assessment_id=assessment_id.assessment_id)
    return result


@app.post("/assessment/attempt/render")
async def renderAssessmentAttempt(assessment_id: schemas.AssessmentId, db: Session = Depends(get_db)):
    result = helper.render_assessment_attempt(db, assessment_id.assessment_id)
    print(result)
    return result


@app.post("/assessment/question/add")
async def addNewQuestionToAssessment(detail: schemas.QuestionAdd, db: Session = Depends(get_db)):
    result = helper.add_new_question_to_assessment(db=db, assessmentId=int(detail.assessment_id),
                                                   type=detail.type,
                                                   question_description=detail.question_description,
                                                   choices=detail.choices, answer=detail.answer)
    return result


@app.post("/assessment/question/update")
async def updateQuestion(detail: schemas.QuestionUpdate, db: Session = Depends(get_db)):
    result = helper.update_question_in_assessment(db=db, questionId=int(detail.question_id),
                                                  type=detail.type, question_description=detail.question_description,
                                                  choices=detail.choices, answer=detail.answer)
    return result


@app.post("/assessment/question/delete")
async def deleteQuestion(detail: schemas.QuestionDelete, db: Session = Depends(get_db)):
    result = helper.delete_question_in_assessment(
        db=db, questionId=int(detail.question_id))
    return result


@app.post("/assessment/delete")
async def deleteAssessment(detail: schemas.AssessmentId, db: Session = Depends(get_db)):
    result = helper.delete_assessment(
        db=db, assessment_id=detail.assessment_id)
    return result


@app.post("/assessment/attempt/mark/render")
async def renderAssessmentAttemptMark(assessment_attempt_id: schemas.AssessmentAttemptId, db: Session = Depends(get_db)):
    result = helper.get_assessment_attempt_detail(
        db, assessment_attempt_id.assessment_attempt_id)
    return result


@app.post("/assessment/attempt/mark/update")
async def updateAssessmentAttempMark(detail: schemas.AssessmentAttemptUpdate, db: Session = Depends(get_db)):
    res = helper.verify_user(db, detail.token)
    user = res[1]
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    print(detail.mark)
    print(detail.feedback)
    result = helper.update_attempt_mark(db=db, attemptId=detail.assessment_attempt_id,
                                        feedback=detail.feedback, mark=float(detail.mark))
    return result


@app.post("/assessment/attempt/list")
async def getAssessmentList(detail: schemas.AssessmentAttemptListQuery, db: Session = Depends(get_db)):
    result = helper.getAssessmentAttemptListById(db=db,
                                                 assessmentId=detail.assessment_id,
                                                 enrollId=detail.enroll_id)
    return result


@app.post("/assessment/assignment/render")
async def renderAssignment(assessment_id: schemas.AssessmentId, db: Session = Depends(get_db)):
    result = helper.render_assignment(
        db=db, assessmentId=assessment_id.assessment_id)
    return result


@app.post("/assessment/submit/mark/render")
async def renderSubmitMart(detail: schemas.AssessmentSubmitQuery, db: Session = Depends(get_db)):
    result = helper.get_assessment_submit_detail(db=db,
                                                 assessmentAttemptId=detail.assessment_attempt_id,
                                                 assessmentId=detail.assessment_id
                                                 )
    return result


@app.post("/assessment/update/attribute")
async def updateAssessmentAttribute(detail: schemas.UpdateAssessmentAttribute, db: Session = Depends(get_db)):
    result = helper.update_assessment_attribute(db=db, assessmentId=detail.assessment_id,
                                                proportion=float(
                                                    detail.proportion),
                                                status=detail.status,
                                                timeRange=detail.timeRange
                                                )
    return result


@app.post("/assessment/add")
async def addNewAssessment(detail: schemas.AssessmentAdd, db: Session = Depends(get_db)):

    result = helper.add_new_assessment(db=db,
                                       topic_id=detail.topic_id,
                                       type=detail.type,
                                       assessmentName=detail.assessmentName,
                                       proportion=detail.proportion,
                                       status=detail.status,
                                       timeRange=detail.timeRange)
    return result


def del_file(file_name):
    print("delete file")
    os.remove(file_name)


@app.get("/assessment/assignment/download/instruction")
async def downloadInstruction(filecollection_id, db: Session = Depends(get_db)):
    result = helper.download_instruction(
        db=db, filecollection_id=filecollection_id)
    # print(result["filename"])
    # print(result["data"])
    # with open(result["filename"],"wb") as my_file:
    #     my_file.write(result["data"])
    file_name = result["filename"]
    file = open(file_name, "wb")
    file.write(result["data"])
    file.close()
    with open(file_name, "r") as f:
        print(f.read())

    dict = {"filename": file_name}
    response = FileResponse(file_name, filename=file_name, headers=dict)
    task = BackgroundTasks()
    task.add_task(del_file, file_name)
    return response


def checker(data: str = Form(...)):
    try:
        model = schemas.AssignmentUpload.parse_raw(data)
    except Exception as e:
        raise HTTPException(
            detail="data not correct",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    return model


def checker2(data: str = Form(...)):
    try:
        model = schemas.AssignmentEdit.parse_raw(data)
    except Exception as e:
        raise HTTPException(
            detail="data not correct",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    return model


@app.post("/assessment/assignment/update")
async def updateAssignment(model: schemas.AssignmentEdit = Depends(checker2),
                           file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()
    newFile = {
        "filename": file.filename,
        "data": content
    }

    result = helper.update_assignmnet_detail(db=db, file=newFile,
                                             assessment_id=int(
                                                 model.assessment_id),
                                             description=model.description)

    return result


@app.post("/assessment/assignment/upload")
async def uploadAssignment(model: schemas.AssignmentUpload = Depends(checker),
                           files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    # result
    print(files)
    file_list = []
    i = 0
    for file in files:
        content = await file.read()
        item = {
            "filename": file.filename,
            "data": content
        }
        file_list.append(item)
        i += 1
    user_res = helper.verify_user(db, model.token)
    user = user_res[1]
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = user.id
    enroll_id = int(model.enroll_id)
    assessment_id = int(model.assessment_id)
    result = helper.submit_assignment(db=db, user_id=user_id,
                                      enroll_id=enroll_id,
                                      assessment_id=assessment_id,
                                      files=file_list)
    return result


@app.post("/assessment/attempt/pracattp")
async def submitPracAttempt(attemptDetail: schemas.AttemptDetail, db: Session = Depends(get_db)):
    user_res = helper.verify_user(db, attemptDetail.token)
    user = user_res[1]
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = user.id
    enroll_id = int(attemptDetail.enroll_id)
    questions = attemptDetail.problem
    assessment_id = int(attemptDetail.assessment_id)
    # print("user_id: " + str(user_id))
    # print("enroll_id: " + str(enroll_id))
    # print("assessment_id: " + str(assessment_id))
    # print("questions: " )
    print(questions)
    result = helper.submit_assessment_attempt(db=db, user_id=user_id, enroll_id=enroll_id,
                                              assessment_id=assessment_id, questions=questions)
    return result


@app.post("/getTopicEnrollment")
async def getTopicEnrollmentById(details: schemas.testTopicEnrollment, db: Session = Depends(get_db)):
    result = helper.get_topicEnroll_overview(
        db=db, enroll_id=details.enroll_id)
    return result


# === FORUMS ===
@app.get("/forum/{forum_id}", response_model=schemas.ForumInfo)
async def forum(forum_id, db: Session = Depends(get_db)):
    data = helper.get_forum(db, forum_id)
    if data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not Found"
        )
    return data


@app.get("/forum/section/{section_id}", response_model=schemas.ThreadPage)
async def get_threads(section_id: int, offset: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return {
        "offset": offset,
        "limit": limit,
        "threads": helper.get_threads(db, section_id, limit, offset),
        "total_count": db.query(models.Thread).filter(models.Thread.section_id == section_id).count()
    }


@app.get("/forum/thread/{section_id}/initial", response_model=schemas.ThreadPage)
async def get_lite_threads(section_id: int, offset: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return {
        "offset": offset,
        "limit": limit,
        "threads": helper.get_threads_lite(db, section_id, limit, offset),
        "total_count": db.query(models.Thread).filter(models.Thread.section_id == section_id).count()
    }


@app.get("/forum/thread/{thread_id}", response_model=schemas.Thread)
async def get_single_thread(thread_id: int, db: Session = Depends(get_db)):
    return helper.get_thread_by_id(db, thread_id)


@app.get("/forum/post/multiple", response_model=List[schemas.Post])
async def get_multiple_posts(ids: Union[List[int], None] = Query(default=None), db: Session = Depends(get_db)):
    results = []
    if ids is None:
        return results
    for id in ids:
        result = helper.get_post_by_id(db, id)
        if result is not None:
            results.append(result)
    return results


@app.get("/forum/post/{post_id}", response_model=schemas.Post)
async def get_single_post(post_id: int, db: Session = Depends(get_db)):
    result = helper.get_post_by_id(db, post_id)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not Found"
        )
    return result


@app.post('/forum/thread', status_code=204)
async def create_thread(details: schemas.ThreadCreate, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    print(details)
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    helper.create_thread(db, details.section_id, user,
                         details.title, details.content)


@app.post('/forum/post', status_code=204)
async def create_post(details: schemas.PostCreate, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    print(details)
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    helper.create_post(db, details.thread_id, user,
                       details.parent_id, details.content)


@app.post('/forum/upvote/thread', status_code=204)
async def upvote_thread(thread_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if thread_id == -1:
        return
    helper.upvote_thread(db, thread_id, user)


@app.post('/forum/downvote/thread', status_code=204)
async def downvote_thread(thread_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    # At this point, we only support 'downvoting' as removing an upvote from a thread rather than actually decreasing the number of upvotes
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if thread_id == -1:
        return
    helper.downvote_thread(db, thread_id, user)


@app.get('/forum/checkvote/thread')
async def checkvote_thread(thread_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if thread_id == -1:
        return {"voted": None}
    return {"voted": helper.checkvote_thread(db, thread_id, user)}


@app.get('/forum/checkvote/post')
async def checkvote_post(post_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if post_id == -1:
        return {"voted": None}
    return {"voted": helper.checkvote_post(db, post_id, user)}


@app.post('/forum/upvote/post', status_code=204)
async def upvote_post(post_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if post_id == -1:
        return
    helper.upvote_post(db, post_id, user)


@app.post('/forum/downvote/post', status_code=204)
async def downvote_post(post_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if post_id == -1:
        return
    helper.downvote_post(db, post_id, user)


@app.post("/forum/mark/sticky", status_code=204)
async def mark_sticky(thread_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif thread_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must specify thread_id"
        )
    target = db.query(models.Thread).filter(
        models.Thread.id == thread_id).one()
    topic = target.section.forum.topic
    if helper.check_permission(db, user, topic, "can_sticky_forum_posts"):
        target.stickied = True
        db.commit()
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorised",)


@app.post("/forum/mark/sticky/remove", status_code=204)
async def remove_mark_sticky(thread_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif thread_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must specify thread_id"
        )
    target = db.query(models.Thread).filter(
        models.Thread.id == thread_id).one()
    topic = target.section.forum.topic
    if helper.check_permission(db, user, topic, "can_sticky_forum_posts"):
        target.stickied = False
        db.commit()
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorised",)


@app.post("/forum/mark/endorsed", status_code=204)
async def mark_as_endorsed(post_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif post_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must specify post_id"
        )
    target = db.query(models.Post).filter(models.Post.id == post_id).one()
    topic = target.thread.section.forum.topic
    if helper.check_permission(db, user, topic, "can_endorse_forum_posts"):
        print("Passed permission check, doing endorsement")
        target.marked_as_endorsed = True
        db.commit()
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorised",)


@app.post("/forum/mark/endorsed/remove", status_code=204)
async def remove_mark_as_endorsed(post_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif post_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must specify post_id"
        )
    target = db.query(models.Post).filter(models.Post.id == post_id).one()
    topic = target.thread.section.forum.topic
    if helper.check_permission(db, user, topic, "can_endorse_forum_posts"):
        target.marked_as_endorsed = False
        db.commit()
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorised",)


@app.post("/forum/mark/answered", status_code=204)
async def mark_as_answered(post_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif post_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must specify post_id"
        )
    target = db.query(models.Post).filter(models.Post.id == post_id).one()
    if target.thread.author == user:
        target.marked_as_answer = True
        db.commit()
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the thread author can mark a post as answered"
        )


@app.post("/forum/mark/answered/remove", status_code=204)
async def remove_mark_as_answered(post_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif post_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must specify post_id"
        )
    target = db.query(models.Post).filter(models.Post.id == post_id).one()
    if target.thread.author == user:
        target.marked_as_answer = False
        db.commit()
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the thread author can unmark a post as answered",
        )


@app.post("/forum/mark/reported", status_code=204)
async def mark_as_reported(post_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif post_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must specify post_id"
        )
    target = db.query(models.Post).filter(models.Post.id == post_id).one()
    if target.author == user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot report your own post",
        )
    else:
        target.reported = True
        db.commit()


@app.post("/forum/mark/reported/remove", status_code=204)
async def remove_mark_as_reported(post_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif post_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must specify post_id"
        )

    target = db.query(models.Post).filter(models.Post.id == post_id).one()
    if target.reported is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Post was not reported"
        )
    if helper.check_permission(db, user, target.thread.section.forum.topic, "can_view_forum_flagged_posts"):
        target.reported = False
        db.commit()


@app.delete("/forum/post", status_code=204)
async def remove_post(post_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif post_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must specify post_id"
        )
    target = db.query(models.Post).filter(models.Post.id == post_id).one()
    if target.author == user or helper.check_permission(db, user, target.thread.section.forum.topic, "can_delete_any_forum_posts"):
        db.delete(target)
        db.commit()
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorised",
        )


@app.delete("/forum/thread", status_code=204)
async def remove_(thread_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif thread_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must specify thread_id"
        )
    target = db.query(models.Thread).filter(
        models.Thread.id == thread_id).one()
    if target.author == user or helper.check_permission(db, user, target.section.forum.topic, "can_delete_any_forum_posts"):
        db.delete(target)
        db.commit()
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorised",
        )


@app.get("/resource_section/{resource_id}")
async def get_resource_section(resource_id, db: Session = Depends(get_db)):
    section = helper.get_resource_section(db, resource_id)
    return section

# === CONTENT ===
@app.get("/user_resources")
async def get_created_resources(db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user:
        return helper.get_created_resources(db, user.id)


@app.get("/enrolled_topics")
async def get_enrolled_topics(db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    return {"topics": helper.get_enrolled_topics(db, helper.extract_user(db, token))}

@app.get("/is_enrolled/{topic_id}")
async def get_is_enrolled(topic_id: int, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user:
        status = helper.is_enrolled_in_topic(db, user_id=user.id, topic_id=topic_id)
        return {"status": status}

@app.get("/topic/{topic_id}")
async def get_topic_info(topic_id: int, db: Session = Depends(get_db)):
    topic = helper.get_topic_info(db, topic_id)
    if topic:
        return topic


@app.get("/topic/{topic_id}/{section}")
async def get_resources(topic_id: int, section: str, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    resources = helper.get_resources(db, user.id, section, topic_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        helper.updateLog(db, user, f"Browsing {resources.title}'s {resources.section}")
    except:
        helper.updateLog(db, user, f"Browsing Topic Resources")
    if not resources:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resource not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {"resources": resources}


@app.get("/resources/{resource_id}")
async def get_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = helper.get_resource(db, resource_id)
    return resource


@app.post("/create_resource")
async def create_resource(details: schemas.ResourceCreate, db: Session = Depends(get_db)):
    resource = helper.create_resource(db, resource_type=details.resource_type, title=details.title, server_path=details.server_path, url=details.url,
                                      duration=details.duration, section=details.section, description=details.description, topic_id=details.topic_id, creator_id=details.creator_id)
    return {"resource_id": resource.id}


@app.put('/edit_resource')
async def edit_resource(details: schemas.ResourceEdit, db: Session = Depends(get_db)):
    resource = helper.edit_resource(db, id=details.id, title=details.title, server_path=details.server_path,
                                    url=details.url, duration=details.duration, section=details.section, description=details.description)

    return resource
    
@app.put('/rearrange_resource')
async def rearrange_resource(details: schemas.RearrangeResource, db: Session = Depends(get_db)):
    resource = helper.rearrange_resource(db, resource_id=details.resource_id, direction=details.direction, topic_id=details.topic_id, section=details.section)

    return resource

@app.delete('/delete_resource')
async def delete_resource(details: schemas.ResourceDelete, db: Session = Depends(get_db)):
    helper.delete_resource(db, id=details.id)


@app.post("/upload_resource")
async def upload_resource(details: schemas.ResourceUpload, db: Session = Depends(get_db)):
    path = helper.upload_resource(
        db, topic_id=details.topic_id, file_name=details.title, file_data=details.file_data, section=details.section)
    return {'server_path': path}


@app.post("/replace_resource")
async def replace_resource(details: schemas.ResourceReplace, db: Session = Depends(get_db)):
    path = helper.replace_resource(
        db, prev_path=details.prev_path, topic_id=details.topic_id, file_name=details.title, file_data=details.file_data, section=details.section)
    return {'server_path': path}


@app.post("/upload_markdown")
async def upload_markdown(details: schemas.MarkdownUpload, db: Session = Depends(get_db)):
    path = helper.upload_markdown(
        db, file_name=details.title, content=details.content, section=details.section, topic_id=details.topic_id)
    return {'server_path': path}


@app.get("/zip/{topic_id}/{section}")
async def get_zip_path(topic_id: int, section: str):
    path = helper.get_zip_path(topic_id, section)
    return {"server_path": path}

@app.post("/complete_resource")
async def mark_resource_complete(details: schemas.ResourceComplete, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    return helper.mark_resource_complete(db, user_id=user.id, resource_id=details.resource_id)

@app.delete('/reset_progress')
async def reset_progress(details: schemas.ResetProgress, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    helper.reset_progress(db, user_id=user.id, topic_id=details.topic_id, section=details.section)

# === TOPIC TREE ===
@app.get('/{topic_id}/users')
async def get_enrolled_users(topic_id, token: str = Depends(JWTBearer(db_generator=get_db())), db: Session = Depends(get_db)):
    return helper.get_enrolled_users(db, topic_id)


@app.get('/pathways', response_model=schemas.PathwayInfoList)
async def get_pathways(user: bool = False, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    return {"pathways": helper.get_pathways(db, user, helper.extract_user(db, token))}


@app.get('/pathway/{pathway_id}', response_model=schemas.Pathway)
async def get_pathway(pathway_id: int, user: bool = False, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    return helper.calculate_pathway(db, pathway_id, user, helper.extract_user(db, token))


@app.post('/create_pathway')
async def create_pathway(details: schemas.PathwayCreate, db: Session = Depends(get_db)):
    pathway = helper.create_pathway(
        db, name=details.name, core_ids=details.core, elective_ids=details.electives)
    return {"pathway_id": pathway.id}


@app.put('/edit_pathway')
async def edit_pathway(details: schemas.PathwayEdit, db: Session = Depends(get_db)):
    pathway = helper.edit_pathway(
        db, pathway_id=details.pathway_id, core_ids=details.core, elective_ids=details.electives)

    return pathway


@app.put('/enrol_in_pathway')
async def enrol_user_in_pathway(details: schemas.PathwayEnrol, db: Session = Depends(get_db)):
    enrollment = helper.enrol_user_in_pathway(
        db, user_id=details.user_id, pathway_id=details.pathway_id)
    return enrollment


@app.put('/edit_topic')
async def edit_topic(details: schemas.PathwayTopicEdit, db: Session = Depends(get_db)):
    topic = helper.edit_topic(
        db, id=details.id, topic_name=details.name, topic_group_id=details.topic_group_id, image_url=details.image_url, description=details.description, sets=details.sets)

    return topic


@app.put('/archive_topic')
async def archive_topic(details: schemas.PathwayTopicArchive, db: Session = Depends(get_db)):
    helper.archive_topic(db, id=details.id, archive=details.archive)


@app.delete('/delete_topic')
async def delete_topic(details: schemas.PathwayTopicDelete, db: Session = Depends(get_db)):
    helper.delete_topic(db, id=details.id)


@app.post('/enrol_in_topic')
async def enrol_user_in_topic(details: schemas.TopicEnrol, db: Session = Depends(get_db)):
    enrollment = helper.enrol_user_in_topic(
        db, user_id=details.user_id, topic_id=details.topic_id)
    if (enrollment):
        return {"enrollment_id": enrollment.id}
    return {"status": "error"}


@app.post("/create_topic")
async def create_topic(details: schemas.PathwayTopicCreate, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
    user = helper.extract_user(db, token)
    if user.superuser:
        topic = helper.create_topic(
            db, topic_name=details.name, topic_group_id=details.topic_group_id, image_url=details.image_url, created_by=user, archived=details.archived, description=details.description)
        return {"topic_id": topic.id}
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )


@app.get("/prerequisite/{prerequisite_id}")
async def get_prereq_info(prerequisite_id: int, db: Session = Depends(get_db)):
    prereq = helper.get_prereq_info(db, prerequisite_id)
    return prereq


@app.delete('/delete_prerequisite')
async def delete_prerequisite(details: schemas.PathwayTopicPrerequisiteSetDelete, db: Session = Depends(get_db)):
    helper.delete_prerequisite(db, id=details.id)


@app.post("/create_prerequisite_sets")
async def create_prerequisite_sets(details: schemas.PathwayTopicPrerequisiteSetsCreate, db: Session = Depends(get_db)):
    ids = helper.create_prerequisite_sets(
        db, topic_id=details.topic, sets=details.sets)
    return {"prerequisite_set_ids": ids}


@app.post("/create_prerequisite")
async def create_prerequisite(details: schemas.PathwayTopicPrerequisiteCreate, db: Session = Depends(get_db)):
    prerequisite = helper.create_prerequisite(
        db, topic_id=details.topic, amount=details.amount, choices=details.choices)
    return {"prerequisite_id": prerequisite.id}


@app.put('/edit_prerequisite')
async def edit_prerequisite(details: schemas.PathwayTopicPrerequisiteEdit, db: Session = Depends(get_db)):
    prerequisite = helper.edit_prerequisite(
        db, prerequisite_id=details.prerequisite_id, topic_id=details.topic, amount=details.amount, choices=details.choices)

    return prerequisite


@app.post("/create_topic_group")
async def create_topic_group(details: schemas.PathwayTopicGroupCreate, db: Session = Depends(get_db)):
    topic_group = helper.create_topic_group(
        db, name=details.name, topics=details.topics)
    return {"topic_group_id": topic_group.id}


@app.put('/edit_topic_group')
async def edit_topic_group(details: schemas.PathwayTopicGroupEdit, db: Session = Depends(get_db)):
    group = helper.edit_topic_group(
        db, group_id=details.group_id, name=details.name, topics=details.topics)

    return group


@app.delete('/delete_topic_group')
async def delete_topic_group(details: schemas.PathwayTopicGroupDelete, db: Session = Depends(get_db)):
    helper.delete_topic_group(db, id=details.id)


@ app.get("/group/{group_id}")
async def get_topic_group(group_id: int, db: Session = Depends(get_db)):
    group = helper.get_topic_group_info(db, group_id)
    return group


@app.get("/topic_groups", response_model=schemas.PathwayTopicGroups)
async def get_topic_groups(db: Session = Depends(get_db)):
    topic_groups = helper.get_topic_groups(db)
    return {"topic_groups": topic_groups}


# === DEBUG ===


@ app.get("/debug/populatedb")
async def populate_db(db: Session = Depends(get_db)):
    helper.create_test_data(engine, db)


@ app.get("/debug/populatedb_demo")
async def populate_db_content(db: Session = Depends(get_db)):
    helper.create_dummy_data(engine, db)


@app.get("/debug/testforum")
async def test_forum(db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(id=1).first()
    section = db.query(models.Section).filter_by(id=1).first()
    thread = models.Thread(
        title="Test", content="Test content", author=user, section=section)
    db.add(thread)
    post_1 = models.Post(content="Test post 1", author=user, thread=thread)
    db.add(post_1)
    post_2 = models.Post(content="Test post 2", author=user, thread=thread)
    db.add(post_2)
    post_3 = models.Post(content="Test post 3", author=user, thread=thread)
    db.add(post_3)
    post_4 = models.Post(content="Test post 4", author=user, thread=thread)
    db.add(post_4)
    post_3.replies.append(post_4)
    post_2.replies.append(post_3)
    post_1.replies.append(post_2)
    db.commit()
    posts = [post for post in thread.posts if post.parent_id is None]
    print(posts)
    replies = post_1.replies
    print(replies)
    print(replies[0].replies)
    print(replies[0].replies[0].replies)
    print(replies[0].replies[0].replies[0].replies)
    return thread

# Meta LMS 23T2

@app.post("/login")
async def login(details: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Function updated to allow mfa
    """
    user = helper.get_user_by_username(db, details.username)
    if (user is not None and helper.verify_password(details.password, user.password)):
        if user.mfa == "email":
            helper.getVerifyEmail(db, user, False)
            return {"mfa": user.mfa, "username": user.username}
        else:
            return helper.loginUser(db, user)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorised",
        headers={"WWW-Authenticate": "Bearer"},
    )

@app.post("/vEmail")
async def vEmail(details: schemas.onlyId, db: Session = Depends(get_db)):
    user = helper.get_user_by_username(db, details.id)
    return helper.getVerifyEmail(db, user, False)

@app.post("/putOtp")
async def putOtp(details: schemas.userOtp, db: Session = Depends(get_db)):
    user = helper.extract_user(db, details.token)
    if user != None and user.username == details.username:
        return helper.putOtp(db, user, details.inputOtp)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorised",
        headers={"WWW-Authenticate": "Bearer"},
    )

@app.post("/recoverPass")
async def recoverPass(details: schemas.recoverPass, db: Session = Depends(get_db)):
    user = helper.get_user_by_username(db, details.username)
    return helper.recoveryAcc(db, user, details.inputOtp, details.newPassword)

@app.post("/chatgpt/sendMessage")
async def chatgpt_api_send_message(details: schemas.GenerativeAI_SendMessage):
    response = chatgpt_send_message(details.message)
    print(f"ChatGPT Response: {response}")

@app.post("/generativeai/sendMessage")
# async def generativeai_send_message(details: schemas.GenerativeAI_SendMessage, db: Session = Depends(get_db), token: str = Depends(JWTBearer(db_generator=get_db()))):
async def generativeai_send_message(details: schemas.GenerativeAI_SendMessage):
    # RYAN TODO: Authenticate user
    # user = helper.extract_user(db, token)

    # RYAN TODO: Get current conversation for user given conversation_id

    # Query OpenAI with conversation history
    response = chatgpt_send_message(details.message)
    print(f"ChatGPT Response: {response}")

@app.post("/setMFA")
async def setMFA(details: schemas.setMFA, db: Session = Depends(get_db)):
    user = helper.extract_user(db, details.token)
    if user != None and user.username == details.id and user.vEmail == user.email:
        return helper.setMFA(db, user, details.mfa)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorised",
        headers={"WWW-Authenticate": "Bearer"},
    )

@app.post("/verifyMFA")
async def verifyMFA(details: schemas.userOtp, db: Session = Depends(get_db)):
    user = helper.get_user_by_username(db, details.username)
    return helper.verifyMFA(db, user, details.inputOtp)

@app.post("/putPicture")
async def putPicture(details: schemas.userImage, db: Session = Depends(get_db)):
    user = helper.extract_user(db, details.token)
    if user != None and user.username == details.id:
        return helper.putPicture(user, details.image)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unauthorised",
        headers={"WWW-Authenticate": "Bearer"},
    )

@app.get("/getPicture/{id}")
async def getPicture(id: int, db: Session = Depends(get_db)):
    user = helper.get_user_by_id(db, id)
    if user:
        return helper.getPicture(user)
    return ""
    
@app.get("/mutalTopicsRoles/{id2}")
async def mutalTopicsRoles(request: Request, id2: int, db: Session = Depends(get_db)):
    token = request.headers.get('Authorization')
    user1 = helper.extract_user(db, token)
    user2 = helper.get_user_by_id(db, id2,user1.superuser)
    if user1 is None or user2 is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return helper.mutalTopicRoles(db, user1, user2)

@app.get("/notifications")
async def notifications(request: Request, db: Session = Depends(get_db)):
    token = request.headers.get('Authorization')
    user1 = helper.extract_user(db, token)
    if user1 is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    helper.updateLog(db, user1, "")
    return helper.getNotifications(db, user1)

@app.get("/activityStatus/{id}")
async def activityStatus(request: Request, id: int, db: Session = Depends(get_db)):
    token = request.headers.get('Authorization')
    user1 = helper.extract_user(db, token)
    user2 = helper.get_user_by_id(db, id, True)

    if user1 is None or user2 is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return helper.getActivityStatus(db, user2, user1.superuser)

@app.post("/setPrivacy")
async def setPrivacy(request: Request, details: schemas.privacy, db: Session = Depends(get_db)):
    token = request.headers.get('Authorization')
    user1 = helper.extract_user(db, token)
    if user1 is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    print(f"id: {user1.id}, full_name: {details.full_name}, email: {details.email}, recent: {details.recent_activity}, invisible: {details.invisible}")
    privUser = models.Privacy(user_id=user1.id, full_name=details.full_name, email=details.email,
                              recent_activity=details.recent_activity,invisible=details.invisible)
    helper.setPrivacy(db, user1, privUser)
    return {"message":"Updated"}

@app.get("/getPrivacy/{id}")
async def getPrivacy(request: Request, id: int, db: Session = Depends(get_db)):
    token = request.headers.get('Authorization')
    user1 = helper.extract_user(db, token)
    user2 = helper.get_user_by_id(db, id, True)

    if user1 is None or user2 is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    priv = helper.getPrivacy(db, user2)
    if priv:
        return {"email": priv.email, "recent_activity": priv.recent_activity, "invisible": priv.invisible, "full_name": priv.full_name}
    return None

@app.get("/exportTopic/{topicId}")
async def exportTopic(request: Request, topicId: int, db: Session = Depends(get_db)):
    token = request.headers.get('Authorization')
    user1 = helper.extract_user(db, token)
    if user1 is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    topic = helper.topicExport(db, topicId)
    if topic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found"
        )
    
    return {"topic":topic[0], "topic_name":topic[1]}

@app.post("/importTopic")
async def importTopic(request: Request, details: schemas.importTopic, db: Session = Depends(get_db)):
    token = request.headers.get('Authorization')
    user1 = helper.extract_user(db, token)
    if user1 is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorised",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return helper.topicImport(db, details.file, user1)

if __name__ == "__main__":
    print(datetime.now())