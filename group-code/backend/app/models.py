from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table, Text, Numeric, Float, DateTime, LargeBinary
from sqlalchemy.orm import relationship, backref, validates
from sqlalchemy.sql import func
from .database import Base

role_assosciation = Table(
    "role_assosciation",
    Base.metadata,
    Column("enrollment_id", ForeignKey("topic_enrollments.id")),
    Column("role_id", ForeignKey("roles.id"))
)

prerequisite_assosciation = Table(
    "prerequisite_assosciation",
    Base.metadata,
    Column("prerequisite_id", ForeignKey("prerequisites.id")),
    Column("topic_id", ForeignKey("topics.id"))
)

pathway_core_assosciation = Table(
    "pathway_core_assosciation",
    Base.metadata,
    Column("pathway_id", ForeignKey("pathways.id")),
    Column("topic_id", ForeignKey("topics.id"))
)

pathway_elective_assosciation = Table(
    "pathway_elective_assosciation",
    Base.metadata,
    Column("pathway_id", ForeignKey("pathways.id")),
    Column("topic_id", ForeignKey("topics.id"))
)

thread_votable_assosciation = Table(
    "thread_votable_assosciation",
    Base.metadata,
    Column("enrollment_id", ForeignKey(
        "topic_enrollments.id"), primary_key=True),
    Column("thread_id", ForeignKey("threads.id"), primary_key=True)
)

post_votable_assosciation = Table(
    "post_votable_assosciation",
    Base.metadata,
    Column("enrollment_id", ForeignKey(
        "topic_enrollments.id"), primary_key=True),
    Column("post_id", ForeignKey("posts.id"), primary_key=True)
)

pathway_assosciation = Table(
    "pathway_assosciation",
    Base.metadata,
    Column("pathway_id", ForeignKey("pathways.id"), primary_key=True),
    Column("user_id", ForeignKey("users.id"), primary_key=True)
)

# === Common === #


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    enrollments = relationship("TopicEnrollment", back_populates="user")
    username = Column(Text, unique=True)
    full_name = Column(Text)
    email = Column(Text, unique=True)
    password = Column(Text)
    comfired = Column(Boolean, default=True)
    auth_token = Column(String(16), nullable=True)
    introduction = Column(Text, nullable=True)
    pathways = relationship(
        "Pathway", secondary=pathway_assosciation, back_populates="users")
    threads = relationship("Thread", back_populates="author")
    posts = relationship("Post", back_populates="author")
    superuser = Column(Boolean, default=False)
    vEmail = Column(Text)
    lastOtp = Column(Text)
    mfa = Column(Text)


# === Topic Tree === #
class Prerequisite(Base):
    __tablename__ = 'prerequisites'
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey('topics.id'))
    topic = relationship("Topic", back_populates="prerequisites")
    choices = relationship(
        "Topic", secondary=prerequisite_assosciation, backref="prerequisite_of")
    amount = Column(Integer, default=1)

    @validates(amount)
    def validate_amount(self, key, amount):
        if amount > len(self.choices):
            raise ValueError(
                "Amount cannot be greater than number of prerequisite choices")
        return amount


class Topic(Base):
    __tablename__ = 'topics'
    id = Column(Integer, primary_key=True, index=True)
    topic_name = Column(String(32))
    image_url = Column(Text)
    description = Column(Text)
    archived = Column(Boolean)
    user_enrollments = relationship("TopicEnrollment", back_populates="topic")
    assessments = relationship("Assessment", back_populates="topic")
    roles = relationship("Role", back_populates="topic")
    forum = relationship("Forum", back_populates="topic", uselist=False)
    topic_group_id = Column(Integer, ForeignKey('topic_groups.id'))
    topic_group = relationship("TopicGroup", back_populates="topics")
    prerequisites = relationship("Prerequisite", back_populates="topic")

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)
        self.forum = Forum(topic=self)

        # Create default roles
        creator = Role(role_name="Creator", topic=self)
        for attr in dir(creator):
            if attr.startswith('can_'):
                setattr(creator, attr, True)
        self.roles.append(creator)
        student = Role(role_name="Student", topic=self)
        self.roles.append(student)


class TopicGroup(Base):
    __tablename__ = 'topic_groups'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text)
    topics = relationship("Topic", back_populates="topic_group")


class Pathway(Base):
    __tablename__ = 'pathways'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text)
    core = relationship("Topic", secondary=pathway_core_assosciation)
    electives = relationship("Topic", secondary=pathway_elective_assosciation)
    users = relationship(
        "User", secondary=pathway_assosciation, back_populates="pathways")


