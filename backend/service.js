const jwt = require('jsonwebtoken');
const pool = require('./db/database');
var fs = require('fs');

const JWT_SECRET = 'metalms'

/***************************************************************
                       Auth Functions
***************************************************************/
async function getZIdFromAuthorization (auth){
  try {
    const token = auth.replace('Bearer ', '')
    const zId = jwt.verify(token, JWT_SECRET).zid

    resp = await pool.query(
      `SELECT zId, email, password FROM users
      where zId = '${zId}'`
    )
    if (resp.rows.length === 0) { throw "Invalid Token" }

    return zId
  } catch (e) {
    console.log(e)
  }
}

async function login(request, response) {
  let email = request.body.email
  let password = request.body.password

  try {
    resp = await pool.query(
      `SELECT zId, email, password FROM users
      where email = '${email}'`
    )
    //If no matching email
    if (resp.rows.length != 1) {
      response.status(400).send('Incorrect Login Details')
      throw "Incorrect Login Details"
    }
    //If password incorrect
    if (password !== resp.rows[0].password) {
      response.status(400).send('Incorrect Login Details')
      throw "Incorrect Login Details"
    } 

    //Do login
    let zid = resp.rows[0].zid
    let token = jwt.sign({ zid }, JWT_SECRET, { algorithm: 'HS256', })
    response.status(200).send({ 'token':token })
    

  } catch (e) {
    console.log(e)
  }
}

async function register(request, response) {
  let name = request.body.name
  let email = request.body.email
  let zid = request.body.zid
  let password = request.body.password

  try {
    resp = await pool.query(
      `SELECT zId, email, password FROM users
      where email = '${email}'`
    )
    console.log(resp)
    //If an existing email
    if (resp.rows.length > 0) {
      response.status(400).send('An account already exists with this email')
      throw "an account already exists with this email"
    }

    resp = await pool.query(
      `SELECT zId, email, password FROM users
      where zId = '${zid}'`
    )
    //If an existing zid
    if (resp.rows.length > 0) {
      response.status(400).send('An account already exists with this zId')
      throw "an account already exists with this zId"
    }

    resp = await pool.query(
      `INSERT INTO users VALUES(default, $1, $2, $3, $4)`, 
      [name, email, password, zid]
    )

    //Do login
    let token = jwt.sign({ zid }, JWT_SECRET, { algorithm: 'HS256', })
    response.status(200).send({ 'token':token })

  } catch (e) {
    console.log(e)
  }
}

// API
const lecturesTutorialsApi = require('./api/lecturesTutorials');

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
    var holderArr = [];

    if (resp.rows[0].enrolled_courses) {
      for (const topic_id of resp.rows[0].enrolled_courses) {
        let tmp = await pool.query(`SELECT * FROM topic_group WHERE id = $1`, [topic_id]);
        holderArr.push(tmp.rows[0]);
      };
      resp.rows[0].enrolled_courses = holderArr;
    }
    
    response.status(200).json(resp.rows[0]);
  } catch (e) {
    response.status(400).send(e);
  }
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
  let resp = await pool.query(
    `SELECT tp_group.id, tp_group.name, tp_group.topic_code,
    array_agg(DISTINCT user_admin.admin_id) as admin_list,
    array_agg(DISTINCT topics.id) AS topics_list, array_agg(DISTINCT tutorials.id) as tutorial_list,
    array_agg(DISTINCT announcements.id) as announcements_list
    FROM topic_group tp_group 
    LEFT JOIN user_admin ON user_admin.topic_group_id = tp_group.id
    FULL OUTER JOIN topics ON topics.topic_group_id = tp_group.id
    LEFT JOIN tutorials ON topics.topic_group_id = tutorials.topic_group_id
    LEFT JOIN announcements ON topics.topic_group_id = announcements.topic_group
    GROUP BY tp_group.id`);

    for (var object of resp.rows) { // Loop through list of topic groups
      var adminArr = [];
      var topicArr = [];
      var tutArr = [];
      var announcementArr = [];

      for (const topicId of object.topics_list) {
        let tmp = await pool.query(`
        SELECT t.id, t.topic_group_id, t.name,
        array_agg(DISTINCT tf.id) as course_materials
        FROM topics t 
        LEFT JOIN topic_files tf ON tf.topic_id = t.id
        WHERE t.id = $1
        GROUP BY t.id`, [topicId]);

        if (tmp.rows[0]) {
          if (tmp.rows[0].course_materials[0] !== null) {
            var topicFilesArr = [];
            for (const fileId of tmp.rows[0].course_materials) {
              let fileReq = await pool.query(`SELECT * FROM topic_files WHERE id = $1`, [fileId]);
              topicFilesArr.push(fileReq.rows[0]);
            }
            tmp.rows[0].course_materials = topicFilesArr;
          }
        }
        
        topicArr.push(tmp.rows[0]);
      };
  
      for (const tutorialId of object.tutorial_list) {
        let tmp = await pool.query(`SELECT * FROM tutorials WHERE id = $1`, [tutorialId]);
        tutArr.push(tmp.rows[0]);
      };

      for (const adminId of object.admin_list) {
        let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [adminId]);
        adminArr.push(tmp.rows[0]);
      };

      for (const announcementId of object.announcements_list) {
        let tmp = await pool.query(`SELECT * FROM announcements WHERE id = $1`, [announcementId]);
        announcementArr.push(tmp.rows[0]);
      };

      object.topics_list = topicArr;
      object.tutorial_list = tutArr;
      object.announcements_list = announcementArr;
      object.admin_list = adminArr;
    }
    response.status(200).json(resp.rows);
  try {
    
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get topic group data by name
async function getTopicGroup (request, response) {
  try {
    const topicGroup = request.params.topicGroupName;
    var tgId = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroup]);
    const topicGroupId = tgId.rows[0].id;

    let resp = await pool.query(
      `SELECT tp_group.id, tp_group.name, tp_group.topic_code, 
      array_agg(DISTINCT user_admin.admin_id) as admin_list, array_agg(DISTINCT tgf.id) as attachments,
      array_agg(DISTINCT topics.id) as topics_list, array_agg(DISTINCT tutorials.id) as tutorial_list,
      array_agg(DISTINCT announcements.id) as announcements_list
      FROM topic_group tp_group 
      LEFT JOIN user_admin ON user_admin.topic_group_id = tp_group.id
      FULL OUTER JOIN topics ON topics.topic_group_id = tp_group.id
      LEFT JOIN tutorials ON topics.topic_group_id = tutorials.topic_group_id
      LEFT JOIN announcements ON topics.topic_group_id = announcements.topic_group
      LEFT JOIN topic_group_files tgf ON tgf.topic_group_id = tp_group.id
      WHERE tp_group.id = $1
      GROUP BY tp_group.id`, [topicGroupId]);

    var adminArr = [];
    var fileArr = [];
    var topicArr = [];
    var tutArr = [];
    var announcementArr = [];
    var preReqsArr = [];

    for (const fileId of resp.rows[0].attachments) {
      let tmp = await pool.query(`SELECT * FROM topic_group_files WHERE id = $1`, [fileId]);
      fileArr.push(tmp.rows[0]);
    }

    for (const tutorialId of resp.rows[0].tutorial_list) {
      let tmp = await pool.query(`SELECT * FROM tutorials WHERE id = $1`, [tutorialId]);
      tutArr.push(tmp.rows[0]);
    };

    for (const adminId of resp.rows[0].admin_list) {
      let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [adminId]);
      adminArr.push(tmp.rows[0]);
    };

    for (const announcementId of resp.rows[0].announcements_list) {
      let tmp = await pool.query(`SELECT * FROM announcements WHERE id = $1`, [announcementId]);
      announcementArr.push(tmp.rows[0]);
    };

    for (const topic_id of resp.rows[0].topics_list) {
      let tmp = await pool.query(
        `SELECT topics.id, topics.topic_group_id, topics.name, array_agg(topic_files.id) as course_materials, 
        array_agg(DISTINCT prerequisites.prereq) as prereqs
        FROM topics 
        FULL OUTER JOIN topic_files ON topic_files.topic_id = topics.id
        FULL OUTER JOIN prerequisites ON prerequisites.topic = topics.id
        WHERE topics.id = $1
        GROUP BY topics.id`
        , [topic_id]);

      if (tmp.rows.length > 0) {
        var courseMaterialsArr = [];
        if (tmp.rows[0].course_materials[0] !== null) {
          for (var material_id of tmp.rows[0].course_materials) {
            let tmp2 = await pool.query(`SELECT * from topic_files WHERE id = $1`, [material_id]);
            courseMaterialsArr.push(tmp2.rows[0]);
          }
        }
        if (tmp.rows[0].prereqs[0] === null) { tmp.rows[0].prereqs = []; }
        else {
          for (const preReqId of tmp.rows[0].prereqs) {
            let tmp = await pool.query(`
            SELECT t.id, t.name from topics t WHERE t.id = $1
            `, [preReqId]);
            preReqsArr.push(tmp.rows[0]);
          }
          tmp.rows[0].prereqs = preReqsArr;
        }
        tmp.rows[0].course_materials = courseMaterialsArr;
        topicArr.push(tmp.rows[0]);
      }
    };

    resp.rows[0].attachments = fileArr;
    resp.rows[0].topics_list = topicArr;
    resp.rows[0].tutorial_list = tutArr;
    resp.rows[0].announcements_list = announcementArr;
    resp.rows[0].admin_list = adminArr;

    response.status(200).json(resp.rows[0]);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get topics of topic group
async function getTopics (request, response) { 
  try {
    const topicGroupName = request.params.topicGroupName;
    let resp = await pool.query(
      `SELECT array_agg(DISTINCT topics.id) AS topics_list
      FROM topic_group tp_group 
      JOIN topics ON topics.topic_group_id = tp_group.id
      WHERE LOWER(tp_group.name) = LOWER($1)
      GROUP BY tp_group.id;`, [topicGroupName]);

    for (var object of resp.rows) { 
      var topicArr = [];
      var preReqsArr = [];
      for (const topic_id of object.topics_list) {
        let tmp = await pool.query(
          `SELECT topics.id, topics.topic_group_id, topics.name, array_agg(DISTINCT topic_files.id) as course_materials, 
          array_agg(DISTINCT prerequisites.prereq) as prereqs
          FROM topics 
          FULL OUTER JOIN topic_files ON topic_files.topic_id = topics.id
          FULL OUTER JOIN prerequisites ON prerequisites.topic = topics.id
          WHERE topics.id = $1
          GROUP BY topics.id`
          , [topic_id]);

        if (tmp.rows.length > 0) {
          var courseMaterialsArr = [];
          if (tmp.rows[0].course_materials[0] !== null) {
            for (var material_id of tmp.rows[0].course_materials) {
              let tmp2 = await pool.query(`SELECT * from topic_files WHERE id = $1`, [material_id]);
              courseMaterialsArr.push(tmp2.rows[0]);
            }
          }
          if (tmp.rows[0].prereqs[0] === null) {
            tmp.rows[0].prereqs = [];
          } else {
            for (const preReqId of tmp.rows[0].prereqs) {
              let tmp = await pool.query(`
              SELECT t.id, t.name from topics t WHERE t.id = $1
              `, [preReqId]);
              preReqsArr.push(tmp.rows[0]);
            }
            tmp.rows[0].prereqs = preReqsArr;
          }
          tmp.rows[0].course_materials = courseMaterialsArr;
          topicArr.push(tmp.rows[0]);
        }
      };

      object.topics_list = topicArr;
    }
    response.status(200).json(resp.rows[0]);
  } catch(e) {
    response.status(400).send(e);
  }
}

