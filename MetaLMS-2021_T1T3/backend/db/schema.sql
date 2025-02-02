-- \i 'C:/Users/Dave/Desktop/COMP4973 - Thesis C/metalms/backend/db/schema.sql';

-- Reset Schema
DROP SCHEMA public cascade;
CREATE SCHEMA public;

-- USERS
DROP TABLE IF EXISTS "users" CASCADE;
CREATE TABLE IF NOT EXISTS "users" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  zId TEXT NOT NULL,
  staff BOOLEAN NOT NULL
);

-- Changed searchable type cause errors
DROP TABLE IF EXISTS "topic_group" CASCADE;
CREATE TABLE IF NOT EXISTS "topic_group" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  topic_code TEXT NOT NULL UNIQUE,
  course_outline TEXT,
  searchable BOOLEAN
);

DROP TABLE IF EXISTS "user_admin" CASCADE;
CREATE TABLE IF NOT EXISTS "user_admin" (
  admin_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id) ON DELETE CASCADE,
  PRIMARY KEY (admin_id, topic_group_id)
);

DROP TABLE IF EXISTS "user_enrolled" CASCADE;
CREATE TABLE IF NOT EXISTS "user_enrolled" (
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id) ON UPDATE CASCADE ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  progress DECIMAL NOT NULL,
  PRIMARY KEY(user_id, topic_group_id)
);

DROP TABLE IF EXISTS "calendar_reminders" CASCADE;
CREATE TABLE IF NOT EXISTS "calendar_reminders" (
  id SERIAL NOT NULL PRIMARY KEY,
  remind_date TIMESTAMP,
  description TEXT
);

DROP TABLE IF EXISTS "user_calendar_reminders" CASCADE;
CREATE TABLE IF NOT EXISTS "user_calendar_reminders" (
  reminder_id INTEGER NOT NULL REFERENCES calendar_reminders(id) ON UPDATE CASCADE ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY (reminder_id, user_id)
);

-- TOPIC GROUPS
DROP TABLE IF EXISTS "topics" CASCADE;
CREATE TABLE IF NOT EXISTS "topics" (
  id SERIAL NOT NULL PRIMARY KEY,
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id) ON UPDATE CASCADE ON DELETE CASCADE,
  name TEXT NOT NULL
);

DROP TABLE IF EXISTS "prerequisites" CASCADE;
CREATE TABLE IF NOT EXISTS "prerequisites" (
  prereq INTEGER NOT NULL REFERENCES topics(id) ON UPDATE CASCADE ON DELETE CASCADE,
  topic INTEGER NOT NULL REFERENCES topics(id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY (prereq, topic)
);

DROP TABLE IF EXISTS "topic_group_files" CASCADE;
CREATE TABLE IF NOT EXISTS "topic_group_files" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  file TEXT NOT NULL,
  type TEXT NOT NULL,
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "topic_files" CASCADE;
CREATE TABLE IF NOT EXISTS "topic_files" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  file TEXT NOT NULL,
  type TEXT NOT NULL,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE ON UPDATE CASCADE,
  due_date TIMESTAMP
);

DROP TABLE IF EXISTS "enroll_codes" CASCADE;
CREATE TABLE IF NOT EXISTS "enroll_codes" (
  id SERIAL NOT NULL PRIMARY KEY,
  code TEXT NOT NULL,
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id),
  uses INTEGER,
  expiration INTEGER
);

CREATE INDEX prereq_idx ON prerequisites(prereq);
CREATE INDEX topic_idx ON prerequisites(topic);

-- FORUMS
DROP TABLE IF EXISTS "forum_posts" CASCADE;
CREATE TABLE IF NOT EXISTS "forum_posts" (
  post_id SERIAL NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  author TEXT NOT NULL,
  published_date TIMESTAMP,
  description TEXT,
  isPinned BOOLEAN NOT NULL,
  related_link TEXT,
  num_of_upvotes INTEGER NOT NULL,
  isEndorsed BOOLEAN NOT NULL,
  topic_group INTEGER NOT NULL REFERENCES topic_group(id) ON UPDATE CASCADE ON DELETE CASCADE,
  fromAnnouncement BOOLEAN NOT NULL
);

