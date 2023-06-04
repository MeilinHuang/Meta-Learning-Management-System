import random
import string

from re import L
from typing import List, Optional, TypedDict
import os
import jwt
from faker import Faker
from functools import reduce
from sqlalchemy import cast, type_coerce, Numeric, func, insert, exists, Integer, select
import json
from passlib.context import CryptContext
from sqlalchemy import Numeric, cast
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session
import shutil
import smtplib

from . import models, schemas

TOKEN_SECRET = "1fa35d8e94b996509dde52942120251b02ed236abad89b5c347d849849ee3d4c"

# ===== Auth =====

# No need to call this directly


def generate_auth_token():
    chars = string.ascii_lowercase + string.ascii_uppercase + string.digits
    return ''.join(random.choice(chars) for _ in range(16))

# Call this when logging out a user


def invalidate_auth_token(db: Session, user: models.User):
    # user.auth_token = None
    print("here1")
    setattr(user, "auth_token", None)
    db.add(user)
    db.commit()


# Call this when logging in a user, then provide the token to the user


def give_token(db: Session, user: models.User):
    auth_token = generate_auth_token()
    payload = {
        "auth_token": auth_token,
        "user_id": user.id
    }
    # user.auth_token = auth_token
    setattr(user, "auth_token", auth_token)
    db.add(user)
    db.commit()
    return jwt.encode(payload, TOKEN_SECRET, algorithm="HS256")

# Call this at any point to get a user from a token
# Returns a tuple (bool: valid_user, User: user | None)


def verify_user(db: Session, token):
    decoded = jwt.decode(token, TOKEN_SECRET, algorithms=["HS256"])
    query = db.query(models.User).filter_by(id=decoded['user_id'])
    if query.count() != 1:
        return False, None
    user = query.one()
    if user.auth_token != decoded["auth_token"]:
        return False, None
    return True, user

# def verifyEmail(db: Session, receiveEmail: str, message: str):
#     server = smtplib.SMTP("smtp.gmail.com", 587)
#     server.starttls()
#     server.login('metalmsserviceteam@outlook.com', "Abc111111")
#     email_message = message
#     server.sendmail('metalmsserviceteam@outlook.com', receiveEmail, email_message)
#     server.quit()
#     print("Email sent successfully")
#     return {"email": receiveEmail}


def extract_user(db: Session, token):
    decoded = jwt.decode(token, TOKEN_SECRET, algorithms=["HS256"])
    query = db.query(models.User).get(decoded['user_id'])
    return query


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def create_user(db: Session, username: str, password: str, email: str, name: str):
    new_user = models.User(username=username, password=hash_password(
        password), email=email, full_name=name, introduction="")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    if (new_user.id == 1):
        # This is the first user we have created, we should make them a superuser automatically
        # Since, they are most likely the ones who set up the MetaLMS instance so they are probably an administrator
        setattr(new_user, "superuser", True)
        db.commit()
        db.refresh(new_user)
    return give_token(db, new_user)


def usernameNotexists(db: Session, username: str):
    user_name_exists = db.query(exists().where(
        models.User.username == username))
    if db.execute(user_name_exists).scalar():
        return False
    return True

def emailNotexists(db: Session, email: str):
    email_name_exists = db.query(exists().where(
        models.User.email == email))
    if db.execute(email_name_exists).scalar():
        return False
    return True



def check_permission(db: Session, user: models.User, topic: models.Topic, permission_flag):
    if user.superuser:
        return True
    enrollment = db.query(models.TopicEnrollment).filter_by(
        user_id=user.id, topic_id=topic.id).first()
    if enrollment:
        for role in enrollment.roles:
            if getattr(role, permission_flag):
                return True
    return False


def create_message(db: Session, conversation_id: int, content: str, time_created: str, sender_name: str):
    new_message = models.Message(
        conversation_id=conversation_id, content=content, sender_name=sender_name)
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message


def create_group_member(db: Session, user_id: int, conversation_id: int):
    exist = db.query(models.Group_member).filter_by(
        user_id=user_id, conversation_id=conversation_id).first()
    if exist is not None:
        return None
    new_group_member = models.Group_member(
        user_id=user_id, conversation_id=conversation_id)
    db.add(new_group_member)
    db.commit()
    db.refresh(new_group_member)
    return new_group_member


def create_conversation(db: Session, sender: str, receiver: str, sender_id: int, receiver_id: int):
    new_conversation = models.Conversation(
        conversation_name=get_conversation_id_from_user_name(sender, receiver))
    print(new_conversation.id)
    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)
    print("here1")
    return db.query(models.Conversation).filter_by(id=new_conversation.id).first()


def findConversations(db: Session, user_id: str):
    # return all the conversation related to this user.
    print("getting conversation")
    group_members = db.query(models.Group_member).filter_by(
        user_id=user_id).all()
    print("group_members:")
    print(group_members)
    res = []
    for group_member in group_members:
        print(group_member)
        print(group_member.user_id)
        print(group_member.id)
        print(group_member.conversation_id)
        conversation = db.query(models.Conversation).filter_by(
            id=group_member.conversation_id).first()
        print(conversation)
        if conversation is not None:
            group_member2 = db.query(models.Group_member).filter_by(
                conversation_id=conversation.id).all()
            user0 = db.query(models.User).filter_by(
                id=group_member2[0].user_id).first()
            user1 = db.query(models.User).filter_by(
                id=group_member2[1].user_id).first()
            if user0 is not None and user1 is not None:
                res.append({"conver": conversation,
                           "user0": user0.username, "user1": user1.username})
        print(res)
    return res


def getOneConversation(db: Session, conversation_name: str):
    conver = db.query(models.Conversation).filter_by(
        conversation_name=conversation_name).first()
    return conver


def getMessagesOnCon(db: Session, conversation_id: int):
    messages = db.query(models.Message).filter_by(
        conversation_id=conversation_id).all()
    return messages


def get_conversation_id_from_user_name(sender_name: str, receiver_name: str):
    conver_list = [sender_name, receiver_name]
    print(conver_list)
    conver_list.sort()
    print(conver_list)
    newName = "_".join(conver_list)
    print(newName)
    return newName


def update_conversation_name(db: Session, conversation_name: str, user_name: str):
    conver = getOneConversation(db, conversation_name)
    if conver is None:
        return {"message": "conversaion not exits", "newName": "undefined"}
    names = conversation_name.split('_')
    print(names)
    names.append(str(user_name))
    print(names)
    names.sort()
    print(names)
    newName = "_".join(names)
    print(newName)
    setattr(conver, "conversation_name", newName)
    db.commit()
    return {"message": "succussed", "newName": getattr(conver, "conversation_name")}


def checkExistConversation(db: Session, sender_name: str, receiver_name: str):
    conver_name = get_conversation_id_from_user_name(
        sender_name, receiver_name)
    conver_exists = db.query(exists().where(
        models.Conversation.conversation_name == conver_name))
    if db.execute(conver_exists).scalar():
        conver = db.query(models.Conversation).filter_by(
            conversation_name=conver_name).first()
        if conver is not None:
            return conver.id, conver_name
    return False, False


def edit_profile(db: Session, user: models.User, details):
    if (details.full_name != ""):
        setattr(user, "full_name", details.full_name)
    if (details.introduction != ""):
        setattr(user, "introduction", details.introduction)
    db.commit()
    db.refresh(user)
    return db.query(models.User).filter_by(username=details.username).first()


def edit_password(db: Session, user: models.User, newpassword):

    setattr(user, "password", hash_password(newpassword))
    db.commit()
    db.refresh(user)
    return {"message", "successed"}


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter_by(username=username).first()


def get_all_user_list(db: Session):
    query = db.query(models.User).all()
    return query


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter_by(id=user_id).one()


def promote_user(db: Session, target: models.User, authenticator: models.User) -> bool:
    if authenticator.superuser:
        setattr(target, "superuser", True)
        db.commit()
        db.refresh(target)
    return (target.superuser == True)


def demote_user(db: Session, target: models.User, authenticator: models.User) -> bool:
    if authenticator.superuser:
        setattr(target, "superuser", False)
        db.commit()
        db.refresh(target)
    return (target.superuser == False)


def get_superuser_list(db: Session):
    query = db.query(models.User).filter_by(superuser=True).all()
    result = []
    for user in query:
        result.append({"id": user.id, "username": user.username,
                      "full_name": user.full_name})
    return result


def get_non_superuser_list(db: Session):
    query = db.query(models.User).filter_by(superuser=False).all()
    result = []
    for user in query:
        result.append({"id": user.id, "username": user.username,
                      "full_name": user.full_name})
    return result


def is_superuser(db: Session, user: models.User) -> bool:
    return user.superuser == True


def get_topic_roles(db: Session, topic: models.Topic):
    result = []
    for role in topic.roles:
        result.append(get_role(role))
    return result


def get_role(role: models.Role):
    role_dict = {"name": role.role_name, "id": role.id, "perms": {}}
    for attr in vars(role.__class__):
        if attr.startswith("can_"):
            role_dict["perms"][attr] = getattr(role, attr)
    return role_dict


def create_role(db: Session, topic: models.Topic, name: str, permissions: dict):
    role = models.Role(role_name=name, topic_id=topic.id)
    for perm in permissions:
        if perm in vars(role.__class__):
            setattr(role, perm, permissions[perm])
    db.add(role)
    db.commit()
    db.refresh(role)
    return get_role(role)


def update_role(db: Session, role: models.Role, name: Optional[str], permissions: dict):
    if name is not None:
        role.role_name = name        # type: ignore
    for perm in permissions:
        if perm in vars(role.__class__):
            setattr(role, perm, permissions[perm])
    db.commit()
    db.refresh(role)
    return get_role(role)


def delete_role(db: Session, role: models.Role):
    db.delete(role)
    db.commit()
    return True


def get_user_roles(db: Session, user: models.User,  topic: models.Topic):
    enrollment = db.query(models.TopicEnrollment).filter_by(
        user=user, topic=topic).first()
    if enrollment is None:
        return []
    result = []
    for role in enrollment.roles:
        result.append({"name": role.role_name, "id": role.id})
    return result