async function getTopicPreReqs (request, response) {
  try {
    const topicGroupName = request.params.topicGroupName;
    const topicName = request.params.topicName;
    let resp = await pool.query(
      `SELECT array_agg(DISTINCT p.prereq) as prerequisites_list 
      FROM prerequisites p
      JOIN topic_group ON LOWER(name) = LOWER($1)
      JOIN topics ON topics.topic_group_id = topic_group.id
      WHERE LOWER(topics.name) = LOWER($2)
      AND topics.topic_group_id = topic_group.id
      AND topics.id = p.topic`, [topicGroupName, topicName]);

    var preReqsArr = [];

    console.log(resp.rows[0]);
    if (resp.rows[0].prerequisites_list !== null) {
      for (var prereq_id of resp.rows[0].prerequisites_list) {
        let tmp = await pool.query(`SELECT * from topics WHERE id = $1`, [prereq_id]);
        preReqsArr.push(tmp.rows[0]);
      }
    }
    resp.rows[0].prerequisites_list = preReqsArr;
    response.status(200).json(resp.rows[0]);
  } catch(e) {
    response.status(400).send(e);
  }
}

// Create new pre requisite (Modify for topic name instead of IDs ??)
async function postPreReq (request, response) {
  const preReqId = parseInt(request.preReqId);
  const topicId = parseInt(request.topicId);

  await pool.query(
  'INSERT INTO prerequisites(prereq, topic) VALUES($1, $2)', [preReqId, topicId]);

  response.status(200).send(`Pre-requisite added with ID: ${preReqId}`)
}

// Delete pre-requisite data
async function deletePreReq (request, response) {
  const preReqId = parseInt(request.preReqId);
  const topicId = parseInt(request.topicId);

  await pool.query(
  'DELETE FROM prerequisites WHERE prereq = $1 AND topic = $2', [preReqId, topicId]);

  response.status(200).json({successs: true});
}

