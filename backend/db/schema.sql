-- \i 'C:/Users/Dave/Desktop/COMP4962 - Thesis B/metalms/backend/db/schema.sql';

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
  zId TEXT NOT NULL
);

DROP TABLE IF EXISTS "topic_group" CASCADE;
CREATE TABLE IF NOT EXISTS "topic_group" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  topic_code TEXT NOT NULL UNIQUE,
  course_outline TEXT
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
  PRIMARY KEY(user_id, topic_group_id)
);

-- TOPIC GROUPSS
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
  isEndorsed BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS "tags" CASCADE;
CREATE TABLE IF NOT EXISTS "tags" (
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

DROP TABLE IF EXISTS "topic_tags" CASCADE;
CREATE TABLE IF NOT EXISTS "topic_tags"(
  topic_id INT NOT NULL REFERENCES topics(id) ON UPDATE CASCADE ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES tags(tag_id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY(topic_id, tag_id)
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

/* -- Gamification
DROP TABLE IF EXISTS "levels" CASCADE;
CREATE TABLE "levels" (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id),
  typeOfLevel TEXT NOT NULL,
  availableFrom TIMESTAMP,
  numberOfQuestions INTEGER NOT NULL,
  estimatedTimeRequired INTEGER NOT NULL
);

DROP TABLE IF EXISTS "gamification_question" CASCADE;
CREATE TABLE "gamification_question" (
  id SERIAL PRIMARY KEY,
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
  Level_ID INTEGER REFERENCES Levels(id) ON DELETE CASCADE ON UPDATE CASCADE,
  Question_ID INTEGER REFERENCES gamification_question(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY(Level_ID, Question_ID)
);

DROP TABLE IF EXISTS "topic_group_levels" CASCADE;
CREATE TABLE "topic_group_levels" (
  Topic_Group_ID INTEGER NOT NULL REFERENCES topic_group(id) ON DELETE CASCADE ON UPDATE CASCADE,
  LevelsId INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (topic_group_id, LevelsId)
); */

-- Assessment 
DROP TABLE IF EXISTS "quiz" CASCADE;
CREATE TABLE "quiz" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  due_date TIMESTAMP,
  time_given INTEGER
);

DROP TABLE IF EXISTS "quiz_question" CASCADE;
CREATE TABLE "quiz_question" (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES quiz(id) ON UPDATE CASCADE ON DELETE CASCADE,
  quiz_type TEXT NOT NULL,
  marks_awarded REAL,
  description TEXT NOT NULL,
  related_topic_id INTEGER NOT NULL REFERENCES topics(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS "quiz_question_answer" CASCADE;
CREATE TABLE "quiz_question_answer" (
  id SERIAL NOT NULL PRIMARY KEY,
  quiz_id INTEGER NOT NULL REFERENCES quiz(id) ON UPDATE CASCADE ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES quiz_question(id) ON UPDATE CASCADE ON DELETE CASCADE,
  is_correct_answer BOOLEAN NOT NULL,
  description TEXT
);

DROP TABLE IF EXISTS "quiz_student_answer" CASCADE;
CREATE TABLE "quiz_student_answer" (
  student_id INTEGER NOT NULL REFERENCES users(id),
  quiz_id INTEGER NOT NULL REFERENCES quiz(id) ON UPDATE CASCADE ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES quiz_question(id) ON UPDATE CASCADE ON DELETE CASCADE,
  answer_selected_id INTEGER NOT NULL REFERENCES quiz_question_answer(id)
);

DROP TABLE IF EXISTS "quiz_question_bank" CASCADE;
CREATE TABLE "quiz_question_bank" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL
);

DROP TABLE IF EXISTS "question_bank_question" CASCADE;
CREATE TABLE "question_bank_question" (
  question_bank_id INTEGER NOT NULL REFERENCES quiz_question_bank(id) ON DELETE CASCADE ON UPDATE CASCADE,
  question_id INTEGER NOT NULL REFERENCES quiz_question(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (question_bank_id, question_id)
);

DROP TABLE IF EXISTS "quiz_poll" CASCADE;
CREATE TABLE "quiz_poll" (
  id SERIAL NOT NULL PRIMARY KEY,
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
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id) ON DELETE CASCADE ON UPDATE CASCADE,
  tutorial_code TEXT NOT NULL,
  timeslot TIMESTAMP NOT NULL,
  curr_capacity INTEGER NOT NULL,
  max_capacity INTEGER NOT NULL
);

DROP TABLE IF EXISTS "lectures" CASCADE;
CREATE TABLE "lectures" (
  id SERIAL NOT NULL PRIMARY KEY,
  lecturer_id INTEGER NOT NULL REFERENCES users(id),
  topic_group_id INTEGER NOT NULL REFERENCES topic_group(id) ON DELETE CASCADE ON UPDATE CASCADE,
  lecture_code TEXT NOT NULL,
  timeslot TIMESTAMP NOT NULL,
  curr_capacity INTEGER NOT NULL,
  max_capacity INTEGER NOT NULL
);

DROP TABLE IF EXISTS "lecture_files" CASCADE;
CREATE TABLE "lecture_files" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  file TEXT NOT NULL,
  lecture_id INTEGER NOT NULL REFERENCES lectures(id) ON DELETE CASCADE ON UPDATE CASCADE,
);

DROP TABLE IF EXISTS "tutorial_files" CASCADE;
CREATE TABLE "tutorial_files" (
  id SERIAL NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  file TEXT NOT NULL,
  tutorial_id INTEGER NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE ON UPDATE CASCADE,
);

DROP TABLE IF EXISTS "enrolled_lectures" CASCADE;
CREATE TABLE "enrolled_lectures" (
  lecture_id INTEGER NOT NULL REFERENCES lectures(id) ON DELETE CASCADE ON UPDATE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (tutorial_id, student_id)
);

DROP TABLE IF EXISTS "enrolled_tutorials" CASCADE;
CREATE TABLE "enrolled_tutorials" (
  tutorial_id INTEGER NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE ON UPDATE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY (tutorial_id, student_id)
);