-- \i 'C:/Users/Dave/Desktop/COMP4962 - Thesis B/metalms/backend/db/schema.sql';

-- Reset Schema
DROP SCHEMA public cascade;
CREATE SCHEMA public;

-- USERS
DROP TABLE IF EXISTS "users" CASCADE;
CREATE TABLE IF NOT EXISTS "users" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  zId TEXT NOT NULL
);

DROP TABLE IF EXISTS "topic_group" CASCADE;
CREATE TABLE IF NOT EXISTS "topic_group" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  topic_code TEXT NOT NULL,
  course_outline TEXT
);

DROP TABLE IF EXISTS "user_admin" CASCADE;
CREATE TABLE IF NOT EXISTS "user_admin" (
  admin_id INTEGER NOT NULL REFERENCES users(id),
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id),
  PRIMARY KEY (admin_id, topic_group_id)
);

DROP TABLE IF EXISTS "user_enrolled" CASCADE;
CREATE TABLE IF NOT EXISTS "user_enrolled" (
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  user_progress REAL NOT NULL, 
  PRIMARY KEY(user_id, topic_group_id)
);

-- TOPIC GROUPSS
DROP TABLE IF EXISTS "topics" CASCADE;
CREATE TABLE IF NOT EXISTS "topics" (
  id SERIAL NOT NULL PRIMARY KEY,
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id),
  name TEXT NOT NULL
);

DROP TABLE IF EXISTS "prerequisites" CASCADE;
CREATE TABLE IF NOT EXISTS "prerequisites" (
  prereq INTEGER NOT NULL REFERENCES topics(id) ON UPDATE CASCADE ON DELETE CASCADE,
  topic INTEGER NOT NULL REFERENCES topics(id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY (prereq, topic)
);

DROP TABLE IF EXISTS "topic_files" CASCADE;
CREATE TABLE IF NOT EXISTS "topic_files" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  file_id TEXT NOT NULL,
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  due_date TIMESTAMP
);

CREATE INDEX prereq_idx ON prerequisites(prereq);
CREATE INDEX topic_idx ON prerequisites(topic);