class TopicEnrollment(Base):
    __tablename__ = "topic_enrollments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic_id = Column(Integer, ForeignKey("topics.id"))
    user = relationship("User", back_populates="enrollments")
    topic = relationship("Topic", back_populates="user_enrollments")
    roles = relationship("Role", secondary=role_assosciation)
    complete = Column(Boolean, default=False)
    year = Column(Integer)
    term = Column(String(32))
    # Any extra data a student would have in regards to a topic, such as enrol date, marks, progress, etc.
    assessment_attempts = relationship(
        "AssessmentAttempt", back_populates="topic_enrollment")
    upvoted_threads = relationship(
        "Thread", secondary=thread_votable_assosciation, back_populates="upvoted_by")
    upvoted_posts = relationship(
        "Post", secondary=post_votable_assosciation, back_populates="upvoted_by")

class CompleteResource(Base):
    __tablename__ = "complete_resources"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resource_id = Column(Integer, ForeignKey("resources.id"))

# === Assessments ===

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    topic = relationship("Topic", back_populates="assessments")
    attempts = relationship("AssessmentAttempt", back_populates="assessment")
    type = Column(String(32))
    assessmentName = Column(String(32))
    proportion = Column(Float)
    description = Column(Text)
    status = Column(String(32))
    timeRange = Column(Text)
    questions = relationship("Question", back_populates="assessments")
    instruction = relationship("FileCollection", back_populates="assessments")
    #year = Column(Integer)
    # Term = Column(String(32)) ### -- this probably shouldn't exist, we're moving away from the idea of courses and terms


class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(ForeignKey("assessments.id"), primary_key=True)
    topic_enrollment_id = Column(ForeignKey(
        "topic_enrollments.id"), primary_key=True)
    assessment = relationship("Assessment", back_populates="attempts")
    topic_enrollment = relationship(
        "TopicEnrollment", back_populates="assessment_attempts")
    mark = Column(Float)
    feedback = Column(Text)
    questions = relationship("Question", back_populates="assessment_attempts")
    submit = relationship(
        "FileCollection", back_populates="assessment_attempts")


class Question(Base):
    __tablename__ = "question"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(32))
    choices = Column(Text)
    question_description = Column(Text)
    answer_attempt = Column(Text)
    answer = Column(Text)
    assessment_attempt_id = Column(ForeignKey(
        "assessment_attempts.id"))  # , primary_key=True)
    assessment_attempts = relationship(
        "AssessmentAttempt", back_populates="questions")
    assessment_id = Column(ForeignKey("assessments.id"))  # , primary_key=True)
    assessments = relationship(
        "Assessment", back_populates="questions")


class FileCollection(Base):
    __tablename__ = "file_collection"
    id = Column(Integer, primary_key=True)
    description = Column(Text)
    filename = Column(String(50))
    data = Column(LargeBinary)
    assessment_attempt_id = Column(ForeignKey(
        "assessment_attempts.id"))
    assessment_attempts = relationship(
        "AssessmentAttempt", back_populates="submit")
    assessment_id = Column(ForeignKey("assessments.id"))
    assessments = relationship(
        "Assessment", back_populates="instruction")


# === User accounts ===
# Permissions
# A topic can have multiple roles, which are made up of various permission flags, dictating what actions a user are able to perform


class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    topic = relationship("Topic", back_populates="roles")
    role_name = Column(String)
    # Flags (should most likely all be default=False, everything else can be customised by the topic staff)
    # Accounts
    can_view_topic_roles = Column(Boolean, default=False)
    can_edit_topic_roles = Column(Boolean, default=False)

    # Forum
    can_endorse_forum_posts = Column(Boolean, default=False)
    can_sticky_forum_posts = Column(Boolean, default=False)
    can_delete_any_forum_posts = Column(Boolean, default=False)
    can_appear_as_forum_staff = Column(Boolean, default=False)
    can_view_forum_flagged_posts = Column(Boolean, default=False)
    # Content
    can_manage_resources = Column(Boolean, default=False)
    # Assessment
    can_edit_assessment = Column(Boolean, default=False)


# Forums

class Forum(Base):
    __tablename__ = "forums"
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    topic = relationship("Topic", back_populates="forum")
    sections = relationship("Section", back_populates="forum")

    def __init__(self, *args, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)
        self.sections = [Section(forum=self, title="Announcements"), Section(
            forum=self, title="General")]