// Create topic group
async function postTopicGroup (request, response) {
  try {
    const topicGroupName = request.params.topicGroupName;
    const topic_code = request.body.topic_code;
    const fileTypeList = request.body.uploadedFileTypes.split(",");

    let resp = await pool.query(
      'INSERT INTO topic_group(id, name, topic_code) values(default, $1, $2) RETURNING id',
      [topicGroupName, topic_code]);

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/topicGroup${resp.rows[0].id}`)) { fs.mkdirSync(`../frontend/public/_files/topicGroup${resp.rows[0].id}`) }
      if (request.files.uploadFile.length > 1) {
        if (fileTypeList.length > request.files.uploadFile.length) throw ("Uploaded file type list longer than uploaded files");
        else if (fileTypeList.length < 0) throw ("Uploaded file type list shorter than uploaded files");
        var typeCounter = 0;
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO topic_group_files(id, name, file, type, topic_group_id)
          VALUES(default, $1, $2, $3, $4)`, [file.name, (`/_files/topicGroup${resp.rows[0].id}/${file.name}`), 
          fileTypeList[typeCounter], resp.rows[0].id]);
          fs.writeFile(`../frontend/public/_files/topicGroup${resp.rows[0].id}/${file.name}`, file.name, "binary", function (err) { if (err) throw err; });
          typeCounter+=1;
        }
      } else {
        if (fileTypeList.length > 1) throw ("Uploaded file type list longer than uploaded files");
        else if (fileTypeList.length < 0) throw ("Uploaded file type list shorter than uploaded files");
        await pool.query(`INSERT INTO topic_group_files(id, name, file, type, topic_group_id)
        VALUES(default, $1, $2, $3, $4)`, [request.files.uploadFile.name, 
        (`/_files/topicGroup${resp.rows[0].id}/${request.files.uploadFile.name}`), fileTypeList[0], resp.rows[0].id]);
        fs.writeFile(`../frontend/public/_files/topicGroup${resp.rows[0].id}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }

    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e)
  }
} 

// Update topic group details
async function putTopicGroup (request, response) {
  try {
    const newName = request.body.name;
    const newTopicCode = request.body.topic_code;
    const topicGroupName = request.params.topicGroupName;

    let tgReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if (!tgReq.rows.length) throw (`Failed: topic group {${topicGroupName}} does not exist`);

    const topicGroupId = tgReq.rows[0].id;
    const fileTypeList = request.body.uploadedFileTypes.split(",");

    await pool.query(`UPDATE topic_group SET name = $1, topic_code = $2
    WHERE id = $3`, [newName, newTopicCode, topicGroupId]);

    if (request.body.fileDeleteList) {
      const fileDeleteList = request.body.fileDeleteList.split(",");
      if (fileDeleteList.length) {  // Deletes files specified in delete list
        for (const fileId of fileDeleteList) {
          let tmpQ = await pool.query(`DELETE FROM topic_group_files WHERE id = $1 RETURNING file`, [fileId]);
          fs.unlinkSync("../frontend/public"+tmpQ.rows[0].file);
        }
      }
    }

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/topicGroup${topicGroupId}`)) { fs.mkdirSync(`../frontend/public/_files/topicGroup${topicGroupId}`) }
      if (request.files.uploadFile.length > 1) {
        if (fileTypeList.length > request.files.uploadFile.length) throw ("Uploaded file type list longer than uploaded files");
        else if (fileTypeList.length < 0) throw ("Uploaded file type list shorter than uploaded files");
        var typeCounter = 0;
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO topic_group_files(id, name, file, type, topic_group_id)
          VALUES(default, $1, $2, $3, $4)`, [file.name, (`/_files/topicGroup${topicGroupId}/${file.name}`), 
          fileTypeList[typeCounter], topicGroupId]);
          fs.writeFile(`../frontend/public/_files/topicGroup${topicGroupId}/${file.name}`, file.name, "binary", function (err) { if (err) throw err; });
          typeCounter+=1;
        }
      } else {
        if (fileTypeList.length > 1) throw ("Uploaded file type list longer than uploaded files");
        else if (fileTypeList.length < 0) throw ("Uploaded file type list shorter than uploaded files");
        await pool.query(`INSERT INTO topic_group_files(id, name, file, type, topic_group_id)
        VALUES(default, $1, $2, $3, $4)`, [request.files.uploadFile.name, 
        (`/_files/topicGroup${topicGroupId}/${request.files.uploadFile.name}`), fileTypeList[0], topicGroupId]);
        fs.writeFile(`../frontend/public/_files/topicGroup${topicGroupId}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// Delete a topic group
async function deleteTopicGroup (request, response) {
  try { 
    const topicGroupName = request.params.topicGroupName;

    let checkExist = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if (!checkExist.rows.length) throw (`Failed: Topic group {${topicGroupName}} doesn't exist in database`);

    await pool.query('DELETE FROM topic_group WHERE LOWER(name) = LOWER($1)',
    [topicGroupName]);

    if (fs.existsSync(`../frontend/public/_files/topicGroup${checkExist.rows[0].id}`)) { 
      fs.rmdir(`../frontend/public/_files/topicGroup${checkExist.rows[0].id}`, { recursive: true }, (err) => {
        if (err) { throw err; }
      }); 
    }

    response.status(200).json({success: true, deleted: topicGroupName});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// Delete topic
async function deleteTopic(request, response) {
  const topicGroupName = request.params.topicGroupName;
  const topicName = request.params.topicName;
  const idResp = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
  if (idResp.rows.length == 0) {
    response.status(400).json({error: "Could not find topic group"});
    return;
  }

  const topicGroupId = idResp.rows[0].id;
  let tmp = await pool.query(
    `SELECT id FROM topics WHERE LOWER(name) = LOWER($1) AND topic_group_id = $2`
  , [topicName, topicGroupId]);
  if (tmp.rows.length == 0) {
    response.status(400).json({error: "Could not find topic in database"});
    return;
  }

  if (fs.existsSync(`../frontend/public/_files/topicGroup${idResp.rows[0].id}/topic${tmp.rows[0].id}`)) { 
    fs.rmdir(`../frontend/public/_files/topicGroup${idResp.rows[0].id}/topic${tmp.rows[0].id}`, { recursive: true }, (err) => {
      if (err) { throw err; }
    }); 
  }

  const topicId = tmp.rows[0].id;
  await pool.query(`DELETE FROM prerequisites WHERE topic = $1 or prereq = $1`, [topicId]);
  await pool.query(`DELETE FROM topics WHERE id = $1`, [topicId]);
  response.status(200).json({ success: true, topicId: topicId});
}

// Update topic details
async function putTopic (request, response) {
  try {
    const topicName = request.params.topicName;
    const newName = request.body.name;
    const topicGroupName = request.params.topicGroupName;

    let tgReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if (!tgReq.rows.length) throw (`Failed: topic group {${topicGroupName}} does not exist`);

    let tReq = await pool.query(`SELECT id FROM topics WHERE LOWER(name) = LOWER($1)`, [topicName]);
    if (!tReq.rows.length) throw (`Failed: topic {${topicName}} does not exist`);

    const topicGroupId = tgReq.rows[0].id;
    const topicId = tReq.rows[0].id;
    const fileTypeList = request.body.uploadedFileTypes.split(",");

    await pool.query(`UPDATE topics SET name = $1 WHERE id = $2`, [newName, topicId]);

    if (request.body.fileDeleteList) {
      const fileDeleteList = request.body.fileDeleteList.split(",");
      if (fileDeleteList.length) {  // Deletes files specified in delete list
        for (const fileId of fileDeleteList) {
          let tmpQ = await pool.query(`DELETE FROM topic_files WHERE id = $1 RETURNING file`, [fileId]);
          fs.unlinkSync("../frontend/public"+tmpQ.rows[0].file);
        }
      }
    }

    // Checks if directory exists for topic group and topic and makes it
    if (!fs.existsSync(`../frontend/public/_files/topicGroup${topicGroupId}`)) {
      fs.mkdirSync(`../frontend/public/_files/topicGroup${topicGroupId}`); 
      fs.mkdirSync(`../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}`); 
    } else if (!fs.existsSync(`../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}`)) {
      fs.mkdirSync(`../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}`); 
    }

    if (request.files != null) {
      if (request.files.uploadFile.length > 1) {
        if (fileTypeList.length > request.files.uploadFile.length) throw ("Uploaded file type list longer than uploaded files");
        else if (fileTypeList.length < 0) throw ("Uploaded file type list shorter than uploaded files");
        var typeCounter = 0;
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO topic_files(id, name, file, type, topic_id)
          VALUES(default, $1, $2, $3, $4)`, [file.name, (`/_files/topicGroup${topicGroupId}/topic${topicId}/${file.name}`), 
          fileTypeList[typeCounter], topicId]);
          fs.writeFile(`../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}/${file.name}`, file.name, "binary", function (err) { if (err) throw err; });
          typeCounter+=1;
        }
      } else {
        if (fileTypeList.length > 1) throw ("Uploaded file type list longer than uploaded files");
        else if (fileTypeList.length < 0) throw ("Uploaded file type list shorter than uploaded files");
        await pool.query(`INSERT INTO topic_files(id, name, file, type, topic_id)
        VALUES(default, $1, $2, $3, $4)`, [request.files.uploadFile.name, 
        (`/_files/topicGroup${topicGroupId}/topic${topicId}/${request.files.uploadFile.name}`), fileTypeList[0], topicId]);
        fs.writeFile(`../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }

    response.status(200).json({success: true, topic: topicId});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

async function postTopic (request, response) {
  try {
    const topicGroupName = request.params.topicGroupName;
    const topicName = request.params.topicName;
    const idResp = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if (idResp.rows.length == 0) throw ("Could not find topic group");
    const topicGroupId = idResp.rows[0].id;
    const fileTypeList = request.body.uploadedFileTypes.split(",");

    let resp = await pool.query(
      'INSERT INTO topics(id, topic_group_id, name) values(default, $1, $2) RETURNING id',
      [topicGroupId, topicName]);
    const topicId = resp.rows[0].id;
    
    /* let tmp = await pool.query(
      `SELECT id FROM topics WHERE name = $1 AND topic_group_id = $2`
    , [topicName, topicGroupId]);
    if (tmp.rows.length == 0) throw ("Could not find newly created topic in database");
    let topicId = tmp.rows[0]; */

    // Checks if directory exists for topic group and topic and makes it
    if (!fs.existsSync(`../frontend/public/_files/topicGroup${topicGroupId}`)) {
      fs.mkdirSync(`../frontend/public/_files/topicGroup${topicGroupId}`); 
      fs.mkdirSync(`../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}`); 
    } else if (!fs.existsSync(`../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}`)) {
      fs.mkdirSync(`../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}`); 
    }

    if (request.files != null) {
      if (request.files.uploadFile.length > 1) {
        if (fileTypeList.length > request.files.uploadFile.length) throw ("Uploaded file type list longer than uploaded files");
        else if (fileTypeList.length < 0) throw ("Uploaded file type list shorter than uploaded files");
        var typeCounter = 0;
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO topic_files(id, name, file, type, topic_id)
          VALUES(default, $1, $2, $3, $4)`, [file.name, (`/_files/topicGroup${topicGroupId}/topic${topicId}/${file.name}`), 
          fileTypeList[typeCounter], topicId]);
          fs.writeFile(`../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}/${file.name}`, file.name, "binary", function (err) { if (err) throw err; });
          typeCounter+=1;
        }
      } else {
        if (fileTypeList.length > 1) throw ("Uploaded file type list longer than uploaded files");
        else if (fileTypeList.length < 0) throw ("Uploaded file type list shorter than uploaded files");
        await pool.query(`INSERT INTO topic_files(id, name, file, type, topic_id)
        VALUES(default, $1, $2, $3, $4)`, [request.files.uploadFile.name, 
        (`/_files/topicGroup${topicGroupId}/topic${topicId}/${request.files.uploadFile.name}`), fileTypeList[0], topicId]);
        fs.writeFile(`../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }

    response.status(200).json({success: true, topic: topicId});
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get topic files
async function getTopicFile (request, response) {
  try {
    const topicGroupName = request.params.topicGroupName;
    const topicName = request.params.topicName;

    // Checks topicgroup and topic validity
    let tgResp = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if (!tgResp.rows.length) throw (`Failed: Topic group {${topicGroupName}} does not exist.`);

    let tnResp = await pool.query(`SELECT id FROM topics WHERE LOWER(name) = LOWER($1) AND topics.topic_group_id = $2`, 
    [topicName, tgResp.rows[0].id]);
    if (!tnResp.rows.length) throw (`Failed: Topic {${topicName}} does not exist.`);

    let resp = await pool.query(`SELECT * FROM topic_files WHERE topic_id = $1`, [tnResp.rows[0].id]);

    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).json({error: e});
  }
}


/***************************************************************
                    Enrollment Functions
***************************************************************/
/**
 * Generates a random alphanumeric string of a specified lenght
 * @param {number} the length of the required string 
 * @returns a random alphanumeric string
 */
const randomString = (length) => {
  let result = ''
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmonpqrstuvwxyz0123456789'
  let charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result;
}


async function generateCode (request, response) {
  const topicGroupName = request.params.topicGroupName
  try {
    //Validate Token
    let zId = await getZIdFromAuthorization(request.header('Authorization'))
    if (zId == null) {
      response.status(403).send({ error:"Invalid Token" })
      throw "Invalid Token"
    }
    //TODO check if zid is admin

    //lookup topic group name to get corresponding id
    let resp = await pool.query(
      `SELECT id FROM topic_group WHERE name = $1`, [topicGroupName]
    )
    if (resp.rows.length === 0) {
      response.status(400).send(`No topic group with name ${topicGroupName}`)
      throw `No topic group with name ${topicGroupName}`
    }
    const topicGroupId = resp.rows[0].id

    //generate a code, insert into db
    const code = randomString(8) // TODO check code uniqueness

    // TODO figure out optional parameters

    if (request.body.hasOwnProperty('uses')) {
      const uses = request.body.uses
      if (request.body.hasOwnProperty('expiration')) {
        const expiration = request.body.expiration
        let insResp = await pool.query(
          `INSERT INTO enroll_codes(id, code, topic_group_id, uses, expiration) VALUES(default, $1, $2, $3, $4)`, [code, topicGroupId, uses, expiration]
        )
      } else {
        let insResp = await pool.query(
          `INSERT INTO enroll_codes(id, code, topic_group_id, uses) VALUES(default, $1, $2, $3)`, [code, topicGroupId, uses]
        )
      }
    } else {
      if (request.body.hasOwnProperty('expiration')) {
        const expiration = request.body.expiration
        let insResp = await pool.query(
          `INSERT INTO enroll_codes(id, code, topic_group_id, expiration) VALUES(default, $1, $2, $3)`, [code, topicGroupId, expiration]
        )
      } else {
        let insResp = await pool.query(
          `INSERT INTO enroll_codes(id, code, topic_group_id) VALUES(default, $1, $2)`, [code, topicGroupId]
        )
      }
    }
    //return the code
    response.status(200).send(code)

  } catch (e) {
    console.log(e)
  }
}

/***************************************************************
                       Forum Functions
***************************************************************/

async function getAllForumPosts (request, response) {
  try {
    const topicGroupName = request.params.topicGroup
    const tmpQ = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    const topicGroupId = tmpQ.rows[0].id;
    let resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, 
      fp.isPinned, fp.related_link, fp.isEndorsed, fp.num_of_upvotes, fp.topic_group,
      array_agg(DISTINCT uv.user_id) as upvoters, array_agg(DISTINCT file.id) as attachments, 
      array_agg(DISTINCT t.tag_id) as tags, array_agg(DISTINCT r.reply_id) as replies, 
      array_agg(DISTINCT comments.comment_id) as comments
      FROM forum_posts fp
      LEFT JOIN post_tags pt ON pt.post_id = fp.post_id
      LEFT JOIN tags t ON t.tag_id = pt.tag_id
      LEFT JOIN post_replies pr ON pr.post_id = fp.post_id
      LEFT JOIN replies r ON r.reply_id = pr.reply_id
      LEFT JOIN post_comments pc ON pc.post_id = fp.post_id
      LEFT JOIN comments ON comments.comment_id = pc.comment_id
      LEFT JOIN forum_post_files file ON file.post_id = fp.post_id
      LEFT JOIN upvotes uv ON uv.post_id = fp.post_id
      WHERE fp.topic_group = $1
      GROUP BY fp.post_id`, [topicGroupId]);

    for (var object of resp.rows) {
      var tagsArr = [];
      var repliesArr = [];
      var commentsArr = [];
      var upvArr = [];
      var fileArr = [];

      for (const upvId of object.upvoters) {
        let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [upvId]);
        upvArr.push(tmp.rows[0]);
      }

      for (const tagId of object.tags) {
        let tmp = await pool.query(`SELECT * FROM tags WHERE tag_id = $1`, [tagId]);
        tagsArr.push(tmp.rows[0]);
      };
  
      for (const replyId of object.replies) {
        let tmp = await pool.query(`SELECT * FROM replies WHERE reply_id = $1`, [replyId]);
        repliesArr.push(tmp.rows[0]);
      };

      for (const commentId of object.comments) {
        let tmp = await pool.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId]);
        commentsArr.push(tmp.rows[0]);
      };

      for (const fileId of object.attachments) {
        let tmp = await pool.query(`SELECT * FROM forum_post_files WHERE id = $1`, [fileId]);
        fileArr.push(tmp.rows[0]);
      }

      object.upvoters = upvArr;
      object.tags = tagsArr;
      object.replies = repliesArr;
      object.comments = commentsArr;
      object.attachments = fileArr;
    }
    console.log(resp.rows)
    response.status(200).json(resp.rows);
  } catch (e) {
    console.log(e)
    response.status(400).send(e.detail);
  }
}

// Get all pinned forum posts
async function getAllPinnedPosts (request, response) {
  try {
    const topicGroupName = request.params.topicGroup
    const tmpQ = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    const topicGroupId = tmpQ.rows[0].id;
    let resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, 
      fp.isPinned, fp.related_link, fp.isEndorsed, fp.num_of_upvotes, 
      array_agg(DISTINCT uv.user_id) as upvoters, array_agg(DISTINCT file.id) as attachments, 
      array_agg(DISTINCT t.tag_id) as tags, array_agg(DISTINCT r.reply_id) as replies, 
      array_agg(DISTINCT comments.comment_id) as comments
      FROM forum_posts fp
      LEFT JOIN post_tags pt ON pt.post_id = fp.post_id
      LEFT JOIN tags t ON t.tag_id = pt.tag_id
      LEFT JOIN post_replies pr ON pr.post_id = fp.post_id
      LEFT JOIN replies r ON r.reply_id = pr.reply_id
      LEFT JOIN post_comments pc ON pc.post_id = fp.post_id
      LEFT JOIN comments ON comments.comment_id = pc.comment_id
      LEFT JOIN forum_post_files file ON file.post_id = fp.post_id
      LEFT JOIN upvotes uv ON uv.post_id = fp.post_id
      WHERE fp.ispinned = TRUE
      AND fp.topic_group = $1
      GROUP BY fp.post_id`, [topicGroupId]);

      for (var object of resp.rows) {
        var tagsArr = [];
        var repliesArr = [];
        var commentsArr = [];
        var upvArr = [];
        var fileArr = [];
  
        for (const upvId of object.upvoters) {
          let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [upvId]);
          upvArr.push(tmp.rows[0]);
        }
  
        for (const tagId of object.tags) {
          let tmp = await pool.query(`SELECT * FROM tags WHERE tag_id = $1`, [tagId]);
          tagsArr.push(tmp.rows[0]);
        };
    
        for (const replyId of object.replies) {
          let tmp = await pool.query(`SELECT * FROM replies WHERE reply_id = $1`, [replyId]);
          repliesArr.push(tmp.rows[0]);
        };
  
        for (const commentId of object.comments) {
          let tmp = await pool.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId]);
          commentsArr.push(tmp.rows[0]);
        };
  
        for (const fileId of object.attachments) {
          let tmp = await pool.query(`SELECT * FROM forum_post_files WHERE id = $1`, [fileId]);
          fileArr.push(tmp.rows[0]);
        }
  
        object.upvoters = upvArr;
        object.tags = tagsArr;
        object.replies = repliesArr;
        object.comments = commentsArr;
        object.attachments = fileArr;
      }

    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).send(e.detail);
  }
}

// Get all posts related search term
async function getSearchPosts (request, response) {
  try {
    const topicGroupName = request.params.topicGroup
    const tmpQ = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    const topicGroupId = tmpQ.rows[0].id;
    const forumSearchTerm = request.params.forumSearchTerm;
    let resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, 
      fp.isPinned, fp.related_link, fp.isEndorsed, fp.num_of_upvotes, 
      array_agg(DISTINCT uv.user_id) as upvoters, array_agg(DISTINCT file.id) as attachments, 
      array_agg(DISTINCT t.tag_id) as tags, array_agg(DISTINCT r.reply_id) as replies, 
      array_agg(DISTINCT comments.comment_id) as comments
      FROM forum_posts fp
      LEFT JOIN post_tags pt ON pt.post_id = fp.post_id
      LEFT JOIN tags t ON t.tag_id = pt.tag_id
      LEFT JOIN post_replies pr ON pr.post_id = fp.post_id
      LEFT JOIN replies r ON r.reply_id = pr.reply_id
      LEFT JOIN post_comments pc ON pc.post_id = fp.post_id
      LEFT JOIN comments ON comments.comment_id = pc.comment_id
      LEFT JOIN forum_post_files file ON file.post_id = fp.post_id
      LEFT JOIN upvotes uv ON uv.post_id = fp.post_id
      WHERE LOWER (fp.title) LIKE LOWER($1)
      OR LOWER (fp.description) LIKE LOWER($1)
      AND fp.topic_group = $2
      GROUP BY fp.post_id`, [`%${forumSearchTerm}%`, topicGroupId]);

    for (var object of resp.rows) {
      var tagsArr = [];
      var repliesArr = [];
      var commentsArr = [];
      var upvArr = [];
      var fileArr = [];

      for (const upvId of object.upvoters) {
        let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [upvId]);
        upvArr.push(tmp.rows[0]);
      }

      for (const tagId of object.tags) {
        let tmp = await pool.query(`SELECT * FROM tags WHERE tag_id = $1`, [tagId]);
        tagsArr.push(tmp.rows[0]);
      };
  
      for (const replyId of object.replies) {
        let tmp = await pool.query(`SELECT * FROM replies WHERE reply_id = $1`, [replyId]);
        repliesArr.push(tmp.rows[0]);
      };

      for (const commentId of object.comments) {
        let tmp = await pool.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId]);
        commentsArr.push(tmp.rows[0]);
      };

      for (const fileId of object.attachments) {
        let tmp = await pool.query(`SELECT * FROM forum_post_files WHERE id = $1`, [fileId]);
        fileArr.push(tmp.rows[0]);
      }

      object.upvoters = upvArr;
      object.tags = tagsArr;
      object.replies = repliesArr;
      object.comments = commentsArr;
      object.attachments = fileArr;
    }

    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get all posts related tag term
async function getFilterPosts (request, response) {
  try {
    const topicGroupName = request.params.topicGroup
    const tmpQ = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    const topicGroupId = tmpQ.rows[0].id;
    const forumFilterTerm = request.params.forumFilterTerm;
    let resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, 
      fp.isPinned, fp.related_link, fp.isEndorsed, fp.num_of_upvotes, 
      array_agg(DISTINCT uv.user_id) as upvoters, array_agg(DISTINCT file.id) as attachments, 
      array_agg(DISTINCT t.tag_id) as tags, array_agg(DISTINCT r.reply_id) as replies, 
      array_agg(DISTINCT comments.comment_id) as comments
      FROM forum_posts fp
      LEFT JOIN post_tags pt ON pt.post_id = fp.post_id
      LEFT JOIN tags t ON t.tag_id = pt.tag_id
      LEFT JOIN post_replies pr ON pr.post_id = fp.post_id
      LEFT JOIN replies r ON r.reply_id = pr.reply_id
      LEFT JOIN post_comments pc ON pc.post_id = fp.post_id
      LEFT JOIN comments ON comments.comment_id = pc.comment_id
      LEFT JOIN forum_post_files file ON file.post_id = fp.post_id
      LEFT JOIN upvotes uv ON uv.post_id = fp.post_id
      WHERE LOWER(t.name) LIKE LOWER($1)
      AND fp.topic_group = $2
      GROUP BY fp.post_id`, [`%${forumFilterTerm}%`, topicGroupId]);

      for (var object of resp.rows) {
        var tagsArr = [];
        var repliesArr = [];
        var commentsArr = [];
        var upvArr = [];
        var fileArr = [];
  
        for (const upvId of object.upvoters) {
          let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [upvId]);
          upvArr.push(tmp.rows[0]);
        }
  
        for (const tagId of object.tags) {
          let tmp = await pool.query(`SELECT * FROM tags WHERE tag_id = $1`, [tagId]);
          tagsArr.push(tmp.rows[0]);
        };
    
        for (const replyId of object.replies) {
          let tmp = await pool.query(`SELECT * FROM replies WHERE reply_id = $1`, [replyId]);
          repliesArr.push(tmp.rows[0]);
        };
  
        for (const commentId of object.comments) {
          let tmp = await pool.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId]);
          commentsArr.push(tmp.rows[0]);
        };
  
        for (const fileId of object.attachments) {
          let tmp = await pool.query(`SELECT * FROM forum_post_files WHERE id = $1`, [fileId]);
          fileArr.push(tmp.rows[0]);
        }
  
        object.upvoters = upvArr;
        object.tags = tagsArr;
        object.replies = repliesArr;
        object.comments = commentsArr;
        object.attachments = fileArr;
      }

    response.status(200).json(resp.rows);
  } catch (e) {
    response.send(e);
  }
}

