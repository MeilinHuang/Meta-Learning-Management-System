const pool = require('../db/database');

/***************************************************************
                       Error Checking Functions
***************************************************************/

// Check if user exists in db
async function checkUserExist (userId) {
  const userExist = await pool.query(
    `SELECT EXISTS(SELECT * FROM users 
    WHERE id = $1)`, [userId]);

  if (userExist.rows[0].exists == false) throw new Error(`User with id '${userId}' does not exist`);
}

// Check if topic exists in db
async function checkTopicExist (topicId) {
  const topicExist = await pool.query(
    `SELECT EXISTS(SELECT * FROM topics 
    WHERE id = $1)`, [topicId]);

  if (topicExist.rows[0].exists == false) throw new Error(`Topic with id '${topicId}' does not exist`);
}

module.exports = {
  checkUserExist,
  checkTopicExist
};