def findOpenAssessmentByUserId(db: Session, user_id: int):
    result = db.query(models.Assessment, models.Topic.topic_name).filter(
        models.Assessment.topic_id == models.TopicEnrollment.topic_id
    ).filter(
        models.Topic.id == models.Assessment.topic_id
    ).filter(
        models.TopicEnrollment.user_id == user_id
    ).filter(models.Assessment.status == "open").all()

    return result


def give_user_role(db: Session, user: models.User, topic: models.Topic, role: models.Role):
    enrollment = db.query(models.TopicEnrollment).filter_by(
        user=user, topic=topic).first()
    if enrollment is None:
        enrollment = models.TopicEnrollment(user=user, topic=topic)
        db.add(enrollment)
        db.commit()
        db.refresh(enrollment)
    enrollment.roles.append(role)
    db.commit()
    db.refresh(enrollment)
    return get_user_roles(db, user, topic)


def remove_user_role(db: Session, user: models.User, topic: models.Topic, role: models.Role):
    enrollment = db.query(models.TopicEnrollment).filter_by(
        user=user, topic=topic).first()
    if enrollment is None:
        return []
    if role in enrollment.roles:
        enrollment.roles.remove(role)
        db.commit()
        db.refresh(enrollment)
    return get_user_roles(db, user, topic)


def update_user_roles(db: Session, user: models.User, topic: models.Topic, roles: List[int]):
    enrollment = db.query(models.TopicEnrollment).filter_by(
        user=user, topic=topic).first()
    if enrollment is None:
        return []

    enrollment.roles = []
    for role_id in roles:
        role = db.query(models.Role).filter_by(id=role_id).one()
        enrollment.roles.append(role)
        db.commit()
        db.refresh(enrollment)

    return get_user_roles(db, user, topic)


# def send_message(db: Session):
#     return True
def getBothSidesName(db: Session, conversation_id: str):
    users = db.query(models.Group_member).filter_by(
        conversation_id=conversation_id).all()
    return users[0].user_id, users[2].user_id

# === FORUMS ===


def create_forum(db: Session, topic_id: int):
    forum = models.Forum(topic_id=topic_id)
    db.add(forum)
    db.commit()
    db.refresh(forum)
    return forum


def get_forum(db: Session, forum_id: int):
    forum = db.query(models.Forum).filter_by(id=forum_id).one()
    if forum is not None:
        return {
            "id": forum.id,
            "topic_id": forum.topic_id,
            "sections": [{"id": section.id, "title": section.title, "resource_id": section.resource.id if section.resource is not None else -1} for section in forum.sections]
        }
    # TODO: Else, raise exception


def get_resource_section(db: Session, resource_id: int):
    resource = db.query(models.Resource).filter_by(id=resource_id).first()
    if resource:
        return {"id": resource.section_id}


def create_assessment(db: Session, id: int, topic_id: int, topic, type: str, assessmentName: str,
                      proportion: float, description: str, status: str, timeRange: str):
    new_assessment = models.Assessment(id=id, topic_id=topic_id, topic=topic, type=type,
                                       assessmentName=assessmentName, attempts=[],
                                       proportion=proportion, description=description,
                                       status=status, timeRange=timeRange)
    db.add(new_assessment)
    print("create assessment")
    db.commit()
    db.refresh(new_assessment)
    return new_assessment


def create_AssessmentAttempt(db: Session, id: int, assessment, topic_enrollment,
                             mark: float, feedback: str,):
    new_assessmentAttempt = models.AssessmentAttempt(id=id, assessment=assessment,
                                                     topic_enrollment=topic_enrollment,
                                                     mark=mark, feedback=feedback)
    db.add(new_assessmentAttempt)
    db.commit()
    db.refresh(new_assessmentAttempt)
    return new_assessmentAttempt


def create_question(db: Session, id: int, type: str, question_description: str, choices: str, answer_attempt: str,
                    answer: str, assessment_attempt_id: int, assessment_id: int):
    new_question = models.Question(id=id, type=type, question_description=question_description, choices=choices, answer_attempt=answer_attempt,
                                   answer=answer, assessment_attempt_id=assessment_attempt_id,
                                   assessment_id=assessment_id)
    # new_question.assessment_attempts=""
    # new_question.assessments=""
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question


def get_assessment_edit_overview(db: Session):
    overview = db.query(models.Topic).all()
    result = []
    for ele in overview:
        res_dict = {}
        res_dict["id"] = ele.id
        res_dict["topic_name"] = ele.topic_name
        res_dict["description"] = ele.description
        result.append(res_dict)
    return result


def get_assessment_overview(db: Session, user_id: int):
    overview = db.query(models.TopicEnrollment).filter(
        models.TopicEnrollment.user_id == user_id)
    result = []
    for ele in overview:
        res_dict = {}
        res_dict["topic"] = ele.topic
        res_dict["year"] = str(ele.year)
        res_dict["term"] = str(ele.term)
        mark = 0
        assessment_id = 0
        max_mark = 0
        # need modify maybe
        for item in ele.assessment_attempts:
            if item.assessment_id != assessment_id:
                assessment_id = item.assessment_id
                mark = mark + max_mark
            else:
                if item.mark != None:
                    if item.mark > max_mark:
                        max_mark = item.mark
            # mark = mark + item.mark

        # add last assessment_id max_mark
        mark = mark + max_mark
        res_dict["mark"] = mark
        res_dict["topic_id"] = ele.topic_id
        res_dict["enroll_id"] = ele.id
        result.append(res_dict)
    return result


def get_assessmentAttempts_by_assessmentid(db: Session, assessment_id: int):
    # attempts = db.query(models.AssessmentAttempt).join(
    #                     models.TopicEnrollment).join(
    #                     models.User).filter(
    #                     models.AssessmentAttempt.assessment_id == assessment_id).all()
    attempts = db.query(models.AssessmentAttempt, models.TopicEnrollment, models.User).filter(
        models.AssessmentAttempt.topic_enrollment_id == models.TopicEnrollment.id
    ).filter(
        models.TopicEnrollment.user_id == models.User.id
    ).filter(
        models.AssessmentAttempt.assessment_id == assessment_id
    ).all()
    return attempts


def get_assessment_detail_by_id(db: Session, topic_id: int):
    # print("topic_id: " + topic_id)
    detail = db.query(models.Assessment).filter(
        models.Assessment.topic_id == topic_id).all()
    result = []
    for ele in detail:
        res = {}
        res["id"] = ele.id
        res["name"] = ele.assessmentName
        res["type"] = ele.type
        res["status"] = ele.status
        res["proportion"] = ele.proportion
        res["timeRange"] = ele.timeRange
        res["questions"] = ele.questions
        # for e in res["questions"]:
        #     e.choices = json.loads(e.choices)
        #     e.answer = json.loads(e.choices)
        result.append(res)
    return result


def render_assessment_attempt(db: Session, assessmentId: int):
    detail = db.query(models.Assessment).filter(
        models.Assessment.id == assessmentId).one()
    res = detail.questions
    return res


def get_assessment_attempt_detail(db: Session, assessmentAttemptId: int):
    detail = db.query(models.AssessmentAttempt, models.Question).filter(
        models.Question.assessment_attempt_id == models.AssessmentAttempt.id
    ).filter(
        models.AssessmentAttempt.id == assessmentAttemptId
    ).all()
    return detail


def getAssessmentAttemptListById(db: Session, assessmentId: int, enrollId: int):
    result = db.query(models.AssessmentAttempt).filter(
        models.AssessmentAttempt.assessment_id == assessmentId
    ).filter(
        models.AssessmentAttempt.topic_enrollment_id == enrollId
    ).all()
    return result


def update_attempt_mark(db: Session, attemptId: int, mark: float, feedback: str):
    db.query(models.AssessmentAttempt).filter(
        models.AssessmentAttempt.id == attemptId
    ).update({"mark": mark,
              "feedback": feedback
              })
    db.commit()
    result = {"mesg": "success"}
    return result


def get_assessment_submit_detail(db: Session, assessmentAttemptId: int, assessmentId: int):
    detailAttempt = db.query(models.FileCollection).filter(
        models.FileCollection.assessment_attempt_id == assessmentAttemptId
    ).all()

    detailAssessment = db.query(models.FileCollection).filter(
        models.FileCollection.assessment_id == assessmentId
    ).all()
    detail = [detailAssessment, detailAttempt]

    return detail


def render_assignment(db: Session, assessmentId: int):
    detail = db.query(models.Assessment).filter(
        models.Assessment.id == assessmentId).one()
    res = detail.instruction
    # print(detail.questions)
    return res


def update_assessment_attribute(db: Session, assessmentId: int, proportion: float, status: str, timeRange: str):
    db.query(models.Assessment).filter(
        models.Assessment.id == assessmentId
    ).update(
        {
            "proportion": proportion,
            "status": status,
            "timeRange": timeRange
        }
    )
    db.commit()
    return {"mesg": "success"}


def add_new_question_to_assessment(db: Session, assessmentId: int,
                                   type: str, question_description: str,
                                   choices: str, answer: str):

    question_max_id = db.query(func.max(models.Question.id)).one()
    question_id = 1
    if question_max_id[0] != None:
        question_id = question_max_id[0] + 1
    question = models.Question(id=question_id, assessment_id=assessmentId, type=type,
                               question_description=question_description, choices=choices,
                               answer=answer)

    db.add(question)
    db.commit()
    db.refresh(question)
    return {"mesg": "success"}


def update_question_in_assessment(db: Session, questionId: int,
                                  type: str, question_description: str,
                                  choices: str, answer: str):
    db.query(models.Question).filter(
        models.Question.id == questionId
    ).update(
        {
            "type": type,
            "question_description": question_description,
            "choices": choices,
            "answer": answer
        }
    )
    db.commit()
    return {"mesg": "success"}


def delete_question_in_assessment(db: Session, questionId: int):
    db.query(models.Question).filter(
        models.Question.id == questionId
    ).delete()
    db.commit()
    return {"mesg": "success"}


def delete_assessment(db: Session, assessment_id: int):
    assessment = db.query(models.Assessment).filter(
        models.Assessment.id == assessment_id
    ).one()

    for item in assessment.questions:
        print(item.id)
        db.query(models.Question).filter(
            models.Question.id == item.id
        ).delete()

    for item in assessment.instruction:
        print(item.id)
        db.query(models.FileCollection).filter(
            models.FileCollection.id == item.id
        ).delete()

    db.delete(assessment)
    db.commit()
    return {"mesg": "success"}


