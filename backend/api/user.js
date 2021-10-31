const pool = require('../db/database');
var fs = require('fs');

const errorCheck = require("./error.js");

/***************************************************************
                       User Functions
***************************************************************/

async function getUser(request, response) {
  try {
    const id = request.params.userId;

    let resp = await pool.query(
      `SELECT id, zid, staff, email, img_url, u.name AS user_name, u.last_accessed_topic, t.enrolled_courses 
      FROM users u 
      LEFT JOIN (SELECT us.user_id AS id, array_agg(t.id) 
      AS enrolled_courses FROM user_enrolled us 
      LEFT JOIN topic_group t ON t.id = us.topic_group_id 
      GROUP BY us.user_id) t USING (id) WHERE id = $1`,
      [id]);
    var enrolledCourses = [];

    if (resp.rows[0].enrolled_courses) {
      for (const topic_id of resp.rows[0].enrolled_courses) {
        let tmp = await pool.query(
          `SELECT tg.id, tg.name, tg.topic_code, tg.course_outline, ue.progress
          FROM topic_group tg
          LEFT JOIN user_enrolled ue 
          ON tg.id = ue.topic_group_id AND ue.user_id = $1
          WHERE tg.id = $2`, [id, topic_id]);
        enrolledCourses.push(tmp.rows[0]);
      };
      resp.rows[0].enrolled_courses = enrolledCourses;
    }
    
    response.status(200).json(resp.rows[0]);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Delete user from database
async function deleteUser (request, response) {
  try {
    const id = parseInt(request.params.userId)
    await pool.query('DELETE FROM users WHERE id = $1 CASCADE', [id]);
    response.status(200).json({success: true, deletedUserId: `${id}`})
  } catch (e) {
    response.status(400).send(e);
  }
}

// Create admin
async function postAdmin (request, response) {
  try {
    const id = parseInt(request.params.userId);
    const topicGroupId = parseInt(request.params.topicGroupId);

    await pool.query(
    'INSERT INTO user_admin(admin_id, topic_group_id) VALUES($1, $2)',
    [id, topicGroupId]);

    response.status(200).json({success: true, admin: id});
  } catch (e) {
    response.status(400).send(e);
  }
}

// Delete admin
async function deleteAdmin (request, response) {
  try {
    const id = parseInt(request.params.userId)

    await pool.query('DELETE FROM user_admin WHERE admin_id = $1 CASCADE', 
    [id]);

    response.status(200).json({success: true, deleted: id});
  } catch (e) {
    response.status(400).send(e);
  }
}

// Update progress for enrolled course
async function putUserProgress (request, response) {
  try {
    const newProgress = request.body.progressVal;
    const userId = request.params.userId;
    const topicGroupName = request.body.topicGroupName; // May convert to topicGroupId if needed

    const userExist = await pool.query(
      `SELECT EXISTS(SELECT * FROM users 
      WHERE id = $1)`, [userId]);

    const topicGroupExist = await pool.query(
      `SELECT EXISTS(SELECT * FROM topic_group 
      WHERE LOWER(name) LIKE LOWER($1))`, [topicGroupName]);
    
    if (newProgress < 0 || newProgress > 100) throw (`Failed: Progress cannot be larger than '100' or less than '0'`);
    if (userExist.rows[0].exists == false) throw (`Failed: User with id '${userId}' does not exist`);
    if (topicGroupExist.rows[0].exists == false) throw (`Failed: Topic Group '${topicGroupName}' does not exist`);

    const tgReq = await pool.query (
      `SELECT id FROM topic_group 
      WHERE LOWER(name) LIKE LOWER($1)`, [topicGroupName]);

    const topicGroupId = tgReq.rows[0].id;

    await pool.query(
      `UPDATE user_enrolled SET progress = $1
       WHERE user_id = $2 AND topic_group_id = $3`, [newProgress, userId, topicGroupId]);

    response.status(200).json({success: true, userId: userId});
  } catch (e) {
    response.status(400).send(e);
  }
}

// Post Calendar for user
async function postCalendar (request, response) {
  try {
    const newDate = request.body.remind_date;
    const description = request.body.description;
    const userId = request.params.userId;

    const userExist = await pool.query(
    `SELECT EXISTS(SELECT * FROM users 
    WHERE id = $1)`, [userId]);
    
    if (userExist.rows[0].exists == false) throw (`Failed: User with id '${userId}' does not exist`);
    let newReminderId = await pool.query(`INSERT INTO calendar_reminders(id, remind_date, description)
    VALUES(default, $1, $2) RETURNING id`, [newDate, description]);

    await pool.query(`INSERT INTO user_calendar_reminders(reminder_id, user_id)
    VALUES($1, $2)`, [newReminderId.rows[0].id, userId]);

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).send(e);
  }
}

// Put Calendar for user
async function putCalendarById (request, response) {
  try {
    const newDate = request.body.remind_date;
    const description = request.body.description;
    const calendarId = request.params.calendarId;

    const calendarExist = await pool.query(
      `SELECT EXISTS(SELECT * FROM calendar_reminders 
      WHERE id = $1)`, [calendarId]);

    if (calendarExist.rows[0].exists == false) throw (`Failed: Calendar with id '${calendarId}' does not exist`);

    await pool.query(`UPDATE calendar_reminders 
    SET remind_date = $1, description = $2
    WHERE id = $3`, [newDate, description, calendarId]);

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).send(e);
  }  
}

