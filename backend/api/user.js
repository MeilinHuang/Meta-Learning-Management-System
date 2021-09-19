const pool = require('../db/database');
var fs = require('fs');
//const { start } = require('repl');

/***************************************************************
                       User Functions
***************************************************************/

async function getUser(request, response) {
  try {
    const id = parseInt(request.params.userId);
    let resp = await pool.query(
      `SELECT id, zid, u.name AS user_name, t.enrolled_courses 
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
  const id = parseInt(request.params.userId);
  const topicGroupId = parseInt(request.params.topicGroupId);

  pool.query(
    'INSERT INTO user_admin(admin_id, topic_group_id) VALUES($1, $2)',
    [id, topicGroupId],
    (error, results) => {
      if (error) { throw error }
      response.status(200).send(`Admin added with ID: ${id}`)
    }
  )
}

// Delete admin
async function deleteAdmin (request, response) {
  const id = parseInt(request.params.userId)

  pool.query('DELETE FROM user_admin WHERE admin_id = $1 CASCADE', 
  [id], (error, results) => {
    if (error) { throw error }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
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
    if (userExist.rows[0].exist == false) throw (`Failed: User with id '${userId}' does not exist`);
    if (topicGroupExist.rows[0].exist == false) throw (`Failed: Topic Group '${topicGroupName}' does not exist`);

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

module.exports = {
  getUser,
  deleteUser,
  postAdmin,
  deleteAdmin,
  putUserProgress
};