// Create new post on forum (TAGS MUST ALREADY EXIST and USER MUST EXIST)
async function postForum (request, response) {
  try {
    const title = request.body.title;
    const user_id = request.body.user_id;
    const authReq = await pool.query(`SELECT name FROM users WHERE id = $1`, [user_id]);

    if (!authReq.rows[0]) { throw (`User does not exist with id: ${user_id}`); }

    const author = authReq.rows[0].name;
    const publishedDate = request.body.publishedDate;
    const description = request.body.description;
    const related_link = request.body.related_link;

    const topicGroupName = request.params.topicGroup
    const tmpQ = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    const topicGroupId = tmpQ.rows[0].id;
  
    let resp = await pool.query(
      `INSERT INTO forum_posts(post_id, title, user_id, 
        author, published_date, description, isPinned, related_link, num_of_upvotes, isEndorsed, topic_group) 
        values(default, $1, $2, $3, $4, $5, false, $6, 0, false, $7) 
        RETURNING post_id`,
      [title, user_id, author, publishedDate, description, related_link, topicGroupId]);
  
    if (request.body.tags) {
      const tags = request.body.tags.split(",");
      if (tags.length) {
        for (const tag of tags) { // Insert linked tags
          await pool.query(`INSERT INTO post_tags(post_id, tag_id) VALUES($1, $2)`, 
          [resp.rows[0].post_id, tag]);
        }
      }
    }
    
    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/forum_post${resp.rows[0].post_id}`)) { 
        fs.mkdirSync(`../frontend/public/_files/forum_post${resp.rows[0].post_id}`) 
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO forum_post_files(id, name, file, post_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`/_files/forum_post${resp.rows[0].post_id}/${file.name}`), 
          resp.rows[0].post_id]);
          fs.writeFile(`../frontend/public/_files/forum_post${resp.rows[0].post_id}/${file.name}`, file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO forum_post_files(id, name, file, post_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`/_files/forum_post${resp.rows[0].post_id}/${request.files.uploadFile.name}`), resp.rows[0].post_id]);
        fs.writeFile(`../frontend/public/_files/forum_post${resp.rows[0].post_id}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }

    response.sendStatus(200);
  } catch (e) {
    console.log(e)
    response.status(400).send(e);
  }
};