// Delete Calendar by id
async function deleteCalendarById (request, response) {
  console.log("test")
  try {
  const calendarId = request.params.calendarId;
    const calendarExist = await pool.query(
      `SELECT EXISTS(SELECT * FROM calendar_reminders 
      WHERE id = $1)`, [calendarId]);

    if (calendarExist.rows[0].exists == false) throw (`Failed: Calendar with id '${calendarId}' does not exist`);
    await pool.query(`DELETE FROM calendar_reminders WHERE id = $1`, [calendarId]);

    response.status(200).json({success: true});
    
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get Calendar for user
async function getUserCalendar (request, response) {
  try {
    const userId = request.params.userId;
    const userExist = await pool.query(
      `SELECT EXISTS(SELECT * FROM users 
      WHERE id = $1)`, [userId]);

    if (userExist.rows[0].exists == false) throw (`Failed: User with id '${userId}' does not exist`);

    let resp = await pool.query(
      `SELECT c.id, c.remind_date, c.description
      FROM calendar_reminders c
      INNER JOIN user_calendar_reminders uc
      ON c.id = uc.reminder_id AND uc.user_id = $1`, 
      [userId]);

    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get Calendar by id
async function getCalendarById (request, response) {
  try {
    const calendarId = request.params.calendarId;
    const calendarExist = await pool.query(
      `SELECT EXISTS(SELECT * FROM calendar_reminders 
      WHERE id = $1)`, [calendarId]);

    if (calendarExist.rows[0].exists == false) throw (`Failed: Calendar with id '${calendarId}' does not exist`);
    let resp = await pool.query(
      `SELECT * FROM calendar_reminders WHERE id = $1`, 
      [calendarId]);

    response.status(200).json(resp.rows[0]);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Update last accessed topic for a user
async function putAccessedTopic (request, response) {
  try {
    const userId = request.params.userId;
    const lastTopic = request.body.lastTopic;

    const userExist = await pool.query(
      `SELECT EXISTS(SELECT * FROM users 
      WHERE id = $1)`, [userId]);

    if (userExist.rows[0].exists == false) throw (`Failed: User with id '${userId}' does not exist`);
    await pool.query(`UPDATE users SET last_accessed_topic = $1 WHERE id = $2`, [lastTopic, userId]);

    response.status(200).json({success: true, userId: userId, lastAccessedTopic: lastTopic})
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get user content progress by id
async function getUserContentProgress (request, response) {
  try {
    const topicId = request.params.topicId;
    const userId = request.params.userId;

    const userExist = await pool.query(
      `SELECT EXISTS(SELECT * FROM users 
      WHERE id = $1)`, [userId]);

    const topicExist = await pool.query(
      `SELECT EXISTS(SELECT * FROM topics 
      WHERE id = $1)`, [topicId]);

    if (userExist.rows[0].exists == false) throw (`Failed: User with id '${userId}' does not exist`);
    if (topicExist.rows[0].exists == false) throw (`Failed: Topic with id '${topicId}' does not exist`);

    let resp = await pool.query(
      `SELECT * FROM user_content_progress 
      WHERE user_id = $1 AND topic_id = $2`
      , [userId, topicId]);
    
    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Update completion status of user content progress
async function putUserContentProgress (request, response) {
  try {
    const topicId = request.params.topicId;
    const userId = request.params.userId;
    const topicFileId = request.body.topicFileId;
    const completion = request.body.completion;

    const userExist = await pool.query(
      `SELECT EXISTS(SELECT * FROM users 
      WHERE id = $1)`, [userId]);

    const topicExist = await pool.query(
      `SELECT EXISTS(SELECT * FROM topics 
      WHERE id = $1)`, [topicId]);

    const topicFileExist = await pool.query(
      `SELECT EXISTS(SELECT * FROM topic_files 
      WHERE id = $1)`, [topicFileId]);

    if (userExist.rows[0].exists == false) throw new Error(`User with id '${userId}' does not exist`);
    if (topicExist.rows[0].exists == false) throw new Error(`Topic with id '${topicId}' does not exist`);
    if (topicFileExist.rows[0].exists == false) throw new Error(`Topic File with id '${topicFileId}' does not exist`);

    await pool.query(`UPDATE user_content_progress SET completed = $1 
    WHERE user_id = $2 AND topic_file_id = $3 AND topic_id = $4`, 
    [completion, userId, topicFileId, topicId]);

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).send(e);
  }
}

module.exports = {
  getUser,
  deleteUser,
  postAdmin,
  deleteAdmin,
  putUserProgress,
  postCalendar,
  putCalendarById,
  deleteCalendarById,
  getUserCalendar,
  getCalendarById,
  putAccessedTopic,
  getUserContentProgress,
  putUserContentProgress
};