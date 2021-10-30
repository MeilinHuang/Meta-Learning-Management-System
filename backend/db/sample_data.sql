-- \i 'C:/Users/Dave/Desktop/COMP4973 - Thesis C/metalms/backend/db/sample_data.sql';

-- Create Users
INSERT INTO users(id, name, email, password, zid, staff) values(default, 'David Nguyen', 'test1@test.com', 'passsword', 'z5166106', false);
INSERT INTO users(id, name, email, password, zid, staff) values(default, 'John Smith', 'test2@test.com', 'passsword', 'z5123821', true);
INSERT INTO users(id, name, email, password, zid, staff) values(default, 'Tutory Tutorer', 'test3@test.com', 'passsword', 'z5921738', true);
INSERT INTO users(id, name, email, password, zid, staff) values(default, 'Lecturey Lecturer', 'test4@test.com', 'passsword', 'z5928712', false);
INSERT INTO users(id, name, email, password, zid, staff) values(default, 'Daniel Ferraro', 'daniel@test.com', 'password', 'z5204902', true);

-- Create calendar reminders
INSERT INTO calendar_reminders(id, remind_date, description) VALUES(default, current_timestamp, 'Assignment 1 due date');
INSERT INTO calendar_reminders(id, remind_date, description) VALUES(default, current_timestamp, 'Assignment 2 due date');
INSERT INTO calendar_reminders(id, remind_date, description) VALUES(default, current_timestamp, 'Assignment 3 due date');

-- Create calendar links
INSERT INTO user_calendar_reminders(reminder_id, user_id) VALUES(1, 1);
INSERT INTO user_calendar_reminders(reminder_id, user_id) VALUES(2, 1);
INSERT INTO user_calendar_reminders(reminder_id, user_id) VALUES(3, 1);

-- Create Topic Groups
INSERT INTO topic_group(id, name, topic_code, searchable) values(default, 'C++ Programming', 'COMP6771', true);
INSERT INTO topic_group(id, name, topic_code, searchable) values(default, 'Database Systems', 'COMP3331', true);

-- Create Topic Groups invite codes
INSERT INTO enroll_codes(id, code, topic_group_id) VALUES(default, 'aABc7J06', 1);
INSERT INTO enroll_codes(id, code, topic_group_id, uses) VALUES(default, 'sJD873Na', 1, 5);

-- Create Topics
INSERT INTO topics(id, topic_group_id, name) values(default, 1, 'Loops');
INSERT INTO topics(id, topic_group_id, name) values(default, 1, 'Pointers');
INSERT INTO topics(id, topic_group_id, name) values(default, 1, 'Arrays');
INSERT INTO topics(id, topic_group_id, name) values(default, 1, 'Variables');
INSERT INTO topics(id, topic_group_id, name) values(default, 2, 'Schemas');
INSERT INTO topics(id, topic_group_id, name) values(default, 2, 'ER-Diagrams');

-- Add Topic Files
INSERT INTO topic_files(id, name, file, type, topic_id, due_date) values(default, 'while_loops.pdf', 'while_loops_path', 'content', 1, NULL);
INSERT INTO topic_files(id, name, file, type, topic_id, due_date) values(default, 'for_loops.pdf', 'for_loops_path', 'content', 1, NULL);
INSERT INTO topic_files(id, name, file, type, topic_id, due_date) values(default, 'pointers1.pdf', 'pointers1_path', 'content', 2, NULL);
INSERT INTO topic_files(id, name, file, type, topic_id, due_date) values(default, 'dynamic_arrays.pdf', 'dynamic_arrays_path', 'content', 3, NULL);
INSERT INTO topic_files(id, name, file, type, topic_id, due_date) values(default, 'ass1.pdf', 'dynamic_arrays_path', 'assessment', 3, NULL);

-- Add user content progress
INSERT INTO user_content_progress(user_id, topic_file_id, topic_id, completed) VALUES(1, 1, 1, false);
INSERT INTO user_content_progress(user_id, topic_file_id, topic_id, completed) VALUES(1, 2, 1, true);
INSERT INTO user_content_progress(user_id, topic_file_id, topic_id, completed) VALUES(1, 3, 2, true);
INSERT INTO user_content_progress(user_id, topic_file_id, topic_id, completed) VALUES(1, 4, 3, false);

