-- \i 'C:/Users/Dave/Desktop/COMP4962 - Thesis B/metalms/backend/db/sample_data.sql';

-- Create Users
INSERT INTO users(id, name, zid) values(default, 'David Nguyen', 'z5166106');
INSERT INTO users(id, name, zid) values(default, 'John Smith', 'z5123821');
INSERT INTO users(id, name, zid) values(default, 'Tutory Tutorer', 'z5921738');
INSERT INTO users(id, name, zid) values(default, 'Lecturey Lecturer', 'z5928712');

-- Create Topic Groups
INSERT INTO topic_group(id, name, topic_code, course_outline) values(default, 'C++ Programming', 'COMP6771', 'Course_Outline.pdf');
INSERT INTO topic_group(id, name, topic_code, course_outline) values(default, 'Database Systems', 'COMP3331', 'Course_Outline.pdf');

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

-- Add prerequisites
INSERT INTO prerequisites(prereq, topic) values(3, 1);
INSERT INTO prerequisites(prereq, topic) values(2, 1);

-- Create Tutorials
INSERT INTO tutorials(id, tutor_id, topic_group_id, tutorial_code, timeslot, curr_capacity, max_capacity) values(default, 3, 1, 'M18A1', '10:00-12:00', 0, 20);
INSERT INTO tutorials(id, tutor_id, topic_group_id, tutorial_code, timeslot, curr_capacity, max_capacity) values(default, 3, 1, 'W18A1', '10:00-12:00', 0, 20);

-- Create Admins
INSERT INTO user_admin(admin_id, topic_group_id) values(3, 1);

-- Enroll Students
INSERT INTO user_enrolled(topic_group_id, user_id) values(1, 1);
INSERT INTO user_enrolled(topic_group_id, user_id) values(1, 2);
INSERT INTO user_enrolled(topic_group_id, user_id) values(2, 1);

-- Create Forum Posts
INSERT INTO forum_posts(post_id, title, user_id, author, published_date, description, isPinned, related_link, num_of_upvotes, isEndorsed) 
VALUES(default, 'Welcome to the first post', 1, 'David Nguyen', current_timestamp, 'Description text of first post', false, NULL, 2, true);
INSERT INTO forum_posts(post_id, title, user_id, author, published_date, description, isPinned, related_link, num_of_upvotes, isEndorsed) 
VALUES(default, 'Assignment 1 Help', 1, 'David Nguyen', current_timestamp, 'Ask questions here for help', true, NULL, 0, false);

-- Create upvotes
INSERT INTO upvotes(post_id, user_id) VALUES (1, 2);
INSERT INTO upvotes(post_id, user_id) VALUES (1, 3);

-- Create Tags
INSERT INTO tags(tag_id, name) VALUES(default, 'Introduction');
INSERT INTO tags(tag_id, name) VALUES(default, 'New');
INSERT INTO tags(tag_id, name) VALUES(default, 'Ass1');

-- Create Topic Tags
INSERT INTO tags(tag_id, name) VALUES(default, 'Memory');
INSERT INTO tags(tag_id, name) VALUES(default, 'For loops');
INSERT INTO tags(tag_id, name) VALUES(default, 'Lists');

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
INSERT INTO comments(comment_id, user_id, author, published_date, comment) VALUES(default, 3, 'Tutory Tutor', current_timestamp, 'Extra tips');
INSERT INTO comments(comment_id, user_id, author, published_date, comment) VALUES(default, 2, 'John Smith', current_timestamp, 'Thank you for the post');
INSERT INTO comments(comment_id, user_id, author, published_date, comment) VALUES(default, 1, 'David Nguyen', current_timestamp, 'Never mind i figured it out');

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