def add_new_assessment(db: Session, topic_id: str, type: str, assessmentName: str, proportion: str, status: str, timeRange: str):
    assessment_max_id = db.query(func.max(models.Assessment.id)).one()
    assessment_id = 1
    if assessment_max_id[0] != None:
        assessment_id = assessment_max_id[0] + 1

    newAssessment = models.Assessment(id=assessment_id, topic_id=int(topic_id),
                                      type=type, assessmentName=assessmentName,
                                      proportion=float(proportion), status=status,
                                      timeRange=timeRange)
    db.add(newAssessment)
    db.commit()
    db.refresh(newAssessment)

    return newAssessment


def download_instruction(db: Session, filecollection_id: int):
    detail = db.query(models.FileCollection).filter(
        models.FileCollection.id == filecollection_id).one()
    result = {}
    result["filename"] = detail.filename
    result["data"] = detail.data
    return result


def update_assignmnet_detail(db: Session, file: dict, assessment_id: int, description: str):
    # print(assessment_id)
    assessment = db.query(models.Assessment).filter(
        models.Assessment.id == assessment_id
    ).one()

    file_collection_id = 1
    file_collection_max_id = db.query(func.max(models.FileCollection.id)).one()
    if file_collection_max_id[0] != None:
        file_collection_id = file_collection_max_id[0] + 1

    # delete old instruction
    for item in assessment.instruction:
        print(item.id)
        db.query(models.FileCollection).filter(
            models.FileCollection.id == item.id
        ).delete()

    file_collection = models.FileCollection(id=file_collection_id, filename=file["filename"],
                                            data=file["data"], description=description, assessment_id=assessment_id,
                                            assessments=assessment)

    db.add(file_collection)
    assessment.instruction = [file_collection]
    db.commit()
    return {"mesg": "success"}


def submit_assignment(db: Session, user_id: int, enroll_id: int,
                      assessment_id: int, files: list):
    topicEnrollment = db.query(models.TopicEnrollment).filter(
        models.TopicEnrollment.id == enroll_id
    ).one()
    assessment = db.query(models.Assessment).filter(
        models.Assessment.id == assessment_id).one()
    attp_max_id = db.query(func.max(models.AssessmentAttempt.id)).one()
    attp_id = 1
    if attp_max_id[0] != None:
        attp_id = attp_max_id[0] + 1

    file_collection_id = 1
    file_collection_max_id = db.query(func.max(models.FileCollection.id)).one()
    if file_collection_max_id[0] != None:
        file_collection_id = file_collection_max_id[0] + 1

    file_collection_list = []
    new_attempt = models.AssessmentAttempt(id=attp_id, assessment_id=assessment_id,
                                           topic_enrollment_id=enroll_id, assessment=assessment,
                                           topic_enrollment=topicEnrollment)
    for file in files:
        file_collection = models.FileCollection(id=file_collection_id, filename=file["filename"],
                                                data=file["data"], assessment_attempt_id=attp_id,
                                                assessment_attempts=new_attempt)
        file_collection_list.append(file_collection)
        db.add(file_collection)
        db.commit()
        db.refresh(file_collection)
        file_collection_id += 1

    new_attempt.submit = file_collection_list
    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)

    result = {"mesg": "success"}
    return result


def submit_assessment_attempt(db: Session, user_id: int, enroll_id: int,
                              assessment_id: int, questions: list):
    topicEnrollment = db.query(models.TopicEnrollment).filter(
        models.TopicEnrollment.id == enroll_id
    ).one()
    assessment = db.query(models.Assessment).filter(
        models.Assessment.id == assessment_id).one()
    attp_max_id = db.query(func.max(models.AssessmentAttempt.id)).one()
    # create id
    attp_id = 1
    question_id = 1
    if attp_max_id[0] != None:
        attp_id = attp_max_id[0] + 1
    question_max_id = db.query(func.max(models.Question.id)).one()
    if question_max_id[0] != None:
        question_id = question_max_id[0] + 1

    question_list = []
    new_attempt = models.AssessmentAttempt(id=attp_id, assessment_id=assessment_id,
                                           topic_enrollment_id=enroll_id, assessment=assessment,
                                           topic_enrollment=topicEnrollment)

    for q in questions:
        choices = {"choices": q["choice"]}
        answer_attempt = {"answer_attempt": q["answerAttempt"]}
        answer = {"answer": q["answer"]}
        question_obj = models.Question(id=question_id, type=q["type"], choices=json.dumps(choices),
                                       question_description=q["problemDescription"], answer_attempt=json.dumps(
                                           answer_attempt),
                                       answer=json.dumps(answer), assessment_attempt_id=attp_id)
        question_obj.assessment_attempts = new_attempt
        question_id = question_id + 1
        question_list.append(question_obj)
        db.add(question_obj)
        db.commit()
        db.refresh(question_obj)
    #
    new_attempt.questions = question_list
    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)

    print(new_attempt)
    result = {"mesg": "success"}
    return result


def get_topicEnroll_overview(db: Session, enroll_id: int):
    res = db.query(models.TopicEnrollment).filter(
        models.TopicEnrollment.id == enroll_id).one()
    result = res.assessment_attempts
    return result


def upvote_thread(db: Session, thread_id: int, user: models.User):
    thread = db.query(models.Thread).filter(
        models.Thread.id == thread_id).one()
    topic = thread.section.forum.topic
    user_enrollment = db.query(models.TopicEnrollment).filter_by(
        user=user, topic=topic).one()
    if user_enrollment in thread.upvoted_by:
        # Already upvoted, do nothing
        return
    thread.upvoted_by.append(user_enrollment)
    thread.num_upvotes += 1
    db.commit()


def downvote_thread(db: Session, thread_id: int, user: models.User):
    thread = db.query(models.Thread).filter(
        models.Thread.id == thread_id).one()
    topic = thread.section.forum.topic
    user_enrollment = db.query(models.TopicEnrollment).filter_by(
        user=user, topic=topic).one()
    if user_enrollment not in thread.upvoted_by:
        # User has not upvoted, do nothing
        return
    thread.upvoted_by.remove(user_enrollment)
    if thread.num_upvotes > 0:
        thread.num_upvotes -= 1
    db.commit()


def checkvote_thread(db: Session, thread_id: int, user: models.User):
    thread = db.query(models.Thread).filter(
        models.Thread.id == thread_id).one()
    topic = thread.section.forum.topic
    user_enrollment = db.query(models.TopicEnrollment).filter_by(
        user=user, topic=topic).one()
    return user_enrollment in thread.upvoted_by


def checkvote_post(db: Session, post_id: int, user: models.User):
    post = db.query(models.Post).filter(
        models.Post.id == post_id).one()
    topic = post.thread.section.forum.topic
    user_enrollment = db.query(models.TopicEnrollment).filter_by(
        user=user, topic=topic).one()
    return user_enrollment in post.upvoted_by


def upvote_post(db: Session, post_id: int, user: models.User):
    post = db.query(models.Post).filter(
        models.Post.id == post_id).one()
    topic = post.thread.section.forum.topic
    user_enrollment = db.query(models.TopicEnrollment).filter_by(
        user=user, topic=topic).one()
    if user_enrollment in post.upvoted_by:
        # Already upvoted, do nothing
        return
    post.upvoted_by.append(user_enrollment)
    post.num_upvotes += 1
    db.commit()


def downvote_post(db: Session, post_id: int, user: models.User):
    post = db.query(models.Post).filter(
        models.Post.id == post_id).one()
    topic = post.thread.section.forum.topic
    user_enrollment = db.query(models.TopicEnrollment).filter_by(
        user=user, topic=topic).one()
    if user_enrollment not in post.upvoted_by:
        # User has not upvoted, do nothing
        return
    post.upvoted_by.remove(user_enrollment)
    if post.num_upvotes > 0:
        post.num_upvotes -= 1
    db.commit()


def get_ordered_threads(threadQuery, limit: int, offset: int):
    pinned = []
    vote_sorted = []
    for thread in threadQuery:
        if thread.stickied:
            pinned.append(thread)
        else:
            vote_sorted.append(thread)
    vote_sorted.sort(key=lambda x: x.num_upvotes, reverse=True)
    result = pinned + vote_sorted
    return result[offset:offset + limit]


def get_ordered_posts(posts):
    endorsed_posts = []
    answered_posts = []
    other_posts = []
    for post in posts:
        if post.marked_as_endorsed:
            endorsed_posts.append(post)
        elif post.marked_as_answer:
            answered_posts.append(post)
        else:
            other_posts.append(post)
    other_posts.sort(key=lambda x: x.num_upvotes, reverse=True)
    return endorsed_posts + answered_posts + other_posts


def get_post_by_id(db: Session, post_id: int):
    post = db.query(models.Post).filter_by(id=post_id).first()
    if post is None:
        return None
    return format_post(post)


def get_thread_by_id(db: Session, thread_id: int):
    thread = db.query(models.Thread).filter_by(id=thread_id).one()
    filtered_posts = [post for post in thread.posts if post.parent_id is None]
    sorted_posts = get_ordered_posts(filtered_posts)
    thread_dict = {
        "id": thread.id,
        "section_id": thread.section_id,
        "title": thread.title,
        "author": {
            "id": thread.author.id,
            "name": thread.author.full_name,
            "username": thread.author.username
        },
        "content": thread.content,
        "upvotes": thread.num_upvotes,
        "time": thread.time_created,
        "updated_at": thread.time_updated,
        "posts": [post.id for post in sorted_posts],
        "stickied": thread.stickied,
        "reported": thread.reported,
    }
    return thread_dict


def get_threads_lite(db: Session, section_id: int, limit: int, offset: int):
    query = db.query(models.Thread).filter(
        models.Thread.section_id == section_id).all()
    query = get_ordered_threads(query, limit, offset)
    result = []
    for thread in query:
        thread_dict = {
            "id": thread.id,
            "section_id": thread.section_id,
            "title": thread.title,
            "author": {
                "id": 0,
                "name": "",
                "username": ""
            },
            "content": thread.content[:30] if len(thread.content) > 30 else thread.content[:len(thread.content)],
            "upvotes": 0,
            "time": None,
            "updated_at": None,
            "posts": [],
            "stickied": thread.stickied,
            "reported": thread.reported,
        }
        result.append(thread_dict)
    return result