// Get post details of selected post
async function getPostById (request, response) {
  try {
    const postId = request.params.postId;

    let resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, 
      fp.isPinned, fp.related_link, fp.isEndorsed, fp.num_of_upvotes, 
      array_agg(DISTINCT uv.user_id) as upvoters, array_agg(DISTINCT file.id) as attachments, 
      array_agg(DISTINCT t.tag_id) as tags, array_agg(DISTINCT r.reply_id) as replies, 
      array_agg(DISTINCT comments.comment_id) as comments
      FROM forum_posts fp
      LEFT JOIN post_tags pt ON pt.post_id = fp.post_id
      LEFT JOIN tags t ON t.tag_id = pt.tag_id
      LEFT JOIN post_replies pr ON pr.post_id = fp.post_id
      LEFT JOIN replies r ON r.reply_id = pr.reply_id
      LEFT JOIN post_comments pc ON pc.post_id = fp.post_id
      LEFT JOIN comments ON comments.comment_id = pc.comment_id
      LEFT JOIN forum_post_files file ON file.post_id = fp.post_id
      LEFT JOIN upvotes uv ON uv.post_id = fp.post_id
      WHERE fp.post_id = $1
      GROUP BY fp.post_id`, [postId]);

    for (var object of resp.rows) {
      var tagsArr = [];
      var repliesArr = [];
      var commentsArr = [];
      var upvArr = [];
      var fileArr = [];

      for (const upvId of object.upvoters) {
        let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [upvId]);
        upvArr.push(tmp.rows[0]);
      }

      for (const tagId of object.tags) {
        let tmp = await pool.query(`SELECT * FROM tags WHERE tag_id = $1`, [tagId]);
        tagsArr.push(tmp.rows[0]);
      };
  
      for (const replyId of object.replies) { // forum reply files
        var replyFileArr = [];

        let tmp = await pool.query(`
        SELECT r.reply_id, r.user_id, r.author, r.published_date, r.reply,
        array_agg(file.id) as attachments
        FROM replies r
        LEFT JOIN forum_reply_files file ON file.reply_id = r.reply_id
        WHERE r.reply_id = $1
        GROUP BY r.reply_id`, [replyId]);
        
        if (!tmp.rows[0]) {
          continue
        }

        for (const fileId of tmp.rows[0].attachments) { 
          let tmp = await pool.query(`SELECT * FROM forum_reply_files WHERE id = $1`, [fileId]);
          replyFileArr.push(tmp.rows[0]);
        }
        tmp.rows[0].attachments = replyFileArr;
        repliesArr.push(tmp.rows[0]);
      };

      for (const commentId of object.comments) { // forum comment files
        var commentFileArr = [];

        let tmp = await pool.query(`
        SELECT c.comment_id, c.user_id, c.author, c.published_date, c.comment, c.isEndorsed,
        array_agg(file.id) as attachments
        FROM comments c
        LEFT JOIN forum_comment_files file ON file.comment_id = c.comment_id
        WHERE c.comment_id = $1
        GROUP BY c.comment_id`, [commentId]);

        if (!tmp.rows[0]) {
          continue
        }

        for (const fileId of tmp.rows[0].attachments) {
          let tmp = await pool.query(`SELECT * FROM forum_comment_files WHERE id = $1`, [fileId]);
          commentFileArr.push(tmp.rows[0]);
        }
        tmp.rows[0].attachments = commentFileArr;
        commentsArr.push(tmp.rows[0]);
      };

      for (const fileId of object.attachments) { // forum post files
        let tmp = await pool.query(`SELECT * FROM forum_post_files WHERE id = $1`, [fileId]);
        fileArr.push(tmp.rows[0]);
      }

      object.upvoters = upvArr;
      object.tags = tagsArr;
      object.replies = repliesArr;
      object.comments = commentsArr;
      object.attachments = fileArr;
    }

    response.status(200).json(resp.rows[0]);
  } catch (e) {
    console.log(e)
    response.status(400).send(e.detail);
  }
};

// Update post details
async function putPost (request, response) {
  try {
    const postId = request.params.postId;
    const newDesc = request.body.description;
    const relLink = request.body.related_link;

    // Deletes files specified in delete list
    if (request.body.fileDeleteList) {
      const deleteList = request.body.fileDeleteList.split(",");
      for (const fileId of deleteList) {
        let fileResp = await pool.query(`DELETE FROM forum_post_files WHERE id = $1 RETURNING file`, [fileId]);
        fs.unlinkSync("../frontend/public" + fileResp.rows[0].file);
      }
    }

    await pool.query(`UPDATE forum_posts SET description = $1, related_link = $2 WHERE post_id = $3`,
    [newDesc, relLink, postId]);

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/forum_post${postId}`)) { 
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}`) 
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO forum_post_files(id, name, file, post_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`/_files/forum_post${postId}/${file.name}`), 
          postId]);
          fs.writeFile(`../frontend/public/_files/forum_post${postId}/${file.name}`, file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO forum_post_files(id, name, file, post_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`/_files/forum_post${postId}/${request.files.uploadFile.name}`), postId]);
        fs.writeFile(`../frontend/public/_files/forum_post${postId}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
  }
};

// delete forum post
async function deletePost (request, response) {
  try {
    const postId = request.params.postId;
     await pool.query(`DELETE FROM forum_posts WHERE post_id = $1`, [postId]);
     if (fs.existsSync(`../frontend/public/_files/forum_post${postId}`)) { 
      fs.rmdir(`../frontend/public/_files/forum_post${postId}`, { recursive: true }, (err) => {
        if (err) { throw err; }
      }); 
    }
    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e.detail);
  }
};

// Create new reply
async function postReply (request, response) {
  try {
    const user_id = request.body.user_id;
    const authReq = await pool.query(`SELECT name FROM users WHERE id = $1`, [user_id]);

    if (typeof authReq.rows[0].name == 'undefined') { throw (`User doesn't exist with id: ${user_id}`) }

    const author = authReq.rows[0].name;
    const postId = request.params.postId;
    const reply = request.body.reply;

    let resp = await pool.query(
      `INSERT INTO replies(reply_id, user_id, author, published_date, reply) 
      VALUES(default, $1, $2, CURRENT_TIMESTAMP, $3) RETURNING reply_id`,
      [user_id, author, reply]);

    await pool.query(`INSERT INTO post_replies(post_id, reply_id) 
    VALUES($1, $2)`, [postId, resp.rows[0].reply_id]);

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/forum_post${postId}`)) { 
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}`);
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}/reply${resp.rows[0].reply_id}`);
      } else if (!fs.existsSync(`../frontend/public/_files/forum_post${postId}/reply${resp.rows[0].reply_id}`)) {
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}/reply${resp.rows[0].reply_id}`);
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO forum_reply_files(id, name, file, reply_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`/_files/forum_post${postId}/reply${resp.rows[0].reply_id}/${file.name}`), 
          postId]);
          fs.writeFile(`../frontend/public/_files/forum_post${postId}/reply${resp.rows[0].reply_id}/${file.name}`, 
          file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO forum_reply_files(id, name, file, reply_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`/_files/forum_post${postId}/reply${resp.rows[0].reply_id}/${request.files.uploadFile.name}`), postId]);
        fs.writeFile(`../frontend/public/_files/forum_post${postId}/reply${resp.rows[0].reply_id}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }
  
    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Update post reply with id
async function putPostReply (request, response) {
  try {
    const replyId = request.params.replyId;
    const postId = request.params.postId;
    const newReply = request.body.reply;

    if (request.body.fileDeleteList) {
      const deleteList = request.body.fileDeleteList.split(",");
      for (const fileId of deleteList) {
        let fileResp = await pool.query(`DELETE FROM forum_reply_files WHERE id = $1 RETURNING file`, [fileId]);
        fs.unlinkSync("../frontend/public" + fileResp.rows[0].file);
      }
    }

    await pool.query(`UPDATE replies SET reply = $1 WHERE reply_id = $2`, [newReply, replyId]);

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/forum_post${postId}`)) { 
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}`);
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}/reply${replyId}`);
      } else if (!fs.existsSync(`../frontend/public/_files/forum_post${postId}/reply${replyId}`)) {
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}/reply${replyId}`);
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO forum_reply_files(id, name, file, reply_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`/_files/forum_post${postId}/reply${replyId}/${file.name}`), 
          postId]);
          fs.writeFile(`../frontend/public/_files/forum_post${postId}/reply${replyId}/${file.name}`, 
          file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO forum_reply_files(id, name, file, reply_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`/_files/forum_post${postId}/reply${replyId}/${request.files.uploadFile.name}`), postId]);
        fs.writeFile(`../frontend/public/_files/forum_post${postId}/reply${replyId}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e.detail);
  }
};

// Update post reply with id
async function deletePostReply (request, response) {
  try {
    const replyId = request.params.replyId;
    const postId = request.params.postId;
    await pool.query(`DELETE FROM replies WHERE reply_id = $1`, [replyId]);
    if (fs.existsSync(`../frontend/public/_files/forum_post${postId}/reply${replyId}`)) { 
      fs.rmdir(`../frontend/public/_files/forum_post${postId}/reply${replyId}`, { recursive: true }, (err) => {
        if (err) { throw err; }
      }); 
    }

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e.detail);
  }
};

// Post new comment
async function postComment (request, response) {
  try {
    const user_id = request.body.user_id;
    const authReq = await pool.query(`SELECT name FROM users WHERE id = $1`, [user_id]);
    if (typeof authReq.rows[0].name == 'undefined') { throw (`User doesn't exist with id: ${user_id}`) }
    const author = authReq.rows[0].name;
    const postId = request.params.postId;
    const comment = request.body.comment;

    let resp = await pool.query(
      `INSERT INTO comments(comment_id, user_id, author, published_date, comment, isEndorsed) 
      VALUES(default, $1, $2, CURRENT_TIMESTAMP, $3, false) RETURNING comment_id`,
      [user_id, author, comment]);
  
    await pool.query(`INSERT INTO post_comments(post_id, comment_id) 
    VALUES($1, $2)`, [postId, resp.rows[0].comment_id]);

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/forum_post${postId}`)) { 
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}`);
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}/comment${resp.rows[0].comment_id}`);
      } else if (!fs.existsSync(`../frontend/public/_files/forum_post${postId}/comment${resp.rows[0].comment_id}`)) {
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}/comment${resp.rows[0].comment_id}`);
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO forum_comment_files(id, name, file, comment_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`/_files/forum_post${postId}/comment${resp.rows[0].comment_id}/${file.name}`), 
          postId]);
          fs.writeFile(`../frontend/public/_files/forum_post${postId}/comment${resp.rows[0].comment_id}/${file.name}`, 
          file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO forum_comment_files(id, name, file, comment_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`/_files/forum_post${postId}/comment${resp.rows[0].comment_id}/${request.files.uploadFile.name}`), postId]);
        fs.writeFile(`../frontend/public/_files/forum_post${postId}/comment${resp.rows[0].comment_id}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Put comment
async function putComment (request, response) {
  try {
    const postId = request.params.postId;
    const commentId = request.params.commentId;
    const commentDescription = request.body.comment;

    if (request.body.fileDeleteList) {
      const deleteList = request.body.fileDeleteList.split(",");
      for (const fileId of deleteList) {
        let fileResp = await pool.query(`DELETE FROM forum_comment_files WHERE id = $1 RETURNING file`, [fileId]);
        fs.unlinkSync("../frontend/public" + fileResp.rows[0].file);
      }
    }

    await pool.query(
      `UPDATE comments SET comment = $1 WHERE comment_id = $2`,
      [commentDescription, commentId]);

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/forum_post${postId}`)) { 
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}`);
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}/comment${commentId}`);
      } else if (!fs.existsSync(`../frontend/public/_files/forum_post${postId}/comment${commentId}`)) {
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}/comment${commentId}`);
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO forum_comment_files(id, name, file, comment_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`/_files/forum_post${postId}/comment${commentId}/${file.name}`), 
          postId]);
          fs.writeFile(`../frontend/public/_files/forum_post${postId}/comment${commentId}/${file.name}`, 
          file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO forum_comment_files(id, name, file, comment_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`/_files/forum_post${postId}/comment${commentId}/${request.files.uploadFile.name}`), postId]);
        fs.writeFile(`../frontend/public/_files/forum_post${postId}/comment${commentId}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e.detail);
  }
};