-- Add prerequisites
INSERT INTO prerequisites(prereq, topic) values(3, 1);
INSERT INTO prerequisites(prereq, topic) values(2, 1);

-- Create Admins
INSERT INTO user_admin(admin_id, topic_group_id) values(3, 1);

-- Enroll Students
INSERT INTO user_enrolled(topic_group_id, user_id, progress) values(1, 1, 9.5);
INSERT INTO user_enrolled(topic_group_id, user_id, progress) values(1, 2, 28.0);
INSERT INTO user_enrolled(topic_group_id, user_id, progress) values(2, 1, 93.6);

-- Create Forum Posts
INSERT INTO forum_posts(post_id, title, user_id, author, published_date, description, isPinned, related_link, num_of_upvotes, isEndorsed, topic_group, fromAnnouncement) 
VALUES(default, 'Welcome to the first post', 1, 'David Nguyen', current_timestamp, 'Description text of first post', false, NULL, 2, true, 1, true);
INSERT INTO forum_posts(post_id, title, user_id, author, published_date, description, isPinned, related_link, num_of_upvotes, isEndorsed, topic_group, fromAnnouncement) 
VALUES(default, 'Course Update', 1, 'David Nguyen', current_timestamp, 'This is the second post', false, NULL, 0, false, 1, false);
INSERT INTO forum_posts(post_id, title, user_id, author, published_date, description, isPinned, related_link, num_of_upvotes, isEndorsed, topic_group, fromAnnouncement) 
VALUES(default, 'Assignment changes', 1, 'David Nguyen', current_timestamp, 'This is the third post', false, NULL, 0, true, 1, true);
INSERT INTO forum_posts(post_id, title, user_id, author, published_date, description, isPinned, related_link, num_of_upvotes, isEndorsed, topic_group, fromAnnouncement) 
VALUES(default, 'Assignment 1 Help', 1, 'David Nguyen', current_timestamp, 'Ask questions here for help', true, NULL, 0, false, 2, false);

-- Create upvotes
INSERT INTO upvotes(post_id, user_id) VALUES (1, 2);
INSERT INTO upvotes(post_id, user_id) VALUES (1, 3);

-- Create Tags
INSERT INTO tags(tag_id, topic_group_id, name) VALUES(default, 1, 'Intro');
INSERT INTO tags(tag_id, topic_group_id, name) VALUES(default, 1, 'New');
INSERT INTO tags(tag_id, topic_group_id, name) VALUES(default, 1, 'Ass1');
INSERT INTO tags(tag_id, topic_group_id, name) VALUES(default, 2, 'Ass1');
INSERT INTO tags(tag_id, topic_group_id, name) VALUES(default, 2, 'FinalExam');

-- Create Topic Tags
INSERT INTO tags(tag_id, topic_group_id, name) VALUES(default, 1, 'Memory');
INSERT INTO tags(tag_id, topic_group_id, name) VALUES(default, 1, 'Loops');
INSERT INTO tags(tag_id, topic_group_id, name) VALUES(default, 1, 'Lists');

-- Create Reserved Tags
INSERT INTO reserved_tags(tag_id, name) VALUES(default, 'Announcement');
INSERT INTO reserved_tags(tag_id, name) VALUES(default, 'Answered');
INSERT INTO reserved_tags(tag_id, name) VALUES(default, 'Unanswered');
INSERT INTO reserved_tags(tag_id, name) VALUES(default, 'Endorsed');

-- Link tags
INSERT INTO post_tags(post_id, tag_id) VALUES(1, 1);
INSERT INTO post_tags(post_id, tag_id) VALUES(1, 2);
INSERT INTO post_tags(post_id, tag_id) VALUES(2, 3);

-- Link topic tags
INSERT INTO topic_tags(topic_id, tag_id) VALUES(2, 4);
INSERT INTO topic_tags(topic_id, tag_id) VALUES(1, 5);
INSERT INTO topic_tags(topic_id, tag_id) VALUES(3, 6);