def get_threads(db: Session, section_id: int, limit: int, offset: int):
    query = db.query(models.Thread).filter(
        models.Thread.section_id == section_id).all()
    query = get_ordered_threads(query, limit, offset)
    result = []
    for thread in query:
        filtered_posts = [
            post for post in thread.posts if post.parent_id is None]
        sorted_posts = get_ordered_posts(filtered_posts)
        thread_dict = {
            "id": thread.id,
            "section_id": thread.section_id,
            "title": thread.title,
            "author": {
                "id": thread.author.id,
                "name": thread.author.full_name,
                "username": thread.author.username
            },
            "content": thread.content,
            "upvotes": thread.num_upvotes,
            "time": thread.time_created,
            "updated_at": thread.time_updated,
            "posts": [post.id for post in sorted_posts],
            "stickied": thread.stickied,
            "reported": thread.reported,
        }
        result.append(thread_dict)
    return result


def format_post(post: models.Post):
    sorted_replies = sorted(
        post.replies, key=lambda x: x.num_upvotes, reverse=True)
    post_dict = {
        "id": post.id,
        "thread_id": post.thread_id,
        "author": {
            "id": post.author.id,
            "name": post.author.full_name,
            "username": post.author.username
        },
        "content": post.content,
        "time": post.time_created,
        "updated_at": post.time_updated,
        "upvotes": post.num_upvotes,
        "replies": [reply.id for reply in sorted_replies],
        "answered": post.marked_as_answer,
        "endorsed": post.marked_as_endorsed,
        "reported": post.reported
    }
    return post_dict


def create_thread(db: Session, section_id: int, author: models.User, title: str, content: str):
    thread = models.Thread(section=db.query(models.Section).filter_by(
        id=section_id).one(), author=author, title=title, content=content)
    db.add(thread)
    db.commit()
    db.refresh(thread)
    return thread


def create_post(db: Session, thread_id: int, author: models.User, parent_id: int, content: str):
    reply = models.Post(thread=db.query(models.Thread).filter_by(id=thread_id).one(), author=author, parent=db.query(
        models.Post).filter_by(id=parent_id).one() if parent_id is not None else None, content=content)
    db.add(reply)
    db.commit()
    db.refresh(reply)
    return reply

# === CONTENT ===


def get_created_resources(db: Session, user_id: int):
    resources = db.query(models.Resource).filter_by(creator_id=user_id).all()

    formatted_resources = []
    for resource in resources:
        topic = db.query(models.Topic).filter_by(id=resource.topic_id).first()
        if topic:
            formatted_resources.append({
                "id": resource.id,
                "title": resource.title,
                "topic": topic.topic_name,
                "topic_id": resource.topic_id,
                "section": resource.section,
                "server_path": resource.server_path,
                "url": resource.url,
                "resource_type": resource.resource_type
            })

    return formatted_resources


def get_enrolled_topics(db: Session, user: models.User):
    enrollments = db.query(models.TopicEnrollment).filter_by(
        user_id=user.id).all()

    topics = []
    for enrollment in enrollments:
        topic = db.query(models.Topic).filter_by(
            id=enrollment.topic_id).first()
        if topic:
            topics.append(topic)

    return topics

def is_enrolled_in_topic(db: Session, user_id: int, topic_id: int):
    enrollment = db.query(models.TopicEnrollment).filter_by(user_id=user_id, topic_id=topic_id).first()
    if (enrollment):
        return True
    return False


def get_topic_info(db: Session, topic_id: int):
    topic = db.query(models.Topic).filter_by(id=topic_id).first()

    formatted_prereq_sets = []
    prereq_sets = db.query(models.Prerequisite).filter_by(
        topic_id=topic_id).all()

    for prereq_set in prereq_sets:
        formatted_prereq_sets.append({
            "amount": prereq_set.amount,
            "choices": [{
                "id": choice.id,
                "name": choice.topic_name
            } for choice in prereq_set.choices]
        })

    if topic:
        ret = {
            "title": topic.topic_name,
            "image_url": topic.image_url,
            "description": topic.description,
            "archived": topic.archived,
            "topic_group": None,
            "sets": formatted_prereq_sets
        }

        if (topic.topic_group is not None):
            ret["topic_group"] = {
                "id": topic.topic_group_id,
                "name": topic.topic_group.name
            }

        return ret


def get_resources(db: Session, user_id: int, section: str, topic_id: int):
    resources = db.query(models.Resource).filter_by(
        section=section, topic_id=topic_id).all()

    res = []
    for resource in resources:
        resource_res = resource.__dict__
        complete_status = db.query(models.CompleteResource).filter_by(
            user_id=user_id, resource_id=resource.id).first()
        if (complete_status):
            resource_res["complete"] = True
        else:
            resource_res["complete"] = False
        res.append(resource_res)

    return res


def get_resource(db: Session, resource_id: int):
    resource = db.query(models.Resource).filter_by(id=resource_id).first()

    if resource:
        return resource


def create_resource(db: Session, resource_type: str, title: str, server_path: str, url: str, duration: int, section: str,  description: str, topic_id: int, creator_id: int):
    order_index = 1

    resources = db.query(models.Resource).filter_by(
        topic_id=topic_id, section=section).all()
    if (resources and len(resources) > 0):
        last_resource = resources[-1]
        if (last_resource):
            order_index = last_resource.order_index + 1

    resource = models.Resource(resource_type=resource_type, title=title, server_path=server_path, url=url,
                               duration=duration, section=section, description=description, topic_id=topic_id, creator_id=creator_id, order_index=order_index)
    db.add(resource)
    db.commit()
    db.refresh(resource)
    topic = db.query(models.Topic).filter_by(id=topic_id).one()
    forum = topic.forum
    new_section = models.Section(forum=forum, title=title, resource=resource)
    db.add_all([resource, new_section])
    db.commit()

    # Update zip file for topic resources folder
    replace_zip(f"{topic_id}", section)

    return resource


def edit_resource(db: Session, id: int, title: str, server_path: str, url: str, duration: int, section: str,  description: str):
    resource = db.query(models.Resource).filter_by(id=id).first()

    if (resource):
        resource.title = title
        resource.server_path = server_path
        resource.url = url
        resource.duration = duration
        resource.section = section
        resource.description = description

        db.commit()
        db.refresh(resource)

    return resource


def rearrange_resource(db: Session, resource_id: int, direction: bool, topic_id: int, section: str):
    res = db.query(models.Resource).filter_by(
        topic_id=topic_id, section=section).all()

    resources = sorted(res, key=lambda r: r.order_index)
    target_resource = db.query(
        models.Resource).filter_by(id=resource_id).first()

    if target_resource:
        for i in range(0, len(resources)):
            if (resources[i].id == target_resource.id):
                if (direction):
                    # Move resource up
                    if (i-1 >= 0):
                        prev = resources[i-1]
                        prev_order = prev.order_index
                        prev.order_index = target_resource.order_index
                        target_resource.order_index = prev_order
                else:
                    # Move resource down
                    if (i+1 < len(resources)):
                        next = resources[i+1]
                        next_order = next.order_index
                        next.order_index = target_resource.order_index
                        target_resource.order_index = next_order

    db.commit()


def delete_resource(db: Session, id: int):
    # We also need to delete the associated forum section
    db.query(models.Section).filter_by(resource_id=id).delete()
    db.query(models.Resource).filter_by(id=id).delete()
    db.commit()


def upload_resource(db: Session, topic_id: str, section: str, file_name: str, file_data):
    with open(f"static/{topic_id}/{section}/{file_name}", "wb") as file:
        file.write(bytes(file_data))

    # return file path on server
    return f"/static/{topic_id}/{section}/{file_name}"


def replace_resource(db: Session, prev_path: str, topic_id: str, section: str, file_name: str, file_data):
    if (prev_path and os.path.exists(prev_path[1:])):
        os.remove(prev_path[1:])

    return upload_resource(db, topic_id, section, file_name, file_data)

# TODO: ADD TOPIC_ID


def upload_markdown(db: Session, topic_id: str, section: str, file_name: str, content: str):
    file_name = file_name.replace(' ', '-')
    path = f"static/{topic_id}/{section}/{file_name}"
    md_file = path + ".md"
    with open(md_file, "w") as file:
        file.write(content)

    # Convert to PDF
    os.system(
        f"node backend/node_modules/.bin/md-to-pdf static/{topic_id}/{section}/{file_name}.md")

    return f"/{path}.pdf"


def replace_zip(topic_id: str, section: str):
    zipname = f"{topic_id}_{section}.zip"
    if (os.path.exists(f"static/{topic_id}/{zipname}")):
        os.remove(f"static/{topic_id}/{zipname}")

    zip_folder(topic_id, section)


def zip_folder(topic_id: str, section: str):
    shutil.make_archive(f"static/{topic_id}/{topic_id}_{section}",
                        'zip', root_dir=f"static/{topic_id}", base_dir=f"{section}")


def get_zip_path(topic_id: int, section: str):
    return f"/static/{topic_id}/{topic_id}_{section}.zip"


def mark_resource_complete(db, user_id: int, resource_id: int):
    complete_status = models.CompleteResource(
        user_id=user_id, resource_id=resource_id)
    db.add(complete_status)
    db.commit()
    db.refresh(complete_status)


def reset_progress(db, user_id: int, topic_id: int, section: str):
    resources = db.query(models.Resource).filter_by(
        topic_id=topic_id, section=section)
    for resource in resources:
        complete_status = db.query(models.CompleteResource).filter_by(
            user_id=user_id, resource_id=resource.id).first()
        if (complete_status):
            db.query(models.CompleteResource).filter_by(
                user_id=user_id, resource_id=resource.id).delete()

    db.commit()

# === TOPIC TREE ===


def get_enrolled_users(db: Session, topic_id: int):
    enrollments = db.query(models.TopicEnrollment).filter_by(
        topic_id=topic_id).all()
    users = []

    for enrollment in enrollments:
        user = db.query(models.User).filter_by(id=enrollment.user_id).first()
        users.append(user)

    return users


def get_pathways(db: Session, for_user: bool, user: models.User):
    if for_user:
        query = db.query(models.Pathway).filter(
            models.Pathway.users.contains(user)).all()
    else:
        query = db.query(models.Pathway).all()
        print()

    pathways = []
    for pathway in query:
        pathways.append({
            "id": pathway.id,
            "name": pathway.name
        })
    return pathways
    # return [pathway.id for pathway in query]