// Delete new comment
async function deleteComment (request, response) {
  try {
    const commentId = request.params.commentId;
    const postId = request.params.postId;
    await pool.query(`DELETE FROM comments WHERE comment_id = $1`, [commentId]);
    if (fs.existsSync(`../frontend/public/_files/forum_post${postId}/comment${commentId}`)) { 
      fs.rmdir(`../frontend/public/_files/forum_post${postId}/comment${commentId}`, { recursive: true }, (err) => {
        if (err) { throw err; }
      }); 
    }

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e.detail);
  }
};

// Endorses or un-endorses forum post comment
async function putCommentEndorse (request, response) {
  try {
    const commentId = request.params.commentId;
    const isEndorsed = request.params.isEndorsed;
    await pool.query(`UPDATE comments SET isendorsed = $1 WHERE comment_id = $2`, [isEndorsed, commentId]);

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e.detail);
  }
}

// Pins or unpins forum post
async function putPostPin (request, response) {
  try {
    const postId = request.params.postId;
    const isPinned = request.params.isPinned;

    await pool.query(`UPDATE forum_posts SET ispinned = $1 WHERE post_id = $2`,
    [isPinned, postId]);

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
  }
}

// Gets all tags (topic group or ALL)
async function getAllTags (request, response) {
  try {
    let resp;

    if (request.body.topicGroupName) { // If topic group specified then get tags for topic group only
      const topicGroupName = request.body.topicGroupName;
      let topicGroupReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) LIKE LOWER($1)`, [topicGroupName]);
      if (!topicGroupReq.rows.length) throw (`Topic Group '${topicGroupName}' does not exist`);

      const topicGroupId = topicGroupReq.rows[0].id;
      resp = await pool.query(`SELECT * FROM tags WHERE topic_group_id = $1`, [topicGroupId]);
    } else { // No topic group specified (get all tags)
      resp = await pool.query(`SELECT * FROM tags`);
    }

    response.status(200).json(resp.rows);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Gets one tag
async function getTag (request, response) {
  try {
    const tagId = request.params.tagId;
    let resp = await pool.query(`SELECT * FROM tags WHERE tag_id = $1`, [tagId]);
    if (!resp.rows.length) throw ("Tag id not found");
    response.status(200).json(resp.rows[0]);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Posts tag
async function postTag (request, response) {
  try {
    const tagName = request.body.tagName;
    const topicGroupName = request.body.topicGroupName;
    
    const topicGroupReq = await pool.query(`SELECT id FROM topic_group 
    WHERE LOWER(name) LIKE LOWER($1)`, [topicGroupName]);
    if (!topicGroupReq.rows.length) throw (`Topic Group '${topicGroupName}' does not exist`);
    const topicGroupId = topicGroupReq.rows[0].id;

    let dupTagCheck = await pool.query(`
    select exists(select * from tags where lower(name) like lower($1) AND topic_group_id = $2)`, [tagName, topicGroupId]);

    if (dupTagCheck.rows[0].exists) {
      response.status(400).json({ error: `Tag '${tagName}' already exists for topic group '${topicGroupName}`});
      return;
    } 

    await pool.query(`INSERT INTO tags(tag_id, topic_group_id, name) VALUES(default, $1, $2)`, [topicGroupId, tagName]);
    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
  } 
};

// Update tag
async function putTag (request, response) {
  try {
    let dupTagCheck = await pool.query(`select exists(select * from tags where lower(name) 
    like lower($1))`, [request.body.tagName]);

    if (dupTagCheck.rows[0].exists) {
      response.status(400).json({ error: `Tag '${tagName}' already exists`})
      return
    } 

    await pool.query(`UPDATE tags SET name = $1 WHERE tag_id = $2`, 
    [request.body.tagName, request.params.tagId]);
    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
  } 
};

// Posts tag
async function deleteTag (request, response) {
  try {
    const tagId = request.params.tagId;
    await pool.query(`DELETE FROM tags WHERE tag_id = $1`, [tagId]);
    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e.detail);
  } 
};

// Endorses or un-endorses forum post
async function putPostEndorse (request, response) {
  try {
    const postId = request.params.postId;
    const isEndorsed = request.params.isEndorsed;
    await pool.query(`UPDATE forum_posts SET isendorsed = $1 WHERE post_id = $2`, [isEndorsed, postId]);

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e.detail);
  }
}

// Likes a forum post
async function putPostLike (request, response) {
  try {
    const postId = request.params.postId;
    const userId = request.body.userId;

    const upvotesResp = await pool.query(`SELECT num_of_upvotes FROM forum_posts WHERE post_id = $1`, [postId])
    const upvotes = upvotesResp.rows[0].num_of_upvotes + 1

    // Add user to upvotes table and update forum_posts upvotes
    await pool.query(`INSERT INTO upvotes (post_id, user_id) VALUES ($1, $2)`, [postId, userId]);
    await pool.query(`UPDATE forum_posts SET num_of_upvotes = $1 WHERE post_id = $2`, [upvotes, postId]);

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e.detail);
  }
}

// Unlikes a forum post
async function putPostUnlike (request, response) {
  try {
    const postId = request.params.postId;
    const userId = request.body.userId;

    let upvotesResp = await pool.query(`SELECT num_of_upvotes FROM forum_posts WHERE post_id = $1`, [postId])
    const upvotes = upvotesResp.rows[0].num_of_upvotes === 0 ? upvotesResp.rows[0].num_of_upvotes : upvotesResp.rows[0].num_of_upvotes - 1

    // Delete user from upvotes table and update forum_posts upvotes
    await pool.query(`DELETE FROM upvotes WHERE post_id = $1 AND user_id = $2`, [postId, userId]);
    await pool.query(`UPDATE forum_posts SET num_of_upvotes = $1 WHERE post_id = $2`, [upvotes, postId]);

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
  }
}

/***************************************************************
                       Course Pages Functions
***************************************************************/

