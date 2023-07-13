from __future__ import annotations
from typing import List, Optional, Union, ForwardRef, Any, Dict
from pydantic import BaseModel
from datetime import datetime, timezone
from fastapi import Form, File, UploadFile


class Message(BaseModel):
    id: str
    username: str
    content: str
    time_created: str
    # const param = {user_id: parseInt(localStorage.getItem("user_id") as string)}


class SendMessage(BaseModel):
    conversation_id: int
    sender_name: str
    content: str
    time_created: str


class onlyId(BaseModel):
    id: str


class addNameToConversation(BaseModel):
    username: str
    conversation_id: int


class createConversation(BaseModel):
    sender: str
    sender_id: int
    receiver: str
    receiver_id: int


class Conversation(BaseModel):
    id: int
    author_id: int
    username: str
    messages: List[Message]


class User(BaseModel):
    id: int
    username: str
    password: str
    email: str
    full_name: str
    auth_token: Union[str, None]
    introduction: str
    friends: List[Conversation]
    superuser: bool
    vEmail: str
    lastOtp: str

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    username: str
    password: str
    email: str
    full_name: str

# onlu include the username and information which user can change


class UserEdit(BaseModel):
    username: str
    full_name: str
    introduction: str


class UserPassword(BaseModel):
    username: str
    password: str
    newpassword: str


class UserLogin(BaseModel):
    username: str
    password: str

# these info will be shown to other cosumes (like password is not inside)


class UserPublic(BaseModel):
    username: str
    full_name: str
    email: str
    introduction: str
    # involved topics


class UserIDList(BaseModel):
    ids: List[int]
    token: str


class Email(BaseModel):
    email: str
    verificationCode: str


class Token(BaseModel):
    access_token: str
    token_type: str


class OnlyToken(BaseModel):
    access_token: str


class RoleCreate(BaseModel):
    role_name: str
    permissions: Dict[str, bool]
    topic_id: int


class RoleGiveOrRemove(BaseModel):
    user_id: int
    topic_id: int
    role_id: int


class UserRolesUpdate(BaseModel):
    user_id: int
    topic_id: int
    roles: List[int]


class RoleUpdate(BaseModel):
    role_name: Optional[str]
    permissions: Dict[str, bool]


# === FORUMS ===

class BasicSectionInfo(BaseModel):
    id: int
    title: str
    resource_id: int


class ForumInfo(BaseModel):
    id: int
    topic_id: int
    sections: List[BasicSectionInfo]


class AuthorDetails(BaseModel):
    id: int
    name: str
    username: str


class Post(BaseModel):
    id: int
    thread_id: int
    content: str
    author: AuthorDetails
    time: datetime
    updated_at: Optional[datetime]
    replies: List[int]
    upvotes: int
    answered: bool
    endorsed: bool
    reported: bool

    class Config:
        orm_mode = True


class Thread(BaseModel):
    id: int
    section_id: int
    title: str
    content: str
    author: AuthorDetails
    time: datetime
    updated_at: Optional[datetime]
    posts: List[int]
    upvotes: int
    stickied: bool
    reported: bool  # Currently not implemented, but just in case

    class Config:
        orm_mode = True


class ThreadCreate(BaseModel):
    section_id: int
    title: str
    content: str


class PostCreate(BaseModel):
    thread_id: int
    parent_id: Optional[int]
    content: str


class ThreadPage(BaseModel):
    offset: int
    limit: int
    total_count: int
    threads: List[Thread]


# === CONTENT ===
class Topic(BaseModel):
    title: str
    image_url: Union[str, None]


class ResourceCreate(BaseModel):
    resource_type: str
    title: str
    server_path: str
    url: str
    duration: int
    section: str
    description: str
    topic_id: int
    creator_id: int


class ResourceEdit(BaseModel):
    id: int
    title: str
    server_path: str
    url: str
    duration: int
    section: str
    description: str

class RearrangeResource(BaseModel):
    topic_id: int
    section: str
    resource_id: int
    direction: bool
    order_index: int

class ResourceDelete(BaseModel):
    id: int


class ResourceUpload(BaseModel):
    topic_id: str
    section: str
    title: str
    file_data: Any


class ResourceReplace(BaseModel):
    prev_path: str
    topic_id: str
    section: str
    title: str
    file_data: Any


class MarkdownUpload(BaseModel):
    topic_id: str
    section: str
    title: str
    content: str
    
class ResourceComplete(BaseModel):
    resource_id: int

class ResetProgress(BaseModel):
    topic_id: int
    section: str

# === TOPIC TREE ===


class PathwayTopicPrerequisite(BaseModel):
    id: int
    amount: int
    choices: List["PathwayTopicInfo"]


class PathwayTopicArchive(BaseModel):
    id: int
    archive: bool