-- Can combine tags/topic_tags
DROP TABLE IF EXISTS "tags" CASCADE;
CREATE TABLE IF NOT EXISTS "tags" (
  tag_id SERIAL NOT NULL PRIMARY KEY,
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id),
  name TEXT NOT NULL
);

DROP TABLE IF EXISTS "topic_tags" CASCADE;
CREATE TABLE IF NOT EXISTS "topic_tags"(
  topic_id INT NOT NULL REFERENCES topics(id) ON UPDATE CASCADE ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES tags(tag_id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY(topic_id, tag_id)
);

DROP TABLE IF EXISTS "reserved_tags" CASCADE;
CREATE TABLE IF NOT EXISTS "reserved_tags" (
  tag_id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL
);

DROP TABLE IF EXISTS "replies" CASCADE;
CREATE TABLE IF NOT EXISTS "replies" (
  reply_id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  author TEXT NOT NULL,
  published_date TIMESTAMP,
  reply TEXT
);

DROP TABLE IF EXISTS "comments" CASCADE;
CREATE TABLE IF NOT EXISTS "comments" (
  comment_id SERIAL NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  author TEXT NOT NULL,
  published_date TIMESTAMP,
  comment TEXT,
  isEndorsed BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS "forum_post_files" CASCADE;
CREATE TABLE "forum_post_files" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL, 
  file TEXT NOT NULL,
  post_id INTEGER NOT NULL REFERENCES forum_posts(post_id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS "forum_reply_files" CASCADE;
CREATE TABLE "forum_reply_files" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL, 
  file TEXT NOT NULL,
  reply_id INTEGER NOT NULL REFERENCES replies(reply_id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS "forum_comment_files" CASCADE;
CREATE TABLE "forum_comment_files" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL, 
  file TEXT NOT NULL,
  comment_id INTEGER NOT NULL REFERENCES comments(comment_id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS "upvotes" CASCADE;
CREATE TABLE IF NOT EXISTS "upvotes" (
  post_id INTEGER NOT NULL REFERENCES forum_posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (post_id, user_id)
);

DROP TABLE IF EXISTS "post_author" CASCADE;
CREATE TABLE IF NOT EXISTS "post_author"(
  post_id INT NOT NULL REFERENCES forum_posts(post_id) ON UPDATE CASCADE ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  author TEXT NOT NULL,
  PRIMARY KEY(post_id, user_id)
);

DROP TABLE IF EXISTS "comments_author" CASCADE;
CREATE TABLE IF NOT EXISTS "comments_author"(
  comment_id INT NOT NULL REFERENCES comments(comment_id) ON DELETE CASCADE ON UPDATE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  author TEXT NOT NULL,
  PRIMARY KEY(comment_id, user_id)
);

DROP TABLE IF EXISTS "replies_author" CASCADE;
CREATE TABLE IF NOT EXISTS "replies_author"(
  reply_id INT NOT NULL REFERENCES replies(reply_id) ON DELETE CASCADE ON UPDATE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  author TEXT NOT NULL,
  PRIMARY KEY(reply_id, user_id)
);

DROP TABLE IF EXISTS "post_replies" CASCADE;
CREATE TABLE IF NOT EXISTS "post_replies"(
  post_id INT NOT NULL REFERENCES forum_posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  reply_id INT NOT NULL REFERENCES replies(reply_id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY(post_id, reply_id)
);

DROP TABLE IF EXISTS "post_comments" CASCADE;
CREATE TABLE IF NOT EXISTS "post_comments"(
  post_id INT NOT NULL REFERENCES forum_posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE,
  comment_id INT NOT NULL REFERENCES comments(comment_id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY(post_id, comment_id)
);

DROP TABLE IF EXISTS "post_tags" CASCADE;
CREATE TABLE IF NOT EXISTS "post_tags"(
  post_id INT NOT NULL REFERENCES forum_posts(post_id) ON UPDATE CASCADE ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES tags(tag_id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY(post_id, tag_id)
);

-- Course Pages
DROP TABLE IF EXISTS "user_content_progress" CASCADE;
CREATE TABLE "user_content_progress" (
  user_id INTEGER NOT NULL REFERENCES users(id),
  topic_file_id INTEGER NOT NULL REFERENCES topic_files(id),
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  completed BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS "announcements" CASCADE;
CREATE TABLE IF NOT EXISTS "announcements" (
  id SERIAL PRIMARY KEY,
  author INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  topic_group INTEGER NOT NULL REFERENCES topic_group(id) ON UPDATE CASCADE ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_date TIMESTAMP
);

DROP TABLE IF EXISTS "announcement_comment" CASCADE;
CREATE TABLE "announcement_comment" (
  id SERIAL PRIMARY KEY,
  announcement_id INTEGER NOT NULL REFERENCES announcements(id) ON UPDATE CASCADE ON DELETE CASCADE,
  author INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  content TEXT NOT NULL,
  post_date TIMESTAMP
);

DROP TABLE IF EXISTS "announcement_files" CASCADE;
CREATE TABLE "announcement_files" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL, 
  file TEXT NOT NULL,
  announcement_id INTEGER NOT NULL REFERENCES announcements(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS "announcement_comment_files" CASCADE;
CREATE TABLE "announcement_comment_files" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  file TEXT NOT NULL,
  comment_id INTEGER NOT NULL REFERENCES announcement_comment(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Assessment 
CREATE TYPE question AS ENUM ('mc', 'sa', 'cb');

DROP TABLE IF EXISTS "quizzes" CASCADE;
CREATE TABLE "quizzes" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  topicGroupId INTEGER NOT NULL REFERENCES topic_group(id),
  openDate TIME,
  closeDate TIME,
  timeGiven INTEGER NOT NULL,
  numQuestions INTEGER NOT NULL
);

DROP TABLE IF EXISTS "question_bank" CASCADE;
CREATE TABLE "question_bank" (
  id SERIAL NOT NULL PRIMARY KEY
);

DROP TABLE IF EXISTS "questions" CASCADE;
CREATE TABLE "questions" (
  id SERIAL NOT NULL PRIMARY KEY,
  topicId INTEGER NOT NULL REFERENCES topics(id),
  questionBankId INTEGER NOT NULL REFERENCES question_bank(id),
  questionText TEXT NOT NULL,
  questionType question NOT NULL,
  marksAwarded INTEGER NOT NULL
);

DROP TABLE IF EXISTS "quiz_questions" CASCADE;
CREATE TABLE "quiz_questions" (
  quizId INTEGER NOT NULL REFERENCES quizzes(id) ON UPDATE CASCADE ON DELETE CASCADE,
  questionId INTEGER NOT NULL REFERENCES questions(id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY (quizId, questionId)
);

DROP TABLE IF EXISTS "question_possible_answers" CASCADE;
CREATE TABLE "question_possible_answers" (
  id SERIAL NOT NULL PRIMARY KEY,
  questionId INTEGER NOT NULL REFERENCES questions(id) ON UPDATE CASCADE ON DELETE CASCADE,
  answerText TEXT NOT NULL,
  isCorrect BOOLEAN NOT NULL,
  explanation TEXT NOT NULL
);

DROP TABLE IF EXISTS "student_attempts" CASCADE;
CREATE TABLE "student_attempts" (
  id SERIAL NOT NULL PRIMARY KEY,
  quizId INTEGER NOT NULL REFERENCES quizzes(id),
  studentId INTEGER NOT NULL REFERENCES users(id),
  startTime TIME,
  endTime TIME
);

DROP TABLE IF EXISTS "student_answers" CASCADE;
CREATE TABLE "student_answers" (
  id SERIAL NOT NULL PRIMARY KEY,
  quizId INTEGER NOT NULL REFERENCES quizzes(id),
  studentId INTEGER NOT NULL REFERENCES users(id),
  questionId INTEGER NOT NULL REFERENCES questions(id),
  answer TEXT
);

DROP TABLE IF EXISTS "attempt_answers" CASCADE;
CREATE TABLE "attempt_answers" (
  attemptId INTEGER NOT NULL REFERENCES student_attempts(id),
  answerId INTEGER NOT NULL REFERENCES student_answers(id),
  PRIMARY KEY (attemptId, answerId)
);

-- Lectures and Tutorials

CREATE TYPE classType AS ENUM ('lecture', 'tutorial');

-- not used
DROP TABLE IF EXISTS "weeks" CASCADE;
CREATE TABLE "weeks" (
  id SERIAL NOT NULL PRIMARY KEY,
  num INTEGER NOT NULL
);

DROP TABLE IF EXISTS "tutorials" CASCADE;
CREATE TABLE "tutorials" (
  id SERIAL NOT NULL PRIMARY KEY,
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id) ON DELETE CASCADE ON UPDATE CASCADE,
  week INTEGER,
  topic_reference INTEGER REFERENCES topics(id)
);

DROP TABLE IF EXISTS "lectures" CASCADE;
CREATE TABLE "lectures" (
  id SERIAL NOT NULL PRIMARY KEY,
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id) ON DELETE CASCADE ON UPDATE CASCADE,
  week INTEGER,
  topic_reference INTEGER REFERENCES topics(id)
);

DROP TABLE IF EXISTS "lecture_files" CASCADE;
CREATE TABLE "lecture_files" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  file TEXT NOT NULL,
  type TEXT,
  lecture_id INTEGER NOT NULL REFERENCES lectures(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "tutorial_files" CASCADE;
CREATE TABLE "tutorial_files" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  file TEXT NOT NULL,
  type TEXT,
  tutorial_id INTEGER NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "enrolled_lectures" CASCADE;
CREATE TABLE "enrolled_lectures" (
  lecture_id INTEGER NOT NULL REFERENCES lectures(id) ON DELETE CASCADE ON UPDATE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (lecture_id, student_id)
);

DROP TABLE IF EXISTS "enrolled_tutorials" CASCADE;
CREATE TABLE "enrolled_tutorials" (
  tutorial_id INTEGER NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE ON UPDATE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (tutorial_id, student_id)
);

DROP TABLE IF EXISTS "lecture_files_lectures" CASCADE;
CREATE TABLE "lecture_files_lectures" (
  fileId INTEGER NOT NULL REFERENCES lecture_files(id) ON DELETE CASCADE ON UPDATE CASCADE,
  lectureId INTEGER NOT NULL REFERENCES lectures(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (fileId, lectureId)
);

DROP TABLE IF EXISTS "tutorial_files_tutorials" CASCADE;
CREATE TABLE "tutorial_files_tutorials" (
  fileId INTEGER NOT NULL REFERENCES tutorial_files(id) ON DELETE CASCADE ON UPDATE CASCADE,
  tutorialId INTEGER NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (fileId, tutorialId)
);

-- Temp
DROP TABLE IF EXISTS "recording_panels" CASCADE;
CREATE TABLE "recording_panels" (
  id SERIAL NOT NULL PRIMARY KEY,
  topicGroupId INTEGER NOT NULL REFERENCES topic_group(id) ON DELETE CASCADE ON UPDATE CASCADE,
  class classType NOT NULL,
  link TEXT
);

-- Enrol types
DROP TABLE IF EXISTS "enrol_tutorials" CASCADE;
CREATE TABLE "enrol_tutorials" (
  id SERIAL NOT NULL PRIMARY KEY,
  tutorial_code TEXT NOT NULL,
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id) ON DELETE CASCADE ON UPDATE CASCADE,
  tutor_id INTEGER NOT NULL REFERENCES users(id),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  curr_capacity INTEGER NOT NULL,
  max_capacity INTEGER NOT NULL
);

DROP TABLE IF EXISTS "enrol_lectures" CASCADE;
CREATE TABLE "enrol_lectures" (
  id SERIAL NOT NULL PRIMARY KEY,
  lecture_code TEXT NOT NULL,
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id) ON DELETE CASCADE ON UPDATE CASCADE,
  lecturer_id INTEGER NOT NULL REFERENCES users(id),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  curr_capacity INTEGER NOT NULL,
  max_capacity INTEGER NOT NULL
);

-- Alter Users
ALTER TABLE users
ADD last_accessed_topic INTEGER REFERENCES topics(id);