// Get all announcements of topic group / course
async function getAnnouncements (request, response) {
  try {
    const topicGroupName = request.params.topicGroup;
    const tmpQ = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    const topicGroupId = tmpQ.rows[0].id;
    let resp = await pool.query(
      `SELECT a.id, a.author, a.topic_group, a.title, a.content, a.post_date, 
      array_agg(c.id) as comments, array_agg(af.id) as attachments
      FROM announcements a
      LEFT JOIN announcement_comment c ON c.announcement_id = a.id
      LEFT JOIN announcement_files af ON af.announcement_id = a.id
      WHERE a.topic_group = $1
      GROUP BY a.id`, [topicGroupId]);

    for (const object of resp.rows) {
      var fileArr = [];
      var commentArr = [];
      for (const attachment of object.attachments) {
        if (attachment != null) { 
          let fileQ = await pool.query(`
          SELECT id, name, file
          FROM announcement_files WHERE announcement_id = $1 AND id = $2
          `, [object.id, attachment])
          fileArr.push(fileQ.rows[0]);
        }
      }

      if (object.comments.length) {
        for (const comment of object.comments) {
          let commQ = await pool.query(`
          SELECT id, author, content, post_date
          FROM announcement_comment WHERE announcement_id = $1 AND id = $2
          `, [object.id, comment])
          commentArr.push(commQ.rows[0]);
        }
      }
      
      object.attachments = fileArr;
      object.comments = commentArr;
    }

    response.status(200).json(resp.rows);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get announcement by id 
async function getAnnouncementById (request, response) {
  try {
    const announcementId = request.params.announcementId;
    let resp = await pool.query(`
      SELECT a.id, a.author, a.topic_group, a.title, a.content, a.post_date,
      array_agg(c.id) as comments, array_agg(af.id) as attachments
      FROM announcements a
      LEFT JOIN announcement_comment c ON c.announcement_id = a.id
      LEFT JOIN announcement_files af ON af.announcement_id = a.id
      WHERE a.id = $1
      GROUP BY a.id
    `, [announcementId]);

    var fileArr = [];
    var commArr = [];

    console.log(resp.rows)

    if (resp.rows[0].comments.length && resp.rows[0].comments[0] !== null) {
      for (const commId of resp.rows[0].comments) {
        let commQ = await pool.query(
        `SELECT ac.id, ac.author, ac.content, ac.post_date, array_agg(acf.id) as attachments
        FROM announcement_comment ac 
        LEFT JOIN announcement_comment_files acf ON acf.comment_id = ac.id 
        WHERE ac.id = $1
        GROUP BY ac.id`, [commId]);

        var commFileArr = [];
        if (commQ.rows[0].attachments.length) {
          for (const file of commQ.rows[0].attachments) {
            let commFileQ = await pool.query(`
            SELECT id, name, file FROM announcement_comment_files 
            WHERE id = $1`, [file]);
            commFileArr.push(commFileQ.rows[0]);
          }
          commQ.rows[0].attachments = commFileArr;
        }
        commArr.push(commQ.rows[0]);
      }
      resp.rows[0].comments = commArr;
    }

    if (resp.rows[0].attachments[0] !== null) {
      for (const attachment of resp.rows[0].attachments) {
        if (attachment != null) { 
          let fileQ = await pool.query(`
          SELECT id, name, file
          FROM announcement_files WHERE announcement_id = $1 AND id = $2
          `, [announcementId, attachment])
          fileArr.push(fileQ.rows[0]);
        }
      }
    }
    resp.rows[0].attachments = fileArr;

    response.status(200).json(resp.rows[0]);
  } catch (e) {
    console.log(e)
    response.status(400).send(e);
  }
};

// Create new announcement for topic group / course
async function postAnnouncement (request, response) {
  try {
    const topicGroupName = request.params.topicGroup;
    const tmpQ = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    const topic_group = tmpQ.rows[0].id;
    const user_id = request.body.user_id;
    const title = request.body.title;
    const description = request.body.description;

    let resp = await pool.query(
      `INSERT INTO announcements(id, author, topic_group, title, content, post_date) 
      VALUES(default, $1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id`,
      [user_id, topic_group, title, description])

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/announcement${resp.rows[0].id}`)) { fs.mkdirSync(`../frontend/public/_files/announcement${resp.rows[0].id}`) }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO announcement_files(id, name, file, announcement_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`/_files/announcement${resp.rows[0].id}/${file.name}`), 
          resp.rows[0].id]);
          fs.writeFile(`../frontend/public/_files/announcement${resp.rows[0].id}/${file.name}`, file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO announcement_files(id, name, file, announcement_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`/_files/announcement${resp.rows[0].id}/${request.files.uploadFile.name}`), resp.rows[0].id]);
        fs.writeFile(`../frontend/public/_files/announcement${resp.rows[0].id}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Update announcement by id
async function putAnnouncement (request, response) {
  try {
    const announcementId = request.params.announcementId;
    const title = request.body.title;
    const content = request.body.content;

    await pool.query(`UPDATE announcements SET title = $1, content = $2
    WHERE id = $3`, [title, content, announcementId]);

    if (request.body.fileList) {
      const fileDeleteList = request.body.fileList.split(",");
      if (fileDeleteList.length) {  // Deletes files specified in delete list
        for (const fileId of fileDeleteList) {
          let tmpQ = await pool.query(`DELETE FROM announcement_files WHERE id = $1 RETURNING file`, [fileId]);
          fs.unlinkSync("../frontend/public"+tmpQ.rows[0].file);
        }
      }
    }
    
    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/announcement${announcementId}`)) { fs.mkdirSync(`../frontend/public/_files/announcement${announcementId}`); }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO announcement_files(id, name, file, announcement_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`/_files/announcement${announcementId}/${file.name}`), 
          announcementId]);
          fs.writeFile(`../frontend/public/_files/announcement${announcementId}/${file.name}`, file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO announcement_files(id, name, file, announcement_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`/_files/announcement${announcementId}/${request.files.uploadFile.name}`), announcementId]);
        fs.writeFile(`../frontend/public/_files/announcement${announcementId}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }
    
    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e);
  }
};

// Delete announcement by id
async function deleteAnnouncement (request, response) {
  try {
    const announcementId = request.params.announcementId;
    await pool.query(`DELETE FROM announcements WHERE id = $1`, [announcementId]);
    if (fs.existsSync(`../frontend/public/_files/announcement${announcementId}`)) { 
      fs.rmdir(`../frontend/public/_files/announcement${announcementId}`, { recursive: true }, (err) => {
        if (err) { throw err; }
      }); 
    }
    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Create new comment for announcement
async function postAnnouncementComment (request, response) {
  try {
    const announcementId = request.params.announcementId;
    const author = request.body.author;
    const content = request.body.content;

    let resp = await pool.query(
      `INSERT INTO announcement_comment(id, announcement_id, author, content, post_date) 
      VALUES(default, $1, $2, $3, CURRENT_TIMESTAMP) RETURNING id`, [announcementId, author, content]);
    const commId = resp.rows[0].id;

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/announcement${announcementId}`)) { 
        fs.mkdirSync(`../frontend/public/_files/announcement${announcementId}`);
        fs.mkdirSync(`../frontend/public/_files/announcement${announcementId}/comment${commId}`);
      } else if (!fs.existsSync(`../frontend/public/_files/announcement${announcementId}/comment${commId}`)) { 
        fs.mkdirSync(`../frontend/public/_files/announcement${announcementId}/comment${commId}`);
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO announcement_comment_files(id, name, file, comment_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`/_files/announcement${announcementId}/comment${commId}/${file.name}`), 
          commId]);
          fs.writeFile(`../frontend/public/_files/announcement${announcementId}/comment${commId}/${file.name}`, file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO announcement_comment_files(id, name, file, comment_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`/_files/announcement${announcementId}/comment${commId}/${request.files.uploadFile.name}`), commId]);
        fs.writeFile(`../frontend/public/_files/announcement${announcementId}/comment${commId}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }
    
    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Update announcement comment
async function putAnnouncementComment (request, response) {
  try {
    const commentId = request.params.commentId;
    const announcementId = request.params.announcementId;;
    const content = request.body.content;

    await pool.query(`UPDATE announcement_comment SET content = $1 WHERE id = $2`, [content, commentId]);

    if (request.body.fileList) {
      const fileDeleteList = request.body.fileList.split(",");
      if (fileDeleteList.length) {  // Deletes files specified in delete list
        for (const fileId of fileDeleteList) {
          let tmpQ = await pool.query(`DELETE FROM announcement_comment_files WHERE id = $1 RETURNING file`, [fileId]);
          fs.unlinkSync("../frontend/public" + tmpQ.rows[0].file);
        }
      }
    }

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/announcement${announcementId}`)) { 
        fs.mkdirSync(`../frontend/public/_files/announcement${announcementId}`);
        fs.mkdirSync(`../frontend/public/_files/announcement${announcementId}/comment${commentId}`) 
      } else if (!fs.existsSync(`../frontend/public/_files/announcement${announcementId}/comment${commentId}`)) { 
        fs.mkdirSync(`../frontend/public/_files/announcement${announcementId}/comment${commentId}`) 
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO announcement_comment_files(id, name, file, comment_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`/_files/announcement${announcementId}/comment${commentId}/${file.name}`), 
          commentId]);
          fs.writeFile(`../frontend/public/_files/announcement${announcementId}/comment${commentId}/${file.name}`, 
          file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO announcement_comment_files(id, name, file, comment_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`/_files/announcement${announcementId}/comment${commentId}/${request.files.uploadFile.name}`), commentId]);
        fs.writeFile(`../frontend/public/_files/announcement${announcementId}/comment${commentId}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Delete announcement comment by id
async function deleteAnnouncementComment (request, response) {
  try {
    const commentId = request.params.commentId;
    let tmp = await pool.query(`SELECT announcement_id FROM announcement_comment WHERE id = $1`, [commentId]);
    const aId = tmp.rows[0].announcement_id;
    await pool.query(`DELETE FROM announcement_comment WHERE id = $1`, [commentId]);
    if (fs.existsSync(`../frontend/public/_files/announcement${aId}/comment${commentId}`)) { 
      fs.rmdir(`../frontend/public/_files/announcement${aId}/comment${commentId}`, { recursive: true }, (err) => {
        if (err) { throw err; }
      }); 
    }
    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get all announcements related search term
async function getSearchAnnouncements (request, response) {
  try {
    const topicGroupName = request.params.topicGroup;
    const announcementSearchTerm = request.params.announcementSearchTerm;
    const tmpQ = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    const topicGroupId = tmpQ.rows[0].id;

    let resp = await pool.query(
      `SELECT a.id, a.author, a.topic_group, a.title, a.content, a.post_date, 
      array_agg(c.id) as comments, array_agg(af.id) as attachments
      FROM announcements a
      LEFT JOIN announcement_comment c ON c.announcement_id = a.id
      LEFT JOIN announcement_files af ON af.announcement_id = a.id
      WHERE a.topic_group = $1
      AND (LOWER (a.title) LIKE LOWER($2)
      OR LOWER (a.content) LIKE LOWER($2))
      GROUP BY a.id`, [topicGroupId, `%${announcementSearchTerm}%`]);

    console.log(resp)

    for (const object of resp.rows) {
      var fileArr = [];
      var commentArr = [];
      for (const attachment of object.attachments) {
        if (attachment != null) { 
          let fileQ = await pool.query(`
          SELECT id, name, file
          FROM announcement_files WHERE announcement_id = $1 AND id = $2
          `, [object.id, attachment])
          fileArr.push(fileQ.rows[0]);
        }
      }

      if (object.comments.length) {
        for (const comment of object.comments) {
          let commQ = await pool.query(`
          SELECT id, author, content, post_date
          FROM announcement_comment WHERE announcement_id = $1 AND id = $2
          `, [object.id, comment])
          commentArr.push(commQ.rows[0]);
        }
      }
      
      object.attachments = fileArr;
      object.comments = commentArr;
    }

    response.status(200).json(resp.rows);
  } catch (e) {
    response.sendStatus(400).send(e);
  }

}

/***************************************************************
                       Assessment Functions
***************************************************************/

// Post new assessment quiz
async function postQuiz (request, response) {
  const name = request.body.name;
  const dueDate = request.body.dueDate;
  const timeGiven = request.body.timeGiven;

  try {
    let resp = await pool.query(
      `INSERT INTO quiz(id, name, due_date, time_given)
      VALUES(default, $1, $2, $3)`,
      [name, dueDate, timeGiven]);

    response.status(200).send("Post new quiz success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Post new assessment quiz
async function postQuizQuestion (request, response) {
  const questionBankId = request.params.questionBankId;
  const quiz_id = request.body.quiz_id;
  const quiz_type = request.body.quiz_type;
  const marks_awarded = request.body.marks_awarded;
  const related_topic_id = request.body.related_topic_id;
  const description = request.body.description;

  try {
    let resp = await pool.query(
      `INSERT INTO quiz_question(id, quiz_id, quiz_type, marks_awarded,
       description, related_topic_id) 
      VALUES(default, $1, $2, $3, $4, $5) RETURNING id`,
      [quiz_id, quiz_type, marks_awarded, description, related_topic_id]);
  
    let link = await pool.query(`INSERT INTO question_bank_question(question_bank_id, question_id)
    VALUES($1, $2)`, [questionBankId, resp.rows[0].id])
  
    response.status(200).send("Post new quiz question success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get quiz from id and questions related to quiz
async function getQuizQuestions (request, response) {
  const quizId = request.params.quizId;
  try {
    let resp = await pool.query(
      `SELECT q.id, q.name, q.due_date, q.time_given, array_agg(qq.id) 
      as questions_list FROM quiz q
      LEFT JOIN quiz_question qq ON qq.quiz_id = q.id 
      WHERE q.id = $1 GROUP BY q.id;`, [quizId]);

    // Check if questions_list exists
    if (resp.rows[0].questions_list) {
      var finalQuery = resp.rows[0];
      var questionArr = [];

      for (const questionId of resp.rows[0].questions_list) {
        let qResp = await pool.query(
          `SELECT * FROM quiz_question WHERE id = $1`, [questionId]);
          questionArr.push(qResp.rows[0]);
      }
      finalQuery.questions_list = questionArr;
    }

    response.status(200).json(finalQuery);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Change quiz details by id
async function putQuizById (request, response) {
  const quizId = request.params.quizId;
  const name = request.body.name;
  const dueDate = request.body.dueDate;
  const timeGiven = request.body.timeGiven;

  try {
    let resp = await pool.query(
      `UPDATE quiz SET name = $1, due_date = $2, time_given = $3 WHERE id = $4`,
      [name, dueDate, timeGiven, quizId]);

    response.status(200).send("Update quiz success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Delete quiz by id
async function deleteQuizById (request, response) {
  const quizId = request.params.quizId;

  try {
    let resp = await pool.query(`DELETE FROM quiz WHERE id = $1`, [quizId]);
    response.status(200).send("Delete quiz success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get specific question from quiz
async function getQuestionFromQuiz (request, response) {
  const quizId = request.params.quizId;
  const questionId = request.params.questionId;

  try {
    let resp = await pool.query(`SELECT * FROM quiz_question WHERE quiz_id = $1 AND id = $2`
    , [quizId, questionId]);
    response.status(200).json(resp.rows[0]);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Put question from quiz
async function putQuestionFromQuiz (request, response) {
  const quizId = request.params.quizId;
  const questionId = request.params.questionId;
  const quiz_type = request.body.quiz_type;
  const marks_awarded = request.body.marks_awarded;
  const related_topic_id = request.body.related_topic_id;
  const description = request.body.description;

  try {
    let resp = await pool.query(
      `UPDATE quiz_question SET quiz_Type = $1, marks_awarded = $2, 
      description = $3, related_topic_id = $4 WHERE quiz_id = $5 AND id = $6`
    , [quiz_type, marks_awarded, description, related_topic_id, quizId, questionId]);
    response.status(200).send("Update quiz question success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get questions from question bank
async function getQuestionBankQuestions (request, response) {
  const questionBankId = request.params.questionBankId;

  try {
    let resp = await pool.query(
      `SELECT * FROM quiz_question
       WHERE question_bank_id = $1`
    , [questionBankId]);

    response.status(200).json(resp.rows[0]);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Update name of question bank
async function putQuestionBank (request, response) {
  const questionBankId = request.params.questionBankId;
  const name = request.body.name;

  try {
    let resp = await pool.query(
      `UPDATE quiz_question_bank SET name = $1 WHERE id = $2`
    , [name, questionBankId]);

    response.status(200).send("Question Bank name updated");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Delete question bank
async function deleteQuestionBank (request, response) {
  const questionBankId = request.params.questionBankId;

  try {
    let resp = await pool.query(
      `DELETE FROM quiz_question_bank WHERE id = $1`
    , [questionBankId]);

    response.status(200).send("Question Bank deleted");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get questions from all question banks
async function getAllQuestionBankQuestions (request, response) {
  void (request);
 
  try {
    let resp = await pool.query(
      `SELECT qb.id, qb.name, array_agg(q.id) as questions_list 
      FROM quiz_question_bank qb
      LEFT JOIN question_bank_question qbq ON qbq.question_bank_id = qb.id
      LEFT JOIN quiz_question q ON q.id = qbq.question_id
      GROUP BY qb.id`);

    if (resp.rows) { 
      var finalQuery = resp.rows;

      for (const row of resp.rows) {
        var questionArr = [];
        for (const questionId of row.questions_list) {
          let qResp = await pool.query(
            `SELECT * FROM quiz_question WHERE id = $1`, [questionId]);
          questionArr.push(qResp.rows[0]);
        }
        row.questions_list = questionArr;
      }
      response.status(200).json(finalQuery);
    } else { response.status(200).json(resp.rows); }

  } catch(e) {
    response.status(400).send(e);
  }
};

// Get specific question from question bank
async function getQuestionFromQuestionBank (request, response) {
  try {
    const questionId = request.params.questionId;
    let resp = await pool.query(
      `SELECT * FROM quiz_question WHERE id = $1`
    , [questionId]);

    response.status(200).json(resp.rows[0]);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get specific question from question bank
async function postPoll (request, response) {
  const name = request.body.name;
  const startTime = request.body.start_time;
  const closeTime = request.body.close_time;
  const isClosed = request.body.is_closed; 
  const pollType = request.body.poll_type;

  try {
    let resp = await pool.query(
      `INSERT INTO quiz_poll(id, name, start_time, close_time, is_closed, poll_type)
      VALUES(default, $1, $2, $3, $4, $5)`
    , [name, startTime, closeTime, isClosed, pollType]);
  
    response.status(200).send("Post poll success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get specific poll from id
async function getPoll (request, response) {
  const pollId = request.params.pollId;

  try {
    let resp = await pool.query(
      `SELECT * FROM quiz_poll WHERE id = $1`
    , [pollId]);
  
    response.status(200).json(resp.rows[0]);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Update poll details
async function putPoll (request, response) {
  const pollId = request.params.pollId;
  const name = request.body.name;
  const startTime = request.body.start_time;
  const closeTime = request.body.close_time;
  const isClosed = request.body.is_closed; 
  const pollType = request.body.poll_type;

  try {
    let resp = await pool.query(
      `UPDATE quiz_poll SET name = $1, start_time = $2, close_time = $3, 
      is_closed = $4, poll_type = $5
      WHERE id = $6`
    , [name, startTime, closeTime, isClosed, pollType, pollId]);
  
    response.status(200).send("Poll update success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Update poll details
async function deletePoll (request, response) {
  const pollId = request.params.pollId;

  try {
    let resp = await pool.query(
      `DELETE FROM quiz_poll WHERE id = $1`
    , [pollId]);
  
    response.status(200).send("Poll delete success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get list of student answers by student id
async function getStudentAnswer (request, response) {
  const studentId = request.params.studentId;

  try {
    let resp = await pool.query(
      `SELECT * fROM quiz_student_answer WHERE student_id = $1`
    , [studentId]);
  
    response.status(200).json(resp.rows);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get list of student answers by student id
async function postStudentAnswer (request, response) {
  const studentId = request.body.studentId;
  const quizId = request.body.quizId;
  const questionId = request.body.questionId;
  const answerId = request.body.answerSelectedId;

  let resp = await pool.query(
    `INSERT INTO quiz_student_answer(student_id, quiz_id, question_id, answer_selected_id)
    VALUES($1, $2, $3, $4)`
  , [studentId, quizId, questionId, answerId]);

  response.status(200).send("Post student answer success");

  try {
    
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get list of student answers by student id
async function postQuestionAnswer (request, response) {
  const quizId = request.body.quizId;
  const questionId = request.body.questionId;
  const isCorrectAnswer = request.body.isCorrectAnswer;
  const description = request.body.description;

  try {
    let resp = await pool.query(
      `INSERT INTO quiz_question_answer(id, quiz_id, question_id, is_correct_answer, description)
      VALUES(default, $1, $2, $3, $4)`
    , [quizId, questionId, isCorrectAnswer, description]);
  
    response.status(200).send("Post quiz question answer success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Delete question from question bank
async function deleteQuestionBankQuestion (request, response) {
  const questionBankId = request.params.questionBankId;
  const questionId = request.params.questionId;

  try {
    let resp = await pool.query(
      `DELETE FROM question_bank_question WHERE question_bank_id = $1 AND question_id = $2`
    , [questionBankId, questionId]);
  
    response.status(200).send("Question deleted from question bank");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Delete question from question bank
async function deleteAssessmentQuestion (request, response) {
  const questionId = request.params.questionId;

  try {
    let resp = await pool.query(
      `DELETE FROM quiz_question WHERE id = $1`
    , [questionId]);
  
    response.status(200).send("Question delete success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Update quiz question answer
async function putQuestionAnswer (request, response) {
  const quizId = request.params.quizId;
  const questionId = request.params.questionId;
  const quizQuestionAnswerId = request.params.quizQuestionAnswerId;
  const isCorrectAnswer = request.body.isCorrectAnswer;
  const description = request.body.description;
  
  try {
    let resp = await pool.query(
      `UPDATE quiz_question_answer SET is_correct_answer = $1, description = $2
      WHERE quiz_id = $3 AND question_id = $4 AND id = $5`, 
      [isCorrectAnswer, description, quizId, questionId, quizQuestionAnswerId]);
  
    response.status(200).send("Quiz question answer update success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get number of students that selected each answer for a question (MPC only)
async function getStudentAnswerCount (request, response) {
  const questionId = request.params.questionId;

  try {
    let resp = await pool.query(
      `SELECT qqa.id, qqa.quiz_id, qqa.question_id, qqa.is_correct_answer, 
      qqa.description, count(qsa.answer_selected_id) as answer_count FROM quiz_question_answer qqa
      LEFT JOIN quiz_student_answer qsa ON qsa.question_id = qqa.question_id 
      AND qsa.quiz_id = qqa.quiz_id AND qsa.answer_selected_id = qqa.id
      WHERE qqa.question_id = $1
      GROUP BY qqa.id`, 
      [questionId]);
  
    response.status(200).json(resp.rows);
  } catch(e) {
    response.status(400).send(e);
  }
};

module.exports = {
  putTag,
  putAnnouncementComment,
  putAnnouncement,
  getAnnouncementById,
  deleteAnnouncement,
  deleteAnnouncementComment,
  deletePost,
  deleteComment,
  putCommentEndorse,
  putComment,
  deletePostReply,
  deleteTag,
  getStudentAnswerCount,
  putQuestionAnswer,
  deleteAssessmentQuestion,
  deleteQuestionBankQuestion,
  postQuestionAnswer,
  postStudentAnswer,
  getStudentAnswer,
  deletePoll,
  putPoll,
  getPoll,
  postPoll,
  getQuestionFromQuestionBank,
  getAllQuestionBankQuestions,
  deleteQuestionBank,
  putQuestionBank,
  getQuestionBankQuestions,
  putQuestionFromQuiz,
  getQuestionFromQuiz,
  deleteQuizById,
  putQuizById,
  getQuizQuestions,
  postQuiz,
  getAllTopicGroups,
  getTopics,
  getTopicPreReqs,
  postPreReq,
  deletePreReq,
  postTopicGroup,
  deleteTopicGroup,
  deleteTopic,
  postTopic,
  getAllForumPosts,
  getAllPinnedPosts,
  getSearchPosts,
  getFilterPosts,
  postForum,
  getPostById,
  putPost,
  putPostReply,
  postReply,
  postComment,
  putPostPin,
  getAllTags,
  postTag,
  putPostEndorse,
  putPostLike,
  putPostUnlike,
  getAnnouncements,
  postAnnouncement,
  postAnnouncementComment,
  getSearchAnnouncements,
  postQuizQuestion,
  login,
  register,
  getZIdFromAuthorization,
  generateCode,
  getTopicGroup,
  getTag,
  getTopicFile,
  putTopicGroup,
  putTopic
};