-- Create Replies
INSERT INTO replies(reply_id, user_id, author, published_date, reply) VALUES(default, 3, 'Tutory Tutor', current_timestamp, 'Glad to be in this course');
INSERT INTO replies(reply_id, user_id, author, published_date, reply) VALUES(default, 2, 'John Smith', current_timestamp, 'What is this course about');
INSERT INTO replies(reply_id, user_id, author, published_date, reply) VALUES(default, 1, 'David Nguyen', current_timestamp, 'How do i pin this post');

-- Link Replies
INSERT INTO post_replies(post_id, reply_id) VALUES(1, 1);
INSERT INTO post_replies(post_id, reply_id) VALUES(1, 2);
INSERT INTO post_replies(post_id, reply_id) VALUES(2, 3);

-- Create Comments
INSERT INTO comments(comment_id, user_id, author, published_date, comment, isEndorsed) VALUES(default, 3, 'Tutory Tutor', current_timestamp, 'Extra tips', true);
INSERT INTO comments(comment_id, user_id, author, published_date, comment, isEndorsed) VALUES(default, 2, 'John Smith', current_timestamp, 'Thank you for the post', false);
INSERT INTO comments(comment_id, user_id, author, published_date, comment, isEndorsed) VALUES(default, 1, 'David Nguyen', current_timestamp, 'Never mind i figured it out', false);

-- Link Comments
INSERT INTO post_comments(post_id, comment_id) VALUES(1, 1);
INSERT INTO post_comments(post_id, comment_id) VALUES(1, 2);
INSERT INTO post_comments(post_id, comment_id) VALUES(2, 3);

-- Create announcements
INSERT INTO announcements(id, author, topic_group, title, content, post_date) 
VALUES(default, 1, 1, 'First announcement for database systems', 'Some description for dbs', current_timestamp);
INSERT INTO announcements(id, author, topic_group, title, content, post_date) 
VALUES(default, 1, 1, 'Second announcement for C++ Programming', 'Some description for C++', current_timestamp);
INSERT INTO announcements(id, author, topic_group, title, content, post_date) 
VALUES(default, 2, 2, 'First actual announcement for DBS', 'This is the real DBS', current_timestamp);

-- Create announcement comments
INSERT INTO announcement_comment(id, announcement_id, author, content, post_date) VALUES(default, 1, 1, 'This is the wrong course', current_timestamp);
INSERT INTO announcement_comment(id, announcement_id, author, content, post_date) VALUES(default, 2, 3, 'There is a duplicate', current_timestamp);

-- Create quiz
INSERT INTO quizzes(id, name, topicGroupId, openDate, closeDate, timeGiven, numQuestions) 
VALUES(default, 'Quiz 1', 1, '2016-06-22 19:10:25-07', current_timestamp, 30, 2);
INSERT INTO quizzes(id, name, topicGroupId, openDate, closeDate, timeGiven, numQuestions) 
VALUES(default, 'Quiz 2', 1, '2018-02-22 19:10:25-07', current_timestamp, 30, 1);
INSERT INTO quizzes(id, name, topicGroupId, openDate, closeDate, timeGiven, numQuestions) 
VALUES(default, 'Quiz 1', 2, '2018-04-22 19:10:25-07', current_timestamp, 30, 0);

-- Create questionbank
INSERT INTO question_bank(id) VALUES(default);

-- Create quiz questions
INSERT INTO questions(id, topicId, questionBankId, questionText, questionType, marksAwarded) 
VALUES(default, 1, 1, 'What is a loop', 'mc', 1);
INSERT INTO questions(id, topicId, questionBankId, questionText, questionType, marksAwarded) 
VALUES(default, 2, 1, 'Which one is a pointer', 'mc', 1);
INSERT INTO questions(id, topicId, questionBankId, questionText, questionType, marksAwarded) 
VALUES(default, 3, 1, 'How do you declare an array', 'sa', 1);

