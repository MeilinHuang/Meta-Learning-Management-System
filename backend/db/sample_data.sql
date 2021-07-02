-- SAMPLE DATA INSERTION
-- \i 'C:/Users/Dave/Desktop/COMP4962 - Thesis B/metalms/backend/db/sample_data.sql';

-- Create Users
INSERT INTO users(id, name, zid) values(default, 'David Nguyen', 'z5166106');
INSERT INTO users(id, name, zid) values(default, 'John Smith', 'z5123821');
INSERT INTO users(id, name, zid) values(default, 'Tutory Tutorer', 'z5921738');

-- Create Topic Groups
INSERT INTO topic_group(id, name, topic_code, course_outline) values(default, 'C++ Programming', 'COMP6771', 'Course_Outline.pdf');
INSERT INTO topic_group(id, name, topic_code, course_outline) values(default, 'Database Systems', 'COMP3331', 'Course_Outline.pdf');

-- Create Topics
INSERT INTO topics(id, topic_group_id, name) values(default, 1, 'Loops');
INSERT INTO topics(id, topic_group_id, name) values(default, 1, 'Pointers');
INSERT INTO topics(id, topic_group_id, name) values(default, 1, 'Arrays');
INSERT INTO topics(id, topic_group_id, name) values(default, 2, 'Schemas');

-- Create Tutorials
INSERT INTO tutorials(id, tutor_id, topic_group_id, tutorial_code, timeslot, curr_capacity, max_capacity) values(default, 3, 1, 'M18A1', '10:00-12:00', 0, 20);
INSERT INTO tutorials(id, tutor_id, topic_group_id, tutorial_code, timeslot, curr_capacity, max_capacity) values(default, 3, 1, 'W18A1', '10:00-12:00', 0, 20);

-- Create Admins
INSERT INTO user_admin(admin_id, topic_group_id) values(3, 1);

-- Enroll Students
INSERT INTO user_enrolled(topic_group_id, user_id) values(1, 1);
INSERT INTO user_enrolled(topic_group_id, user_id) values(1, 2);
INSERT INTO user_enrolled(topic_group_id, user_id) values(2, 1);

  /* SELECT id, zid, u.name AS user_name, t.enrolled_courses 
    FROM users u JOIN (SELECT us.user_id AS id, array_agg(t.topic_code) 
    AS enrolled_courses FROM user_enrolled us 
    JOIN topic_group t ON t.id = us.topic_group_id 
    GROUP BY us.user_id) t USING (id) WHERE id = $1 */

  /* SELECT array_agg(DISTINCT topics.name) AS topics_list
  FROM topic_group tp_group 
  JOIN topics ON topics.topic_group_id = tp_group.id
  WHERE tp_group.name = 'Database Systems'
  GROUP BY tp_group.id; */

  /* SELECT id, zid, u.name AS user_name, t.enrolled_courses 
  FROM users u JOIN (SELECT us.user_id AS id, array_agg(t.id) 
  AS enrolled_courses FROM user_enrolled us 
  JOIN topic_group t ON t.id = us.topic_group_id 
  GROUP BY us.user_id) t USING (id) WHERE id = 1; */