/* -- Create Gamification Questions
INSERT INTO gamification_question(id, title, questiontype, potentialAnswers, correctAnswer, availableFrom, numberOfAnswers, mediaLink, estimatedTimeRequired)
VALUES(default, 'Gamification Question 1', 'mpc', 'a', 'a', current_timestamp, 4, 'question_image1.png', 2);
INSERT INTO gamification_question(id, title, questiontype, potentialAnswers, correctAnswer, availableFrom, numberOfAnswers, mediaLink, estimatedTimeRequired)
VALUES(default, 'Gamification Question 2', 'mpc', 'd', 'd', current_timestamp, 4, 'question_image2.png', 2);

-- Create gamification levels
INSERT INTO levels(id, title, topic_group_id, typeOfLevel, availableFrom, numberOfQuestions, estimatedTimeRequired) 
VALUES(default, 'Level 1', 1, 'Beginner', current_timestamp, 12, 20);
INSERT INTO levels(id, title, topic_group_id, typeOfLevel, availableFrom, numberOfQuestions, estimatedTimeRequired) 
VALUES(default, 'Level 2', 1, 'Intermediate', current_timestamp, 20, 45);

-- Link questions to levels
INSERT INTO levels_questions(level_id, question_id) 
VALUES(3, 1);
INSERT INTO levels_questions(level_id, question_id) 
VALUES(3, 2);

-- Link levels to topic group
INSERT INTO topic_group_levels(topic_group_id, levelsid) 
VALUES(1, 2); */

-- Create quiz
INSERT INTO quiz(id, name, due_date, time_given) VALUES(default, 'Quiz 1', '2016-06-22 19:10:25-07', 30);
INSERT INTO quiz(id, name, due_date, time_given) VALUES(default, 'Quiz 2', '2016-06-22 19:10:25-07', 45);
INSERT INTO quiz(id, name, due_date, time_given) VALUES(default, 'Quiz 3', '2016-06-22 19:10:25-07', 45);

-- Create questionbank
INSERT INTO quiz_question_bank(id, name) VALUES(default, 'Question Bank 1');
INSERT INTO quiz_question_bank(id, name) VALUES(default, 'Question Bank 2');

-- Create quiz questions
INSERT INTO quiz_question(id, quiz_id, quiz_type, marks_awarded, description, related_topic_id) 
VALUES(default, 1, 'mpc', 2,'Questions Description', 1);
INSERT INTO quiz_question(id, quiz_id, quiz_type, marks_awarded, description, related_topic_id) 
VALUES(default, 1, 'mpc', 5,'Questions Description', 1);
INSERT INTO quiz_question(id, quiz_id, quiz_type, marks_awarded, description, related_topic_id) 
VALUES(default, 2, 'mpc', 1.5,'Questions Description', 2);

-- Link Question Bank to Questions
INSERT INTO question_bank_question(question_bank_id, question_id) VALUES(1, 1);
INSERT INTO question_bank_question(question_bank_id, question_id) VALUES(2, 2);
INSERT INTO question_bank_question(question_bank_id, question_id) VALUES(2, 3);

-- Create quiz question answer
INSERT INTO quiz_question_answer(id, quiz_id, question_id, is_correct_answer, description)
VALUES(default, 1, 1, false, '1 + 1 = 3');
INSERT INTO quiz_question_answer(id, quiz_id, question_id, is_correct_answer, description)
VALUES(default, 1, 1, true, '1 + 1 = 2');
INSERT INTO quiz_question_answer(id, quiz_id, question_id, is_correct_answer, description)
VALUES(default, 1, 1, false, '1 + 1 = 0');
INSERT INTO quiz_question_answer(id, quiz_id, question_id, is_correct_answer, description)
VALUES(default, 2, 2, false, 'None of the above');

-- Create student answer
INSERT INTO quiz_student_answer(student_id, quiz_id, question_id, answer_selected_id) 
VALUES(1, 2, 1, 1);
INSERT INTO quiz_student_answer(student_id, quiz_id, question_id, answer_selected_id) 
VALUES(2, 2, 2, 1);
INSERT INTO quiz_student_answer(student_id, quiz_id, question_id, answer_selected_id) 
VALUES(3, 2, 2, 1);

-- Create poll
INSERT INTO quiz_poll(id, name, start_time, close_time, is_closed, poll_type) VALUES(default, 'Poll A', current_timestamp, current_timestamp, false, 'Poll type A');
INSERT INTO quiz_poll(id, name, start_time, close_time, is_closed, poll_type) VALUES(default, 'Poll B', current_timestamp, current_timestamp, false, 'Poll type B');
INSERT INTO quiz_poll(id, name, start_time, close_time, is_closed, poll_type) VALUES(default, 'Poll C', current_timestamp, current_timestamp, false, 'Poll type C');