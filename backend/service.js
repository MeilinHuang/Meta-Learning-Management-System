
const pool = require('./db/database');

// TODO : ADD AUTH AND JWTOKEN

/***************************************************************
                       User Functions
***************************************************************/

async function getUser(request, response) {
  const id = parseInt(request.params.userId);
  let resp;
  try {
    resp = await pool.query(
      `SELECT id, zid, u.name AS user_name, t.enrolled_courses 
      FROM users u JOIN (SELECT us.user_id AS id, array_agg(t.id) 
      AS enrolled_courses FROM user_enrolled us 
      JOIN topic_group t ON t.id = us.topic_group_id 
      GROUP BY us.user_id) t USING (id) WHERE id = $1`,
      [id]);
    var finalQuery = resp.rows[0];
    var holderArr = [];
  
    for (const topic_id of resp.rows[0].enrolled_courses) {
      let tmp = await pool.query(`SELECT * FROM topic_group WHERE id = $1`, [topic_id]);
      holderArr.push(tmp.rows[0]);
    };

    finalQuery.enrolled_courses = holderArr;
  } catch (e) {
    console.log(e);
  }

  response.status(200).json(finalQuery);
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.userId)

  pool.query('DELETE FROM users WHERE id = $1 CASCADE', [id], (error, results) => {
    if (error) { throw error }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

const postAdmin = (request, response) => {
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

const deleteAdmin = (request, response) => {
  const id = parseInt(request.params.userId)

  pool.query('DELETE FROM user_admin WHERE admin_id = $1 CASCADE', 
  [id], (error, results) => {
    if (error) { throw error }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

/***************************************************************
                       Topic Group Functions
***************************************************************/

async function getAllTopicGroups(request, response) {
  void (request);
  let resp;
  try {
    resp = await pool.query(
      `SELECT tp_group.id, tp_group.name, tp_group.topic_code, tp_group.course_outline,
      array_agg(DISTINCT topics.id) AS topics_list, array_agg(DISTINCT tutorials.id) as tutorial_list
      FROM topic_group tp_group 
      JOIN topics ON topics.topic_group_id = tp_group.id
      JOIN tutorials ON topics.topic_group_id = tutorials.topic_group_id
      GROUP BY tp_group.id;`);

    var finalQuery = resp.rows;

    for (var object of finalQuery) { // Loop through list of topic groups
      var topicArr = [];
      var tutArr = [];
      for (const topic_id of object.topics_list) {
        let tmp = await pool.query(`SELECT * FROM topics WHERE id = $1`, [topic_id]);
        topicArr.push(tmp.rows[0]);
      };
  
      for (const tutorial_id of object.tutorial_list) {
        let tmp = await pool.query(`SELECT * FROM tutorials WHERE id = $1`, [tutorial_id]);
        tutArr.push(tmp.rows[0]);
      };

      object.topics_list = topicArr;
      object.tutorial_list = tutArr;
    }

  } catch (e) {
    console.log(e);
  }

  response.status(200).json(finalQuery);
}

const getTopics = (request, response) => {
  const topicGroupName = request.params.topicGroupName;

  pool.query(
    `SELECT array_agg(DISTINCT topics.name) AS topics_list
    FROM topic_group tp_group 
    JOIN topics ON topics.topic_group_id = tp_group.id
    WHERE tp_group.name = $1
    GROUP BY tp_group.id;`, [topicGroupName],
   (error, results) => {
    if (error) { throw error }
    response.status(200).json(results.rows[0]);
  })
}

module.exports = {
  getUser,
  postAdmin,
  deleteUser,
  deleteAdmin,
  getAllTopicGroups,
  getTopics
};