class PathwayTopicDelete(BaseModel):
    id: int


class PathwayTopicGroupDelete(BaseModel):
    id: int


class PrerequisiteSet(BaseModel):
    amount: int
    choices: List[int]


class PathwayTopicPrerequisiteSetsCreate(BaseModel):
    topic: int
    sets: List["PrerequisiteSet"]


class PathwayTopicPrerequisiteSetDelete(BaseModel):
    id: int


class PathwayTopicPrerequisiteCreate(BaseModel):
    topic: int
    amount: int
    choices: List[int]


class PathwayTopicPrerequisiteEdit(BaseModel):
    prerequisite_id: int
    topic: int
    amount: int
    choices: List[int]


class PathwayTopicGroupInfo(BaseModel):
    id: Optional[int]
    name: Optional[str]


class PathwayTopicGroups(BaseModel):
    topic_groups: List[PathwayTopicGroupInfo]


class PathwayTopicInfo(BaseModel):
    id: int
    name: str
    status: Optional[str]
    topic_group: PathwayTopicGroupInfo
    needs: List[PathwayTopicPrerequisite]
    archived: bool


PathwayTopicPrerequisite.update_forward_refs()


class PathwayTopicCreate(BaseModel):
    name: str
    topic_group_id: Optional[int]
    image_url: Optional[str]
    archived: Optional[bool]
    description: str


class PathwayTopicEdit(BaseModel):
    id: int
    name: str
    topic_group_id: Optional[int]
    image_url: Optional[str]
    description: str
    sets: List[PrerequisiteSet]


class PathwayTopicGroupCreate(BaseModel):
    name: str
    topics: List[int]


class PathwayTopicGroupEdit(BaseModel):
    group_id: int
    name: str
    topics: List[int]


class Pathway(BaseModel):
    id: int
    name: str
    core: List[PathwayTopicInfo]
    electives: List[PathwayTopicInfo]

    class Config:
        orm_mode = True


class PathwayCreate(BaseModel):
    name: str
    core: List[int]
    electives: List[int]


class PathwayEdit(BaseModel):
    pathway_id: int
    core: List[int]
    electives: List[int]


class PathwayInfo(BaseModel):
    id: int
    name: str


class PathwayInfoList(BaseModel):
    pathways: List[PathwayInfo]


class PathwayIDList(BaseModel):
    pathways: List[int]


class PathwayEnrol(BaseModel):
    user_id: int
    pathway_id: int


class TopicEnrol(BaseModel):
    user_id: int
    topic_id: int

# ===assessment


class CheckAssessmentPermission(BaseModel):
    token: str
    topic_id: str


class UserToken(BaseModel):
    token: str


class AssessmentDetail(BaseModel):
    topic_id: int


class AssessmentId(BaseModel):
    assessment_id: int


class AssessmentSubmitQuery(BaseModel):
    assessment_id: int
    assessment_attempt_id: int


class AssessmentAttemptListQuery(BaseModel):
    assessment_id: int
    enroll_id: int


class UpdateAssessmentAttribute(BaseModel):
    assessment_id: int
    proportion: str
    status: str
    timeRange: str


class AssessmentAttemptId(BaseModel):
    assessment_attempt_id: int


class AssessmentAttemptUpdate(BaseModel):
    token: str
    assessment_attempt_id: int
    feedback: str
    mark: str


class AssessmentAdd(BaseModel):
    topic_id: str
    type: str
    assessmentName: str
    proportion: str
    status: str
    timeRange: str


class QuestionAdd(BaseModel):
    assessment_id: str
    type: str
    question_description: str
    choices: str
    answer: str


class QuestionUpdate(BaseModel):
    question_id: str
    type: str
    question_description: str
    choices: str
    answer: str


class QuestionDelete(BaseModel):
    question_id: str


class FileCollectionId(BaseModel):
    filecollection_id: int


class AttemptDetail(BaseModel):
    token: str
    enroll_id: str
    assessment_id: str
    problem: list


class AssignmentUpload(BaseModel):
    token: str
    enroll_id: str
    assessment_id: str


class AssignmentEdit(BaseModel):
    assessment_id: str
    description: str
    filename: str


class Assessment(BaseModel):
    id: int
    topic_id: int
    #topic = relationship("Topic", back_populates="assessments")
    #attempts = relationship("AssessmentAttempt", back_populates="assessment")
    type: str
    assessmentName: str
    proportion: float
    description: str
    status: str
    timeRange: str


class testTopicEnrollment(BaseModel):
    enroll_id: int

class userOtp(BaseModel):
    username: str
    inputOtp: str

class recoverPass(BaseModel):
    username: str
    inputOtp: str
    newPassword: str

class GenerativeAI_SendMessage(BaseModel):
    message: str