def calculate_pathway(db: Session, pathway_id: int, include_user_status: bool, user: models.User):
    # create global pathway if it doesn't exist
    if pathway_id == 0 and len(db.query(models.Pathway).filter_by(id=0).all()) == 0:
        global_pathway = models.Pathway(id=0, name="Global Pathway")
        db.add(global_pathway)
        db.commit()
        db.refresh(global_pathway)

    pathway = db.query(models.Pathway).filter_by(id=pathway_id).one()
    if pathway is not None:
        return {
            "id": pathway.id,
            "name": pathway.name,
            "core": get_recursive_path(pathway.core, db, include_user_status, user),
            "electives": get_recursive_path(pathway.electives, db, include_user_status, user)
        }


def get_recursive_path(topics: List[models.Topic], db: Session, include_user_status: bool, user: models.User):
    result = []
    for topic in topics:
        enrollment = db.query(models.TopicEnrollment).filter(
            models.TopicEnrollment.user == user, models.TopicEnrollment.topic == topic).first()
        topic_dict = {
            "id": topic.id,
            "name": topic.topic_name,
            "topic_group": {
                "id": topic.topic_group.id if topic.topic_group is not None else None,
                "name": topic.topic_group.name if topic.topic_group is not None else None,
            },
            "status": None if include_user_status is False else 'not-started' if enrollment is None else ('complete' if enrollment.complete == True else 'in-progress'),
            "archived": topic.archived,
            "needs": []
        }
        for prerequisite in topic.prerequisites:
            prereq_dict = {
                "id": prerequisite.id,
                "amount": prerequisite.amount,
                "choices": get_recursive_path(prerequisite.choices, db, include_user_status, user)
            }
            topic_dict["needs"].append(prereq_dict)
        result.append(topic_dict)
    return result


def create_topic(db: Session, topic_name: str, topic_group_id: Optional[int], image_url: Optional[str], created_by: models.User, archived: Optional[bool] = False, description: str = ""):
    if topic_group_id is None:
        topic = models.Topic(topic_name=topic_name, description=description)
    else:
        topic = models.Topic(topic_name=topic_name,
                             topic_group_id=topic_group_id, description=description)

    setattr(topic, 'image_url', image_url) if image_url else setattr(topic, 'image_url',
                                                                     "https://images.saymedia-content.com/.image/t_share/MTc0NDgzODgzMTEzMzI1OTI4/what-are-fractals-and-the-history-behind-them.jpg")
    setattr(topic, 'archived', archived) if archived else setattr(
        topic, 'archived', False)

    if len(db.query(models.Pathway).filter_by(id=0).all()) == 0:
        # create global pathway if it does not exist
        global_pathway = models.Pathway(id=0, name="Global Pathway")
    else:
        global_pathway = db.query(models.Pathway).filter_by(id=0).one()
    global_pathway.electives.append(topic)
    db.add_all([topic, global_pathway])
    db.commit()
    db.refresh(topic)
    # Set roles for the topic creator
    creator_role = db.query(models.Role).filter_by(
        role_name="Creator", topic=topic).one()
    # We need to enroll the creator into the topic
    creator_enrollment = models.TopicEnrollment(user=created_by, topic=topic)
    creator_enrollment.roles.append(creator_role)
    db.add_all([creator_enrollment])
    db.commit()

    # Create resource folders
    if (not os.path.exists(f"static/{topic.id}")):
        os.mkdir(f"static/{topic.id}")
        if (not os.path.exists(f"static/{topic.id}/preparation")):
            os.mkdir(f"static/{topic.id}/preparation")
        if (not os.path.exists(f"static/{topic.id}/content")):
            os.mkdir(f"static/{topic.id}/content")

    return topic


def edit_topic(db: Session, id: int, topic_name: str, topic_group_id: Optional[int], image_url: Optional[str], sets: List[schemas.PrerequisiteSet], description: str = ""):
    topic = db.query(models.Topic).filter_by(id=id).one()

    if (topic):
        topic.topic_name = topic_name
        topic.topic_group_id = topic_group_id
        topic.image_url = image_url if image_url else "https://images.saymedia-content.com/.image/t_share/MTc0NDgzODgzMTEzMzI1OTI4/what-are-fractals-and-the-history-behind-them.jpg"
        topic.description = description

        # Delete all old prerequisite sets
        prereq_sets = db.query(
            models.Prerequisite).filter_by(topic_id=id).all()
        for prereq_set in prereq_sets:
            delete_prerequisite_set(db, prereq_set.id)

        # add new sets
        create_prerequisite_sets(db, id, sets)

        db.commit()
        db.refresh(topic)
        return topic


def archive_topic(db: Session, id: int, archive: bool):
    topic = db.query(models.Topic).filter_by(id=id).one()

    if (topic):
        topic.archived = archive
        db.commit()
        db.refresh(topic)


def delete_topic(db: Session, id: int):
    # Delete prerequisite sets
    incoming_edges = db.query(models.Prerequisite).filter_by(topic_id=id).all()
    for prereq_set in incoming_edges:
        delete_prerequisite_set(db, prereq_set.id)

    outgoing_edges = db.query(models.Prerequisite).filter(
        models.Prerequisite.choices.any(id=id))
    for prereq_set in outgoing_edges:
        delete_prerequisite_set(db, prereq_set.id)

    db.query(models.Topic).filter_by(id=id).delete()

    db.commit()


def create_prerequisite_sets(db: Session, topic_id: int, sets: List[schemas.PrerequisiteSet]):
    created_sets = []

    for set in sets:
        created_set = create_prerequisite(
            db, topic_id, set.amount, set.choices)
        created_sets.append(created_set.id)

    return created_sets


def delete_prerequisite_set(db: Session, prereq_id: int):
    deleted = db.query(models.Prerequisite).filter_by(id=prereq_id).delete()

    db.commit()
    return deleted

# create prerequisite set given an amount and list of prerequisite topic ids


def create_prerequisite(db: Session, topic_id: int, amount: int, choices: List[int]):
    topic = db.query(models.Topic).filter_by(id=topic_id).one()

    prereqs = []
    for prereq_id in choices:
        prereq = db.query(models.Topic).filter_by(id=prereq_id).one()
        prereqs.append(prereq)

    prereq_set = models.Prerequisite(
        topic=topic, amount=amount, choices=prereqs)
    db.add(prereq_set)
    db.commit()
    db.refresh(prereq_set)

    return prereq_set


def edit_prerequisite(db: Session, prerequisite_id: int, topic_id: int, amount: int, choices: List[int]):
    edited_prereq = models.Prerequisite(
        topic_id=topic_id, amount=amount, choices=[])
    delete_prerequisite_set(db, prereq_id=prerequisite_id)

    setattr(edited_prereq, "topic_id", topic_id)
    setattr(edited_prereq, "amount", amount)

    prereqs = []
    for prereq_id in choices:
        prereq = db.query(models.Topic).filter_by(id=prereq_id).one()
        prereqs.append(prereq)

    setattr(edited_prereq, "choices", prereqs)

    db.commit()
    db.refresh(edited_prereq)

    return edited_prereq


def get_prereq_info(db: Session, prerequisite_id: int):
    prereq_set = db.query(models.Prerequisite).filter_by(
        id=prerequisite_id).first()

    if (prereq_set):
        return {
            "id": prereq_set.id,
            "amount": prereq_set.amount,
            "target_id": prereq_set.topic_id,
            "target_name": prereq_set.topic.topic_name,
            "choices": [{
                "id": choice.id,
                "name": choice.topic_name
            } for choice in prereq_set.choices]
        }


def delete_prerequisite(db: Session, id: int):
    db.query(models.Prerequisite).filter_by(id=id).delete()

    db.commit()


def create_topic_group(db: Session, name: str, topics: List[int]):
    group = models.TopicGroup(name=name)

    for topic_id in topics:
        topic = db.query(models.Topic).filter_by(id=topic_id).first()
        if (topic):
            topic.topic_group_id = group.id
            topic.topic_group = group

    db.add(group)
    db.commit()
    db.refresh(group)
    return group


def delete_topic_group(db: Session, id: int):
    # Delete topics
    topics = db.query(models.Topic).filter_by(topic_group_id=id).all()

    for topic in topics:
        delete_topic(db, topic.id)

    db.query(models.TopicGroup).filter_by(id=id).delete()

    db.commit()


def edit_topic_group(db: Session, group_id: int, name: str, topics: List[int]):
    group = db.query(models.TopicGroup).filter_by(id=group_id).first()

    if group:
        group.name = name
        current_topics = db.query(models.Topic).filter_by(
            topic_group_id=group_id).all()
        for topic in current_topics:
            topic.topic_group_id = None
            topic.topic_group = None

        for topic_id in topics:
            topic = db.query(models.Topic).filter_by(id=topic_id).first()
            if topic:
                topic.topic_group_id = group_id
                topic.topic_group = group

        db.add(group)
        db.commit()
        db.refresh(group)
        return group

# get all topic groups from the global pathway


def get_topic_groups(db: Session):
    query = db.query(models.TopicGroup).all()
    topic_groups = []
    for group in query:
        group_dict = {
            "id": group.id,
            "name": group.name
        }
        topic_groups.append(group_dict)
    return topic_groups


def get_topic_group_info(db: Session, group_id: int):
    group = db.query(models.TopicGroup).filter_by(id=group_id).first()
    topics = db.query(models.Topic).filter_by(topic_group_id=group_id).all()

    if group:
        return {
            "id": group.id,
            "name": group.name,
            "topics": topics
        }


def find_pathway_topics(db: Session, core_ids: List[int], elective_ids: List[int]):
    core_topics = []
    for core_id in core_ids:
        core_topic = db.query(models.Topic).filter_by(id=core_id).one()
        core_topics.append(core_topic)

    elective_topics = []
    for elective_id in elective_ids:
        elective_topic = db.query(models.Topic).filter_by(id=elective_id).one()
        elective_topics.append(elective_topic)

    return {
        "core_topics": core_topics,
        "elective_topics": elective_topics
    }