class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True, index=True)
    forum_id = Column(Integer, ForeignKey("forums.id"))
    forum = relationship("Forum", back_populates="sections")
    title = Column(String)
    threads = relationship("Thread", back_populates="section")
    resource = relationship(
        "Resource", back_populates="forum_section", uselist=False)


class Thread(Base):
    __tablename__ = "threads"
    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id"))
    section = relationship("Section", back_populates="threads")
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="threads")
    posts = relationship("Post", back_populates="thread")
    title = Column(Text)
    content = Column(Text)
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())
    num_upvotes = Column(Integer, default=0)
    upvoted_by = relationship(
        "TopicEnrollment", secondary=thread_votable_assosciation, back_populates="upvoted_threads")
    stickied = Column(Boolean, default=False)
    reported = Column(Boolean, default=False)

    def upvote(self, user_topic_enrollment):
        if user_topic_enrollment not in self.upvoted_by:
            self.upvoted_by.append(user_topic_enrollment)
            self.num_upvotes += 1
            return True
        return False

    def remove_upvote(self, user_topic_enrollment):
        if user_topic_enrollment in self.upvoted_by:
            self.upvoted_by.remove(user_topic_enrollment)
            self.num_upvotes -= 1
            return True
        return False


class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    thread_id = Column(Integer, ForeignKey("threads.id"))
    thread = relationship("Thread", back_populates="posts")
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")
    parent_id = Column(Integer, ForeignKey("posts.id"))
    replies = relationship("Post", backref=backref('parent', remote_side=[id]))
    content = Column(Text)
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())
    num_upvotes = Column(Integer, default=0)
    upvoted_by = relationship(
        "TopicEnrollment", secondary=post_votable_assosciation, back_populates="upvoted_posts")
    marked_as_answer = Column(Boolean, default=False)
    marked_as_endorsed = Column(Boolean, default=False)
    reported = Column(Boolean, default=False)

    def upvote(self, user_topic_enrollment):
        if user_topic_enrollment not in self.upvoted_by:
            self.upvoted_by.append(user_topic_enrollment)
            self.num_upvotes += 1
            return True
        return False

    def remove_upvote(self, user_topic_enrollment):
        if user_topic_enrollment in self.upvoted_by:
            self.upvoted_by.remove(user_topic_enrollment)
            self.num_upvotes -= 1
            return True
        return False

# === CONTENT ===


# Resource must either have a URL or a path to be accessed
# Videos should have both so students can benefit from streaming platform features (such as adaptive bitrate streaming) while still having access to an offline version of videos via donwload
class Resource(Base):
    __tablename__ = "resources"
    id = Column(Integer, primary_key=True, index=True)
    resource_type = Column(Text, nullable=False)
    title = Column(Text, nullable=False)
    url = Column(Text)  # URL for externally hosted resource
    # Path to where the resource is stored on server
    server_path = Column(Text)
    duration = Column(Integer, nullable=False)
    section = Column(Text, nullable=False)
    description = Column(Text)
    order_index = Column(Integer)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    section_id = Column(Integer, ForeignKey("sections.id"))
    forum_section = relationship("Section", back_populates="resource")


# === USER ===

class Conversation(Base):
    __tablename__ = "conversation"
    id = Column(Integer, primary_key=True, index=True)
    conversation_name = Column(Text)
    # user1Name = Column(Text)
    # user2Name = Column(Text)


class Message(Base):
    __tablename__ = "message"
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversation.id"))
    sender_name = Column(Text)
    time_created = Column(DateTime(timezone=True))
    content = Column(Text)


class Group_member(Base):
    __tablename__ = "group_member"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    conversation_id = Column(Integer, ForeignKey("conversation.id"))
    lastSeen = Column(DateTime)

class Log(Base):
    __tablename__ = "log"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    time_created = Column(DateTime(timezone=True))
    details = Column(Text) 

class Privacy(Base):
    __tablename__ = "privacy"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    full_name = Column(Boolean, default=False)
    email = Column(Boolean, default=False)
    recent_activity = Column(Boolean, default=False)
    invisible = Column(Boolean, default=False)

class topicExportLog(Base):
    __tablename__ = "topicExportLog"
    id = Column(Integer, primary_key=True, index=True)
    auth_token = Column(String(16), nullable=True)
    checksum = Column(Text)
    topic_name = Column(String(32))

class PomodoroSession(Base):
    __tablename__ = "pomodoro_sessions"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, index=True)
    email = Column(String, index=True)
    time = Column(DateTime, server_default=func.now())
    focusTimeMinutes = Column(Integer)