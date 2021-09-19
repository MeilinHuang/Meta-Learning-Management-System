const pool = require('../db/database');
var fs = require('fs');
//const { start } = require('repl');

/***************************************************************
                       Week Functions
***************************************************************/

// Gets weeks
async function getWeeks (request, response) {
  try {
    void (request);
    const resp = await pool.query(`SELECT * FROM weeks`);
    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).json({error: e});
  }
}

/***************************************************************
                       File Functions
***************************************************************/

// Post file for lecture or tutorial
async function postLectureTutorialFile (request, response) {
  if (request.files == null) throw ("Failed: No file specified for upload");
    if (!request.query.target == "lecture" && !request.query.target == "tutorial") {
      throw ("Failed: file target incorrect choose (lecture or tutorial)");
    }
    const destId = request.params.targetId;
    const fileTarget = request.query.target;
    const fileName = request.files.uploadFile.name;
    const filePath = `/_files/${fileTarget}${destId}/${fileName}`;

    // Create directory
    if (!fs.existsSync(`../frontend/public/_files/${fileTarget}${destId}`)) { 
      fs.mkdirSync(`../frontend/public/_files/${fileTarget}${destId}`);
    }

    await pool.query(
    `INSERT INTO ${fileTarget}_files (id, name, file, ${fileTarget}_id) 
    VALUES(default, $1, $2, $3)`, [fileName, filePath, destId]);
    fs.writeFile(`../frontend/public/_files/${fileTarget}${destId}/${fileName}`, fileName, "binary", 
    function (err) { if (err) throw err; });

    response.status(200).json({success: true, file: fileName, filePath: filePath});
  try {
    
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// (REDUNDANT)  
/* async function putFile (request, response) {
  try {
    const fileTarget = request.params.lectureId ? "lecture" : "tutorial";
    const fileName = request.files.uploadFile.name;
    const fileId = request.body.fileId;

    await pool.query(
    `UPDATE $1_files SET name = $2 WHERE id = $3`, [fileTarget, fileName, fileId]);

    response.status(200).json({success: true, file: fileName});
  } catch (e) {
    response.status(400).json({error: e});
  }
} */

// Delete file for lecture or tutorial
async function deleteLectureTutorialFile (request, response) {
  try {
    if (!request.query.target == "lecture" && !request.query.target == "tutorial") {
      throw ("Failed: file target incorrect choose (lecture or tutorial)");
    }
    const fileTarget = request.query.target;
    const fileId = request.params.targetId;

    const filePath = await pool.query(
    `DELETE FROM ${fileTarget}_files WHERE id = $1 RETURNING file`, [fileId]);

    if (!filePath.rows.length) throw (`Failed: No file deleted with id {${fileId}}`);
    fs.unlinkSync("../frontend/public" + filePath.rows[0].file);

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

/***************************************************************
                       Lectures Functions
***************************************************************/

// Get all lectures
async function getAllLectures (request, response) {
  try {
    const topicGroup = request.params.topicGroupName;
    const idReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroup]);
    if (!idReq.rows.length) throw (`Failed: Topic group {${topicGroup}} does not exist`);
    const topicGroupId = idReq.rows[0].id;

    const resp = await pool.query(
    `SELECT l.id, l.week, l.topic_group_id, l.topic_reference, l.lecturer_id, 
    l.start_time, l.end_time, l.lecture_video, array_agg(lf.id) as lecture_files
    FROM lectures l
    LEFT JOIN lecture_files lf ON lf.lecture_id = l.id
    WHERE l.topic_group_id = $1
    GROUP BY l.id`, [topicGroupId]);

    for (const object of resp.rows) {
      var fileArr = [];
      
      for (const attachment of object.lecture_files) {
        if (attachment != null) { 
          const fileResp = await pool.query(
          `SELECT * FROM lecture_files 
          WHERE id = $1 AND lecture_id = $2`,
          [object.id, attachment])
          fileArr.push(fileResp.rows[0]);
        }
      }

      object.lecture_files = fileArr;
    }

    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// Get lecture by id
async function getLectureById (request, response) {
  try {
    const lectureId = request.params.lectureId;
    const topicGroupName = request.params.topicGroupName;

    const tgReq = await pool.query(
      `SELECT id FROM topic_group 
      WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if (!tgReq.rows.length) throw (`Failed: Topic group {${topicGroupName}} does not exist`);
    const topicGroupId = tgReq.rows[0].id;

    const resp = await pool.query(
      `SELECT * FROM lectures WHERE id = $1 AND topic_group_id = $2`,
      [lectureId, topicGroupId]);
    if (!resp.rows.length) throw (`Failed: Lecture with id {${lectureId}} does not exist`);

    response.status(200).json(resp.rows[0]);
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// Get lecture by id
async function postLecture (request, response) {
  try {
    const topicGroupName = request.params.topicGroupName;
    const lecturerId = request.body.lecturerId;
    const week = request.body.week;
    const startTime = request.body.startTime;
    const endTime = request.body.endTime;
    const topicRef = request.body.topicReference;
    const lectureVideo = request.body.lectureVideo ? request.body.lectureVideo : null;

    const topicReq = await pool.query(`SELECT id FROM topics WHERE LOWER(name) = LOWER($1)`, [topicRef]);
    if (!topicReq.rows.length) throw (`Failed: Topic {${topicRef}} does not exist`);
    const topicId = topicReq.rows[0].id;

    const tgReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if(!tgReq.rows.length) throw (`Failed: Topic group {${topicGroupName}} does not exist`);
    const topicGroupId = tgReq.rows[0].id;

    let resp = await pool.query(
      `INSERT INTO lectures(id, topic_group_id, lecturer_id, week, start_time, 
      end_time, lecture_video, topic_reference)
      VALUES(default, $1, $2, $3, $4, $5, $6, $7) RETURNING id`, 
      [topicGroupId, lecturerId, week, startTime, endTime, lectureVideo, topicId]);
    if (!resp.rows.length) throw (`Failed: Lecture creation unsuccessful`);

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// Get lecture by id
async function putLecture (request, response) {
  try {
    const topicGroupName = request.params.topicGroupName;
    const lectureId = request.params.lectureId;
    const lecturerId = request.body.lecturerId;
    const week = request.body.week;
    const startTime = request.body.startTime;
    const endTime = request.body.endTime;
    const topicRef = request.body.topicReference;
    const lectureVideo = request.body.lectureVideo ? request.body.lectureVideo : null;

    const tgReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if(!tgReq.rows.length) throw (`Failed: Topic group {${topicGroupName}} does not exist`);
    const topicGroupId = tgReq.rows[0].id;

    const topicReq = await pool.query(`SELECT id FROM topics WHERE LOWER(name) = LOWER($1)`, [topicRef]);
    if (!topicReq.rows.length) throw (`Failed: Topic {${topicRef}} does not exist`);
    const topicId = topicReq.rows[0].id;

    let resp = await pool.query(
      `UPDATE lectures
      SET lecturer_id = $1, week = $2, start_time = $3, end_time = $4,
      lecture_video = $5, topic_reference = $6 WHERE topic_group_id = $7 AND id = $8
      RETURNING id`, 
      [lecturerId, week, startTime, endTime, lectureVideo, topicId, topicGroupId, lectureId]);
    if (!resp.rows.length) throw (`Failed: Lecture update unsuccessful`);

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// Get lecture by id
async function deleteLecture (request, response) {
  try {
    const lectureId = request.params.lectureId;
    const req = await pool.query(`DELETE FROM lectures WHERE id = $1 RETURNING id`, [lectureId]);
    if (!req.rows.length) throw (`Failed: Lecture with id {${lectureId}} does not exist`);

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

/***************************************************************
                       Tutorials Functions
***************************************************************/

// Get all tutorials
async function getAllTutorials (request, response) {
  try {
    const topicGroup = request.params.topicGroupName;
    const idReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroup]);
    if (!idReq.rows.length) throw (`Failed: Topic group {${topicGroup}} does not exist`);
    const topicGroupId = idReq.rows[0].id;

    const resp = await pool.query(
    `SELECT l.id, l.week, l.topic_group_id, l.topic_reference, l.tutor_id, 
    l.start_time, l.end_time, l.tutorial_video, array_agg(lf.id) as tutorial_files
    FROM tutorials l
    LEFT JOIN tutorial_files lf ON lf.tutorial_id = l.id
    WHERE l.topic_group_id = $1
    GROUP BY l.id`, [topicGroupId]);

    for (const object of resp.rows) {
      var fileArr = [];
      
      for (const attachment of object.tutorial_files) {
        if (attachment != null) { 
          const fileResp = await pool.query(
          `SELECT * FROM tutorial_files 
          WHERE id = $1 AND tutorial_id = $2`,
          [object.id, attachment])
          fileArr.push(fileResp.rows[0]);
        }
      }

      object.tutorial_files = fileArr;
    }
    
    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// Get tutorial by id
async function getTutorialById (request, response) {
  try {
    const tutorialId = request.params.tutorialId;
    const topicGroupName = request.params.topicGroupName;

    const tgReq = await pool.query(
      `SELECT id FROM topic_group 
      WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if (!tgReq.rows.length) throw (`Failed: Topic group {${topicGroupName}} does not exist`);
    const topicGroupId = tgReq.rows[0].id;

    const resp = await pool.query(
      `SELECT * FROM tutorials WHERE id = $1 AND topic_group_id = $2`,
      [tutorialId, topicGroupId]);
    if (!resp.rows.length) throw (`Failed: Tutorial with id {${tutorialId}} does not exist`);

    response.status(200).json(resp.rows[0]);
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// Get tutorial by id
async function postTutorial (request, response) {
  try {
    const topicGroupName = request.params.topicGroupName;
    const tutorId = request.body.tutorId;
    const week = request.body.week;
    const startTime = request.body.startTime;
    const endTime = request.body.endTime;
    const topicRef = request.body.topicReference;
    const tutorialVideo = request.body.tutorialVideo ? request.body.tutorialVideo : null;

    const topicReq = await pool.query(`SELECT id FROM topics WHERE LOWER(name) = LOWER($1)`, [topicRef]);
    if (!topicReq.rows.length) throw (`Failed: Topic {${topicRef}} does not exist`);
    const topicId = topicReq.rows[0].id;

    const tgReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if(!tgReq.rows.length) throw (`Failed: Topic group {${topicGroupName}} does not exist`);
    const topicGroupId = tgReq.rows[0].id;

    let resp = await pool.query(
      `INSERT INTO tutorials(id, topic_group_id, tutor_id, week, start_time, end_time, tutorial_video, topic_reference)
      VALUES(default, $1, $2, $3, $4, $5, $6, $7) RETURNING id`, 
      [topicGroupId, tutorId, week, startTime, endTime, tutorialVideo, topicId]);
    if (!resp.rows.length) throw (`Failed: Tutorial creation unsuccessful`);

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// Get tutorial by id
async function putTutorial (request, response) {
  try {
    const topicGroupName = request.params.topicGroupName;
    const tutorialId = request.params.tutorialId;
    const tutorId = request.body.tutorId;
    const week = request.body.week;
    const startTime = request.body.startTime;
    const endTime = request.body.endTime;
    const topicRef = request.body.topicReference;
    const tutorialVideo = request.body.tutorialVideo ? request.body.tutorialVideo : null;

    const tgReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if(!tgReq.rows.length) throw (`Failed: Topic group {${topicGroupName}} does not exist`);
    const topicGroupId = tgReq.rows[0].id;

    const topicReq = await pool.query(`SELECT id FROM topics WHERE LOWER(name) = LOWER($1)`, [topicRef]);
    if (!topicReq.rows.length) throw (`Failed: Topic {${topicRef}} does not exist`);
    const topicId = topicReq.rows[0].id;

    let resp = await pool.query(
      `UPDATE tutorials
      SET tutor_id = $1, week = $2, start_time = $3, end_time = $4,
      tutorial_video = $5, topic_reference = $6 WHERE topic_group_id = $7 AND id = $8
      RETURNING id`, 
      [tutorId, week, startTime, endTime, tutorialVideo, topicId, topicGroupId, tutorialId]);
    if (!resp.rows.length) throw (`Failed: Tutorial update unsuccessful`);

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// Get tutorial by id
async function deleteTutorial (request, response) {
  try {
    const tutorialId = request.params.tutorialId;
    const resp = await pool.query(`DELETE FROM tutorials WHERE id = $1 RETURNING id`, [tutorialId]);
    if (!resp.rows.length) throw (`Failed: Tutorial with id {${tutorialId}} does not exist`);

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

module.exports = {
  getWeeks,
  postLectureTutorialFile,
  deleteLectureTutorialFile,
  getAllLectures,
  getLectureById,
  postLecture,
  putLecture,
  deleteLecture,
  getAllTutorials,
  getTutorialById,
  postTutorial,
  putTutorial,
  deleteTutorial
};