def create_pathway(db: Session, name: str, core_ids: List[int], elective_ids: List[int]):
    pathway = models.Pathway(name=name)

    topics = find_pathway_topics(db, core_ids, elective_ids)
    pathway.core = topics["core_topics"]
    pathway.electives = topics["elective_topics"]

    db.add(pathway)
    db.commit()
    db.refresh(pathway)
    return pathway


def edit_pathway(db: Session, pathway_id: int, core_ids: List[int], elective_ids: List[int]):
    pathway = db.query(models.Pathway).filter_by(id=pathway_id).first()

    if (pathway):
        topics = find_pathway_topics(db, core_ids, elective_ids)
        pathway.core = topics["core_topics"]
        pathway.electives = topics["elective_topics"]

        db.commit()
        db.refresh(pathway)
        return pathway


def enrol_user_in_pathway(db: Session, user_id: int, pathway_id: int):
    user = db.query(models.User).filter_by(id=user_id).first()
    pathway = db.query(models.Pathway).filter_by(id=pathway_id).first()

    if (user is not None and pathway is not None):
        user.pathways.append(pathway)
        db.commit()
        db.refresh(user)
        return {"user_pathways": user.pathways}


def enrol_user_in_topic(db: Session, user_id: int, topic_id: int):
    user = db.query(models.User).filter_by(id=user_id).first()
    topic = db.query(models.Topic).filter_by(id=topic_id).first()

    if (user is not None and topic is not None):
        enrollment = models.TopicEnrollment(user=user, topic=topic)
        db.commit()
        db.refresh(enrollment)
        return enrollment


# === DEBUG ===