-- FORUMS
DROP TABLE IF EXISTS "forum_posts" CASCADE;
CREATE TABLE IF NOT EXISTS "forum_posts" (
  post_id INTEGER NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  author TEXT NOT NULL,
  published_date TIMESTAMP,
  description TEXT,
  isPinned BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS "tags" CASCADE;
CREATE TABLE IF NOT EXISTS "tags" (
  tag_id INTEGER NOT NULL PRIMARY KEY,
  name TEXT NOT NULL
);

DROP TABLE IF EXISTS "replies" CASCADE;
CREATE TABLE IF NOT EXISTS "replies" (
  reply_id INTEGER NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  author TEXT NOT NULL,
  published_date TIMESTAMP,
  reply TEXT
);

DROP TABLE IF EXISTS "post_comments" CASCADE;
CREATE TABLE IF NOT EXISTS "post_comments" (
  comment_id INTEGER NOT NULL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  author TEXT NOT NULL,
  published_date TIMESTAMP,
  comment TEXT
);

DROP TABLE IF EXISTS "post_author" CASCADE;
CREATE TABLE IF NOT EXISTS "post_author"(
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  author TEXT NOT NULL,
  PRIMARY KEY(post_id, user_id)
);

DROP TABLE IF EXISTS "comments_author" CASCADE;
CREATE TABLE IF NOT EXISTS "comments_author"(
  comment_id INT NOT NULL,
  user_id INT NOT NULL,
  author TEXT NOT NULL,
  PRIMARY KEY(comment_id, user_id)
);

DROP TABLE IF EXISTS "replies_author" CASCADE;
CREATE TABLE IF NOT EXISTS "replies_author"(
  reply_id INT NOT NULL,
  user_id INT NOT NULL,
  author TEXT NOT NULL,
  PRIMARY KEY(reply_id, user_id)
);

DROP TABLE IF EXISTS "post_replies" CASCADE;
CREATE TABLE IF NOT EXISTS "post_replies"(
  post_id INT NOT NULL,
  reply_id INT NOT NULL,
  PRIMARY KEY(post_id, reply_id)
);

DROP TABLE IF EXISTS "post_comments" CASCADE;
CREATE TABLE IF NOT EXISTS "post_comments"(
  post_id INT NOT NULL,
  comment_id INT NOT NULL,
  PRIMARY KEY(post_id, comment_id)
);

DROP TABLE IF EXISTS "post_tags" CASCADE;
CREATE TABLE IF NOT EXISTS "post_tags"(
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY(post_id, tag_id)
);

-- Course Pages
DROP TABLE IF EXISTS "user_content_progress" CASCADE;
CREATE TABLE "user_content_progress" (
  user_id INTEGER NOT NULL REFERENCES users(id),
  topic_file_id INTEGER NOT NULL REFERENCES topic_files(id),
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  course_progression INTEGER NOT NULL 
);

DROP TABLE IF EXISTS "announcements" CASCADE;
CREATE TABLE IF NOT EXISTS "announcements" (
  id INTEGER PRIMARY KEY,
  author INTEGER NOT NULL REFERENCES users(id),
  topic_group INTEGER NOT NULL REFERENCES topic_group(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  attachments TEXT,
  post_date TIMESTAMP
);

DROP TABLE IF EXISTS "announcement_comment" CASCADE;
CREATE TABLE "announcement_comment" (
  id INTEGER PRIMARY KEY,
  announcement_id INTEGER NOT NULL REFERENCES announcements(id),
  author INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  attachments TEXT
);

-- Gamification
DROP TABLE IF EXISTS "levels" CASCADE;
CREATE TABLE "levels" (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id),
  typeOfLevel TEXT NOT NULL,
  availableFrom TIMESTAMP,
  numberOfQuestions INTEGER NOT NULL,
  estimatedTimeRequired INTEGER NOT NULL
);

DROP TABLE IF EXISTS "gamification_question" CASCADE;
CREATE TABLE "gamification_question" (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  questionType TEXT NOT NULL,
  potentialAnswers TEXT NOT NULL,
  correctAnswer TEXT NOT NULL,
  availableFrom TIMESTAMP,
  numberOfAnswers INTEGER NOT NULL,
  mediaLink TEXT,
  estimatedTimeRequired INTEGER NOT NULL
);

DROP TABLE IF EXISTS "levels_questions" CASCADE;
CREATE TABLE "levels_questions" (
  Level_ID INTEGER REFERENCES Levels(id),
  Question_ID INTEGER REFERENCES gamification_question(id),
  PRIMARY KEY(Level_ID, Question_ID)
);

DROP TABLE IF EXISTS "topic_group_levels" CASCADE;
CREATE TABLE "topic_group_levels" (
  Topic_Group_ID INTEGER NOT NULL REFERENCES topic_group(id),
  LevelsId INTEGER NOT NULL REFERENCES levels(id),
  PRIMARY KEY (topic_group_id, LevelsId)
);

-- Assessment 
DROP TABLE IF EXISTS "quiz" CASCADE;
CREATE TABLE "quiz" (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  due_date TIMESTAMP,
  time_given INTEGER
);

DROP TABLE IF EXISTS "quiz_question" CASCADE;
CREATE TABLE "quiz_question" (
  id INTEGER PRIMARY KEY,
  quiz_id INTEGER REFERENCES quiz(id),
  quiz_type TEXT NOT NULL,
  marks_awarded REAL,
  related_topic_id INTEGER NOT NULL REFERENCES topics(id)
);

DROP TABLE IF EXISTS "quiz_question_answer" CASCADE;
CREATE TABLE "quiz_question_answer" (
  id INTEGER NOT NULL PRIMARY KEY,
  quiz_id INTEGER NOT NULL REFERENCES quiz(id),
  question_id INTEGER NOT NULL REFERENCES quiz_question(id),
  is_correct_answer BOOLEAN NOT NULL,
  description TEXT
);

DROP TABLE IF EXISTS "quiz_student_answer" CASCADE;
CREATE TABLE "quiz_student_answer" (
  student_id INTEGER NOT NULL REFERENCES users(id),
  quiz_id INTEGER NOT NULL REFERENCES quiz(id),
  question_id INTEGER NOT NULL REFERENCES quiz_question(id),
  answer_selected_id INTEGER NOT NULL REFERENCES quiz_question_answer(id)
);

DROP TABLE IF EXISTS "quiz_question_bank" CASCADE;
CREATE TABLE "quiz_question_bank" (
  id INTEGER NOT NULL PRIMARY KEY,
  name TEXT NOT NULL
);

DROP TABLE IF EXISTS "quiz_poll" CASCADE;
CREATE TABLE "quiz_poll" (
  id INTEGER NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  start_time TIMESTAMP, 
  close_time TIMESTAMP,
  is_closed BOOLEAN NOT NULL,
  poll_type TEXT NOT NULL
);

-- Lectures and Tutorials
DROP TABLE IF EXISTS "tutorials" CASCADE;
CREATE TABLE "tutorials" (
  id SERIAL NOT NULL PRIMARY KEY,
  tutor_id INTEGER NOT NULL REFERENCES users(id),
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id),
  tutorial_code TEXT NOT NULL,
  timeslot TEXT,
  curr_capacity INTEGER NOT NULL,
  max_capacity INTEGER NOT NULL
);

DROP TABLE IF EXISTS "enrolled_tutorials" CASCADE;
CREATE TABLE "enrolled_tutorials" (
  tutorial_id INTEGER NOT NULL REFERENCES tutorials(id),
  student_id INTEGER NOT NULL REFERENCES users(id),
  PRIMARY KEY (tutorial_id, student_id)
);