-- Create question possible answers
INSERT INTO question_possible_answers(id, questionId, answertext, iscorrect, explanation)
VALUES(default, 1, 'A loop iterates X times executing whatever is inside', true, 'It is the correct definition');
INSERT INTO question_possible_answers(id, questionId, answertext, iscorrect, explanation)
VALUES(default, 1, 'A data structure', false, 'A loop is not a data structure');
INSERT INTO question_possible_answers(id, questionId, answertext, iscorrect, explanation)
VALUES(default, 2, '*', true, 'Pointer');
INSERT INTO question_possible_answers(id, questionId, answertext, iscorrect, explanation)
VALUES(default, 2, '+=', false, 'Incrementer false');
INSERT INTO question_possible_answers(id, questionId, answertext, iscorrect, explanation)
VALUES(default, 3, 'var x = []', true, 'Javascript array');
INSERT INTO question_possible_answers(id, questionId, answertext, iscorrect, explanation)
VALUES(default, 3, '[]', false, 'No variable declaration');

-- Link question to quiz
INSERT INTO quiz_questions(quizId, questionId) VALUES(1, 1);
INSERT INTO quiz_questions(quizId, questionId) VALUES(1, 2);
INSERT INTO quiz_questions(quizId, questionId) VALUES(2, 3);

-- Create student attempts
INSERT INTO student_attempts(id, quizId, studentId, startTime, endTime)
VALUES(default, 1, 1, '2018-04-22 19:10:25-07', current_timestamp);
INSERT INTO student_attempts(id, quizId, studentId, startTime, endTime)
VALUES(default, 1, 2, '2019-04-22 19:10:25-07', current_timestamp);
INSERT INTO student_attempts(id, quizId, studentId, startTime, endTime)
VALUES(default, 1, 3, '2020-04-22 19:10:25-07', current_timestamp);

-- Create student answers
INSERT INTO student_answers(id, quizId, studentId, questionId, answer)
VALUES(default, 1, 1, 1, 'a');
INSERT INTO student_answers(id, quizId, studentId, questionId, answer)
VALUES(default, 1, 1, 2, 'd');

-- Link answers to attempts
INSERT INTO attempt_answers(attemptId, answerId)
VALUES(1, 1);
INSERT INTO attempt_answers(attemptId, answerId)
VALUES(1, 2);

-- Weeks (can remove)
INSERT INTO weeks(id, num) VALUES(default, 1);
INSERT INTO weeks(id, num) VALUES(default, 2);
INSERT INTO weeks(id, num) VALUES(default, 3);

-- Create NonEnrol-Lectures
INSERT INTO lectures(id, topic_group_id, topic_reference, week)
VALUES(default, 1, 1, 1);
INSERT INTO lectures(id, topic_group_id, topic_reference, week)
VALUES(default, 1, 1, 2);
INSERT INTO lectures(id, topic_group_id, topic_reference, week)
VALUES(default, 1, 1, 3);

-- Lecture files
INSERT INTO lecture_files(id, name, file, type, lecture_id) 
VALUES(default, 'intro-slides.pdf', '/_files/lecture1/intro-slides.pdf', 'lecture', 1);
INSERT INTO lecture_files(id, name, file, type, lecture_id) 
VALUES(default, 'loops.pdf', '/_files/lecture1/loops.pdf', 'lecture', 2);
INSERT INTO lecture_files(id, name, file, type, lecture_id) 
VALUES(default, 'arrays.pdf', '/_files/lecture1/arrays.pdf', 'lecture', 3);

-- Lecture file links
INSERT INTO lecture_files_lectures(fileId, lectureId) 
VALUES(1, 1);
INSERT INTO lecture_files_lectures(fileId, lectureId) 
VALUES(2, 1);
INSERT INTO lecture_files_lectures(fileId, lectureId) 
VALUES(3, 1);

-- Create NonEnrol-Tutorials
INSERT INTO tutorials(id, topic_group_id, week, topic_reference) 
VALUES(default, 1, 1, 1);
INSERT INTO tutorials(id, topic_group_id, week, topic_reference) 
VALUES(default, 1, 1, 1);

-- Tutorial files
INSERT INTO tutorial_files(id, name, file, type, tutorial_id) 
VALUES(default, 'tutorial1-slides.pdf', '/_files/tutorial1/lecture1-slides.pdf', 'tutorial', 1);