def create_dummy_data(engine: Engine, db: Session):

    fake = Faker()
    # Users
    user1_token = create_user(
        db, "admin", "test", "admin@gmail.com", "John Smith")
    user1 = extract_user(db, user1_token)

    user2_token = create_user(db, "student", "test",
                              "student@gmail.com", "Jason Wayne")
    user2 = extract_user(db, user2_token)

    user3_token = create_user(db, "academic", "test",
                              "academic@gmail.com", "Academic A")
    user3 = extract_user(db, user3_token)
    
    user4 = create_user(db, "student123", "test",
                              "student123@gmail.com", "Student")

    # Topics
    topic_variables = create_topic(db, "Variables", None, image_url="https://cdn.shopify.com/s/files/1/0120/4849/8752/articles/iStock-1284852950_2000x.jpg?v=1618859184",
                                   created_by=user1, description="Learn about containers for storing data and basic data types in C.")
    topic_conditions = create_topic(db, "Conditions", None, image_url="https://st2.depositphotos.com/1744479/42139/i/600/depositphotos_421393010-stock-photo-two-paths-merge-one-monmouth.jpg",
                                    created_by=user1, description="Learn about control flow with if/else statements.")
    topic_functions = create_topic(db, "Functions", None, image_url="https://assets.weforum.org/article/image/LBMjvr90_kZ6lRoN0D1ZN9tVitAkaKlE4xyjRmIHC_M.jpg",
                                   created_by=user1, description="Learn to write clean code by encapsulating repeating logic in functions.")
    topic_pointers = create_topic(db, "Pointers", None, image_url="https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
                                  created_by=user1, description="Learn the basics of memory management in C.")
    topic_loops = create_topic(db, "Loops", None, image_url="https://img.poki.com/cdn-cgi/image/quality=78,width=600,height=600,fit=cover,f=auto/866858bc3f68d2bb0739b2ef598d9f2d.png",
                               created_by=user1, description="Learn to use conditional statements to create repeating logic with for and while loops.")
    topic_recursion = create_topic(db, "Recursion", None, image_url="https://www.therussianstore.com/media/wysiwyg/Traditional_Russian_Matryoshka.jpg",
                                   created_by=user1, description="Learn about functions that call themselves and how this can be applied to solve recursive problems.")
    topic_arrays = create_topic(db, "Arrays", None, image_url="https://images.unsplash.com/flagged/photo-1550719723-8602e87f2dc8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJlaWdodCUyMHRyYWlufGVufDB8fDB8fA%3D%3D&w=1000&q=80",
                                created_by=user1, description="Learn about the list data type and its powerful applications.")

    topic_complexity = create_topic(db, "Complexity Analysis", None, image_url="https://www.hospitalveterinariglories.com/wp-content/uploads/2019/03/african-spurred-tortoise-in-the-grass.jpg",
                                    created_by=user1, description="Learn to analyse code efficiency with big O notation.")
    topic_lists = create_topic(db, "Linked Lists", None, image_url="https://static.vecteezy.com/system/resources/previews/002/170/364/non_2x/a-human-chain-in-paper-symbolizing-the-union-vector.jpg",
                               created_by=user1, description="Learn about the linked list abstract data type.")
    topic_stacks = create_topic(db, "Stacks", None, image_url="https://freefoodphotos.com/imagelibrary/crockery_cookware/stack_of_plates.jpg",
                                created_by=user1, description="Learn about the LIFO principle and implement the stack data structure in C.")
    topic_queues = create_topic(db, "Queues", None, image_url="https://www.incimages.com/uploaded_files/image/1920x1080/getty_177129252_49311.jpg",
                                created_by=user1, description="Learn about the FIFO principle and implement the queue data structure in C.")
    topic_trees = create_topic(db, "Trees", None, image_url="https://www.gardeningknowhow.com/wp-content/uploads/2017/07/hardwood-tree.jpg",
                               created_by=user1, description="Learn about the tree data structure and implement a binary search tree.")
    topic_graphs = create_topic(db, "Graphs", None, image_url="https://media.springernature.com/lw630/nature-cms/uploads/collections/Networks-Collection-img-final-f2c265a59e457f48645e2aa3ff90e942.jpg",
                                created_by=user1, description="Learn about different kinds of graphs and their applications.")

    # Prerequisites
    create_prerequisite(db, cast(topic_conditions.id, Numeric), 1, [
                        cast(topic_variables.id, Numeric)])
    create_prerequisite(db, cast(topic_functions.id, Numeric), 1, [
                        cast(topic_variables.id, Numeric)])
    create_prerequisite(db, cast(topic_pointers.id, Numeric), 1, [
                        cast(topic_variables.id, Numeric)])

    create_prerequisite(db, cast(topic_loops.id, Numeric), 1, [
                        cast(topic_conditions.id, Numeric)])
    create_prerequisite(db, cast(topic_recursion.id, Numeric), 1, [
                        cast(topic_functions.id, Numeric)])
    create_prerequisite(db, cast(topic_arrays.id, Numeric),
                        1, [cast(topic_pointers.id, Numeric)])

    create_prerequisite(db, cast(topic_complexity.id, Numeric), 1, [
                        cast(topic_loops.id, Numeric)])
    create_prerequisite(db, cast(topic_complexity.id, Numeric), 1, [
                        cast(topic_recursion.id, Numeric)])
    create_prerequisite(db, cast(topic_complexity.id, Numeric), 1, [
                        cast(topic_arrays.id, Numeric)])

    create_prerequisite(db, cast(topic_lists.id, Numeric), 1, [
                        cast(topic_complexity.id, Numeric)])

    create_prerequisite(db, cast(topic_stacks.id, Numeric),
                        1, [cast(topic_lists.id, Numeric)])
    create_prerequisite(db, cast(topic_queues.id, Numeric),
                        1, [cast(topic_lists.id, Numeric)])
    create_prerequisite(db, cast(topic_trees.id, Numeric),
                        1, [cast(topic_lists.id, Numeric)])

    create_prerequisite(db, cast(topic_graphs.id, Numeric), 1, [cast(
        topic_stacks.id, Numeric), cast(topic_queues.id, Numeric)])
    create_prerequisite(db, cast(topic_graphs.id, Numeric),
                        1, [cast(topic_trees.id, Numeric)])

    # Topic groups
    group_c = create_topic_group(db, 'C Fundamentals', topics=[cast(topic_variables.id, Integer), cast(topic_conditions.id, Integer), cast(
        topic_functions.id, Integer), cast(topic_pointers.id, Integer), cast(topic_loops.id, Integer), cast(topic_recursion.id, Integer), cast(topic_arrays.id, Integer)])
    group_ds = create_topic_group(db, 'Data Structures', topics=[cast(topic_complexity.id, Integer), cast(topic_lists.id, Integer), cast(
        topic_stacks.id, Integer), cast(topic_trees.id, Integer), cast(topic_graphs.id, Integer), cast(topic_queues.id, Integer)])

    # Resources
    topic_id = 1  # variables

    # preparation resources
    create_resource(db, resource_type="document", title="Learning Outcomes", server_path=f"/static/{topic_id}/preparation/outcomes.pdf", url="",
                    duration=6, section="preparation", description="", topic_id=topic_id, creator_id=cast(user1.id, Numeric))
    create_resource(db, resource_type="document", title="Setting up VLAB", server_path=f"/static/{topic_id}/preparation/setup.pdf", url="",
                    duration=6, section="preparation", description="", topic_id=topic_id, creator_id=cast(user1.id, Numeric))
    create_resource(db, resource_type="slides", title="Prerequisite Recap", server_path=f"/static/{topic_id}/preparation/recap.pdf", url="",
                    duration=6, section="preparation", description="If this information is unfamiliar to you, refer to the prerequisite topics to refresh your knowledge.", topic_id=topic_id, creator_id=cast(user1.id, Numeric))

    # content
    create_resource(db, resource_type="video", title="Coding Basics: Variables", server_path=f"/static/{topic_id}/content/variables.mp4", url="https://www.youtube.com/embed/ghCbURMWBD8",
                    duration=6, section="content", description="A brief introduction to the role of variables in all programming languages.", topic_id=topic_id, creator_id=cast(user1.id, Numeric))
    create_resource(db, resource_type="audio", title="Variables in C", server_path=f"/static/{topic_id}/content/variables.mp3", url="", duration=10,
                    section="content", description="We'll explore how variables are used in the C programming language.", topic_id=topic_id, creator_id=cast(user1.id, Numeric))
    create_resource(db, resource_type="slides", title="Data Types", server_path=f"/static/{topic_id}/content/variables_slides.pdf", url="",
                    duration=15, section="content", description="", topic_id=topic_id, creator_id=cast(user1.id, Numeric))
    create_resource(db, resource_type="document", title="Operations on Variables", server_path=f"/static/{topic_id}/content/variables.pdf", url="",
                    duration=20, section="content", description="", topic_id=topic_id, creator_id=cast(user1.id, Numeric))
    create_resource(db, resource_type="link", title="Linked Resource", server_path="", url="https://www.programiz.com/c-programming/c-variables-constants",
                    duration=25, section="content", description="Read the example code snippets carefully to learn about constants and literals.", topic_id=topic_id, creator_id=cast(user1.id, Numeric))
    create_resource(db, resource_type="file", title="File Resource", server_path=f"/static/{topic_id}/content/code.zip", url="", duration=25,
                    section="content", description="Code examples.", topic_id=topic_id, creator_id=cast(user1.id, Numeric))

    # Pathways
    path_a = create_pathway(db, name="Pathway A", core_ids=[cast(topic_variables.id, Integer), cast(topic_functions.id, Integer), cast(topic_conditions.id, Integer), cast(
        topic_pointers.id, Integer), cast(topic_recursion.id, Integer), cast(topic_complexity.id, Integer), cast(topic_lists.id, Integer)], elective_ids=[])
    path_b = create_pathway(db, name="Pathway B", core_ids=[cast(topic_lists.id, Integer), cast(topic_stacks.id, Integer), cast(
        topic_queues.id, Integer), cast(topic_trees.id, Integer), cast(topic_graphs.id, Integer)], elective_ids=[])

    # topicEnrollment
    # student enrol
    enrol1 = models.TopicEnrollment(
        user=user2, topic=topic_complexity, year=2023, term="T1")
    enrol2 = models.TopicEnrollment(
        user=user2, topic=topic_lists, year=2023, term="T1")
    enrol3 = models.TopicEnrollment(
        user=user2, topic=topic_stacks, year=2023, term="T1")

    # academic enrol
    role1 = models.Role(id=101, topic=topic_complexity,
                        can_edit_assessment=True)
    role2 = models.Role(id=102, topic=topic_lists, can_edit_assessment=True)
    role3 = models.Role(id=103, topic=topic_stacks, can_edit_assessment=True)
    enrol4 = models.TopicEnrollment(
        user=user3, topic=topic_complexity, year=2023, term="T1", roles=[role1])
    enrol5 = models.TopicEnrollment(
        user=user3, topic=topic_lists, year=2023, term="T1", roles=[role2])
    enrol6 = models.TopicEnrollment(
        user=user3, topic=topic_stacks, year=2023, term="T1", roles=[role3])

    # questions-related
    choices1 = {"choices": [
        'A. log(n)',
        'B. n^2;',
        'C. n;',
        'D. nlog(n);'
    ]}
    answer1 = {"answer": ['D. nlog(n);']}

    choices2 = {"choices": [
        'A. Selection sort', 'B. Bubble sort', 'C. Insertion sort', 'D. Quick sort']}
    answer2 = {"answer": ['A. Selection sort',
                          'B. Bubble sort', 'C. Insertion sort']}
    answer3 = {"answer": ""}

    choices4 = {"choices": [
        'A. len(list)', 'B. type(list)', 'C. int(list)', 'D. list(list)']}
    answer4 = {"answer": ['A. len(list)']}

    q1 = create_question(db=db, id=1, type="singleChoice",
                         question_description="What is the correct average time complexity for mergesort",
                         choices=json.dumps(choices1), answer=json.dumps(answer1), answer_attempt="",
                         assessment_attempt_id=1, assessment_id=1)
    q2 = create_question(db=db, id=2, type="multipleChoice",
                         question_description="Select the sort functions that they have same average time complexity",
                         choices=json.dumps(choices2), answer=json.dumps(answer2), answer_attempt="",
                         assessment_attempt_id=1, assessment_id=1)
    q3 = create_question(db=db, id=3, type="Essay",
                         question_description="Please explain why the avg time complexity of merge sort is nlog(n)",
                         choices="", answer=json.dumps(answer3), answer_attempt="",
                         assessment_attempt_id=1, assessment_id=1)
    q4 = create_question(db=db, id=4, type="Essay",
                         question_description="How to split a list from index 1 to the last index in python",
                         choices="", answer=json.dumps(answer3), answer_attempt="",
                         assessment_attempt_id=1, assessment_id=1)
    q5 = create_question(db=db, id=5, type="singleChoice",
                         question_description="which of the functions below can be used to get the length of list",
                         choices=json.dumps(choices4), answer=json.dumps(answer4), answer_attempt="",
                         assessment_attempt_id=1, assessment_id=1)

    # assessment-related
    assessment1 = create_assessment(db, 1, 6, topic_complexity, "quiz", "quiz1",
                                    0.2, "topic1 quiz1", "open", "2023/04/01 to 2023/04/30")
    assessment1.questions = [q1, q2, q3]
    db.add(assessment1)
    assessment2 = create_assessment(db, 2, 6, topic_complexity, "quiz", "quiz2",
                                    0.2, "topic6 quiz2", "close", "2023/04/25 to 2023/04/30")
    assessment2.questions = [q4, q5]
    db.add(assessment2)
    assessment3 = create_assessment(db, 3, 6, topic_complexity, "quiz", "quiz3",
                                    0.2, "topic6 quiz2", "close", "2023/05/01 to 2023/05/30")
    assessment4 = create_assessment(db, 4, 6, topic_complexity, "exam", "final exam",
                                    0.4, "topic6 exam", "close", "2023/05/29 to 2023/05/30")
    assessment5 = create_assessment(db, 5, 7, topic_lists, "assignment", "assignment1",
                                    0.5, "topic7 assignment1", "open", "2023/04/01 to 2023/04/30")

    f = open("backend/requirements.txt", "rb+")

    instruction1 = models.FileCollection(id=1, description="This is short description for assignment1",
                                         filename="requirements.txt", data=f.read(), assessment_id=5)
    instruction1.assessments = assessment5
    assessment5.instruction = [instruction1]
    db.add(instruction1)
    db.add(assessment5)
    f.close()
    assessment6 = create_assessment(db, 6, 7, topic_lists, "exam", "final exam",
                                    0.5, "topic7 exam", "close", "2023/05/29 to 2023/05/30")
    db.add_all([enrol1, enrol2, enrol3, enrol4, enrol5, enrol6])
    db.commit()

    # Forum data
    forum_target_section = db.query(models.Section).filter_by(id=1).one(
    )
    forum_student_token = create_user(
        db, "Forum Student", 'password123', 'forumstudent@test.com', 'Forum Student')
    forum_student = extract_user(db, forum_student_token)
    forum_student_enrollment = models.TopicEnrollment(user=forum_student, topic=forum_target_section.forum.topic, year=2023, term="T1", roles=[
                                                      db.query(models.Role).filter_by(role_name="Student", topic=forum_target_section.forum.topic).one()])
    forum_staff_token = create_user(
        db, 'Forum Staff Member', 'password123', 'forumstaff@test.com', 'Forum Staff Member')
    forum_staff = extract_user(db, forum_staff_token)
    forum_staff_enrollment = models.TopicEnrollment(user=forum_staff, topic=forum_target_section.forum.topic, year=2023, term="T1", roles=[
        models.Role(role_name="Forum Staff",
                    topic=forum_target_section.forum.topic,
                    can_view_topic_roles=True,
                    can_endorse_forum_posts=True,
                    can_sticky_forum_posts=True,
                    can_delete_any_forum_posts=True,
                    can_appear_as_forum_staff=True,
                    can_view_forum_flagged_posts=True,
                    ),
    ])

    target_thread = models.Thread(section=forum_target_section, author=forum_staff,
                                  title="Here is a thread with posts that have been marked", stickied=True, content="This thread will contain a variety of posts")
    target_thread.posts.extend(
        [
            models.Post(
                author=forum_student, content="This is a post that has been endorsed", marked_as_endorsed=True),
            models.Post(
                author=forum_student, content="This is a post that has been marked as an answer", marked_as_answer=True),
            models.Post(
                author=forum_student, content="This is a post that has been highly upvoted", num_upvotes=10),
            models.Post(
                author=forum_student, content="This is a post that has been somewhat upvoted", num_upvotes=5),
            models.Post(
                author=forum_student, content="This is a post that has not been upvoted", num_upvotes=0),
            models.Post(author=forum_student,
                        content="This is a post that may contain reportable content", num_upvotes=0),
            models.Post(author=forum_student,
                        content="This is a post that has been reported", reported=True),
        ])
    db.add(target_thread)

    # Generate random forum data
    def generate_nested_posts(db: Session, thread: models.Thread, authors: List[models.User], max_depth: int, max_replies: int, is_top_recursion: bool) -> List[models.Post]:
        result = []
        if (max_depth <= 0):
            return result
        num_responses = random.randint(0, max_replies)
        have_endorsed = False
        have_answered = True
        for _ in range(0, num_responses):
            post = models.Post(thread=thread, author=random.choice(
                authors), content=fake.text(), num_upvotes=random.randint(0, 8))
            if is_top_recursion and not have_endorsed and random.randint(0, 3) == 1:
                post.marked_as_endorsed = True  # type: ignore
                have_endorsed = True
            if is_top_recursion and not have_answered and random.randint(0, 3) == 1:
                post.marked_as_answer = True  # type: ignore
                have_answered = True
            post_replies = generate_nested_posts(db,
                                                 thread, authors, max_depth=max_depth - 1, max_replies=max_replies, is_top_recursion=False)
            post.replies.extend(post_replies)
            db.add(post)
            result.append(post)
        return result
    forums = db.query(models.Forum).all()
    for forum in forums:
        for section in forum.sections:
            target_sticky = random.randint(0, 3)
            num_sticky = 0
            for _ in range(0, random.randint(5, 80)):
                user = random.choice(db.query(models.User).all())
                thread = models.Thread(section=section, author=user, title=fake.sentence(
                    nb_words=8), content=fake.text(), num_upvotes=random.randint(0, 20))
                if (num_sticky < target_sticky) and random.randint(0, 10) > 7:
                    thread.sticky = True
                    num_sticky += 1
                thread.posts.extend(generate_nested_posts(db,
                                                          thread, [user1, user2], 6, 4, True))
                db.add(thread)
    db.commit()


def create_test_data(engine: Engine, db: Session):
    # Only run if database is empty
    if not engine.table_names():
        return

    fake = Faker()

    # Create users

    user1_token = create_user(db, "test", "test", "test@test.com", "Test User")
    user2_token = create_user(
        db, "test2", "test", "test2@test.com", "Test User 2")
    user3_token = create_user(
        db, "test3", "test", "test3@test.com", "Test User 3")
    user4_token = create_user(
        db, "test4", "test", "test4@test.com", "Test User 4")
    user1 = extract_user(db, user1_token)
    user2 = extract_user(db, user2_token)
    user3 = extract_user(db, user3_token)
    user4 = extract_user(db, user4_token)

    # Create topics
    t1 = create_topic(db, "Topic 1", None, None, user2)
    t2 = create_topic(db, "Topic 2", None, None, user2)
    t3 = create_topic(db, "Topic 3", None, None, user2)
    t4 = create_topic(db, "Topic 4", None, None, user2)
    t5 = create_topic(db, "Topic 5", None, None, user2)
    t6 = create_topic(db, "Topic 6", None, None, user2)
    t7 = create_topic(db, "Topic 7", None, None, user2)
    t8 = create_topic(db, "Elective 1", None, None, user2)
    t9 = create_topic(db, "Elective 2", None, None, user2)
    pre1 = models.Prerequisite(topic=t1, amount=1, choices=[t2])
    pre2 = models.Prerequisite(topic=t1, amount=1, choices=[t3, t4])
    pre3 = models.Prerequisite(topic=t3, amount=1, choices=[t5])
    pre4 = models.Prerequisite(topic=t2, amount=2, choices=[t6, t7])
    pre5 = models.Prerequisite(topic=t9, amount=1, choices=[t8])

    # Add resources to topic 5
    topic_id = 5
    create_resource(db, resource_type="video", title="Video Resource", server_path=f"/static/{topic_id}/content/video.mp4", url="https://www.youtube.com/embed/WYeFqSjvGaY",
                    duration=30, section="content", description="Video resource description.", topic_id=topic_id, creator_id=cast(user1.id, Numeric))
    create_resource(db, resource_type="audio", title="Audio Resource", server_path=f"/static/{topic_id}/content/audio.mp3", url="", duration=20,
                    section="content", description="Audio resource description.", topic_id=topic_id, creator_id=cast(user1.id, Numeric))
    create_resource(db, resource_type="slides", title="Slides Resource", server_path=f"/static/{topic_id}/content/slides.pdf", url="",
                    duration=15, section="content", description="Slide resource description.", topic_id=topic_id, creator_id=cast(user1.id, Numeric))
    create_resource(db, resource_type="document", title="Document Resource", server_path=f"/static/{topic_id}/content/document.pdf", url="",
                    duration=10, section="content", description="Document resource description.", topic_id=topic_id, creator_id=cast(user1.id, Numeric))
    create_resource(db, resource_type="link", title="Linked Resource", server_path="", url="https://www.programiz.com/c-programming/c-arrays",
                    duration=10, section="content", description="Link resource description.", topic_id=topic_id, creator_id=cast(user1.id, Numeric))
    create_resource(db, resource_type="file", title="File Resource", server_path=f"/static/{topic_id}/content/code.c", url="", duration=25,
                    section="content", description="File resource description.", topic_id=topic_id, creator_id=cast(user1.id, Numeric))

    path = models.Pathway(name="Test Path")
    path.core.extend([t2, t6, t7])
    path.electives.extend([t8, t9])

    user1.pathways.append(path)
    # enrol2 = models.TopicEnrollment(user=user1, topic=t2)
    enrol6 = models.TopicEnrollment(user=user3, topic=t6, year=2023, term="T1")
    enrol7 = models.TopicEnrollment(user=user3, topic=t7, year=2023, term="T1")
    enrol8 = models.TopicEnrollment(user=user3, topic=t8, year=2023, term="T1")

    role1 = models.Role(id=101, topic=t6, can_edit_assessment=True)
    role2 = models.Role(id=102, topic=t7, can_edit_assessment=True)
    role3 = models.Role(id=103, topic=t8, can_edit_assessment=True)
    enrol9 = models.TopicEnrollment(
        user=user4, topic=t6, year=2023, term="T1", roles=[role1])
    enrol10 = models.TopicEnrollment(
        user=user4, topic=t7, year=2023, term="T1", roles=[role2])
    enrol11 = models.TopicEnrollment(
        user=user4, topic=t8, year=2023, term="T1", roles=[role3])

    # enrolments to check homepage
    enrol12 = models.TopicEnrollment(
        user=user1, topic=t1, year=2023, term="T1")
    enrol13 = models.TopicEnrollment(
        user=user1, topic=t2, year=2023, term="T1")
    enrol14 = models.TopicEnrollment(
        user=user1, topic=t3, year=2023, term="T1")

    # create assessment
    # q1 = create_question(db, id: int,type: str, choices: list answer_attempt: list,
    #                 answer: list, assessment_attempt_id: int,assessment_id: int)
    choices1 = {"choices": [
        'A. cout << "Hello World";',
        'B. Console.WriteLine("Hello World");',
        'C. print ("Hello World");',
        'D. System.out.println("Hello World");'
    ]}
    answer1 = {"answer": ['A. cout << "Hello World";']}

    choices2 = {"choices": [
        'A. calloc()', 'B. malloc()', 'C. realloc()', 'D. free()']}
    answer2 = {"answer": ['A. calloc()', 'B. malloc()']}
    answer3 = {"answer": ""}

    q1 = create_question(db=db, id=1, type="singleChoice",
                         question_description="What is a correct syntax to output \"Hello World\" in C++?",
                         choices=json.dumps(choices1), answer=json.dumps(answer1), answer_attempt="",
                         assessment_attempt_id=1, assessment_id=1)
    q2 = create_question(db=db, id=2, type="multipleChoice",
                         question_description="which of the functions below can be used Allocate space for array in memory",
                         choices=json.dumps(choices2), answer=json.dumps(answer2), answer_attempt="",
                         assessment_attempt_id=1, assessment_id=1)
    q3 = create_question(db=db, id=3, type="Essay",
                         question_description="What is the best programming language",
                         choices="", answer=json.dumps(answer3), answer_attempt="",
                         assessment_attempt_id=1, assessment_id=1)
    q4 = create_question(db=db, id=4, type="Essay",
                         question_description="What is the best programming language",
                         choices="", answer=json.dumps(answer3), answer_attempt="",
                         assessment_attempt_id=1, assessment_id=1)
    q5 = create_question(db=db, id=5, type="multipleChoice",
                         question_description="which of the functions below can be used Allocate space for array in memory",
                         choices=json.dumps(choices2), answer=json.dumps(answer2), answer_attempt="",
                         assessment_attempt_id=1, assessment_id=1)

    assessment1 = create_assessment(db, 1, 6, t6, "quiz", "quiz1",
                                    0.2, "topic1 quiz1", "open", "2023/03/01 to 2023/03/30")
    assessment1.questions = [q1, q2, q3]
    db.add(assessment1)
    assessment2 = create_assessment(db, 2, 6, t6, "quiz", "quiz2",
                                    0.2, "topic6 quiz2", "close", "2023/04/01 to 2023/04/30")
    assessment2.questions = [q4, q5]
    db.add(assessment2)
    assessment3 = create_assessment(db, 3, 6, t6, "quiz", "quiz3",
                                    0.2, "topic6 quiz2", "close", "2023/05/01 to 2023/05/30")
    assessment4 = create_assessment(db, 4, 6, t6, "exam", "final exam",
                                    0.4, "topic6 exam", "close", "2023/05/29 to 2023/05/30")
    assessment5 = create_assessment(db, 5, 7, t7, "assignment", "assignment1",
                                    0.5, "topic7 assignment1", "open", "2023/03/01 to 2023/03/30")

    f = open("backend/requirements.txt", "rb+")

    instruction1 = models.FileCollection(id=1, description="This is short description for assignment1",
                                         filename="requirements.txt", data=f.read(), assessment_id=5)
    instruction1.assessments = assessment5
    assessment5.instruction = [instruction1]
    db.add(instruction1)
    db.add(assessment5)
    f.close()
    assessment6 = create_assessment(db, 6, 7, t7, "exam", "final exam",
                                    0.5, "topic7 exam", "close", "2023/05/29 to 2023/05/30")
    db.add_all([user1, user2, user3, user4, path, enrol6,
               enrol7, enrol8, enrol9, enrol10, enrol11])

    db.add_all([t1, t2, t3, t4, t5, t6, t7, t8, t9, pre1,
               pre2, pre3, pre4, pre5])
    db.add_all([assessment1, assessment2, assessment3, assessment4])
    db.add(assessment1)

    # Create forum data
    def generate_nested_posts(db: Session, thread: models.Thread, authors: List[models.User], max_depth: int, max_replies: int) -> List[models.Post]:
        result = []
        if (max_depth <= 0):
            return result
        num_responses = random.randint(0, max_replies)
        for _ in range(0, num_responses):
            post = models.Post(thread=thread, author=random.choice(
                authors), content=fake.text())
            post_replies = generate_nested_posts(db,
                                                 thread, authors, max_depth=max_depth - 1, max_replies=max_replies)
            post.replies.extend(post_replies)
            db.add(post)
            result.append(post)
        return result
    for section in t1.forum.sections:
        for _ in range(1, 91):
            user = random.choice([user1, user2])
            thread = models.Thread(section=section, author=user, title=fake.sentence(
                nb_words=8), content=fake.text())
            thread.posts.extend(generate_nested_posts(db,
                                                      thread, [user1, user2], 6, 4))
            db.add(thread)

    db.commit()


def create_test_data_converstion(engine: Engine, db: Session):

    if not engine.table_names():
        return

    fake = Faker()

    user1_token = create_user(db, "test", "test", "test@test.com", "Test User")
    user2_token = create_user(
        db, "test2", "test", "test2@test.com", "Test User 2")
    user3_token = create_user(
        db, "test3", "test", "test3@test.com", "Test User 3")
    user4_token = create_user(
        db, "test4", "test", "test4@test.com", "Test User 4")
    user1 = extract_user(db, user1_token)
    user2 = extract_user(db, user2_token)
    user3 = extract_user(db, user3_token)
    user4 = extract_user(db, user4_token)

    create_conversation(db, user1.username, user2.username, user1.id, user2.id)

    db.commit()
