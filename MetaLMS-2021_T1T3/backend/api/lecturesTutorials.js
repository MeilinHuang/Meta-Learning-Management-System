const pool = require('../db/database');
var fs = require('fs');

const auth = require("./authentication")

/***************************************************************
                       Panel Functions
***************************************************************/

// Get panels
async function getRecordingPanel (request, response) {
  try {
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    };
    const topicGroup = request.params.topicGroupName;
    const type = request.query.target;

    const idReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroup]);
    if (!idReq.rows.length) throw (`Failed: Topic group {${topicGroup}} does not exist`);

    const topicGroupId = idReq.rows[0].id;

    let resp = await pool.query(`
      SELECT * FROM recording_panels WHERE topicgroupid = $1 AND class = $2
    `, [topicGroupId, type]);

    response.status(200).json(resp.rows[0]);
  } catch(e) {
    response.status(400).json({e});
  }
}

// Post panels
async function postRecordingPanel (request, response) {
  try {
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    };
    const newLink = request.body.link ? request.body.link : "";
    const topicGroup = request.params.topicGroupName;
    const type = request.query.target;

    const idReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroup]);
    if (!idReq.rows.length) throw (`Failed: Topic group {${topicGroup}} does not exist`);

    const topicGroupId = idReq.rows[0].id;

    let resp = await pool.query(`
    INSERT INTO recording_panels(id, topicgroupid, class, link) 
    VALUES(default, $1, $2, $3) RETURNING id`, [topicGroupId, type, newLink]);

    response.status(200).json({success: true, panelId: resp.rows[0].id})
  } catch (e) {
    response.status(400).json({e});
  }
}

// Update panel links
async function putRecordingPanel (request, response) {
  try {
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const panelId = request.params.panelId;
    const newLink = request.body.link;

    await pool.query(`
    UPDATE recording_panels
    SET link = $1 
    WHERE id = $2`, [newLink, panelId]);

    response.status(200).json({success: true, link: newLink});
  } catch (e) {
    response.status(400).json({e});
  }
}

// Delete panels
async function deleteRecordingPanel (request, response) {
  try {
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }

    const panelId = request.params.panelId;

    await pool.query(`DELETE FROM recording_panels WHERE id = $1`, [panelId]);

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).json({e});
  }
}

/***************************************************************
                       File Functions
***************************************************************/

// Post file for lecture or tutorial
async function postLectureTutorialFile (request, response) {
  try {
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }

    if (request.files == null) throw ("Failed: No file specified for upload");
    if (!request.query.target == "lecture" && !request.query.target == "tutorial") {
      throw ("Failed: file target incorrect choose (lecture or tutorial)");
    }
    const destId = request.params.targetId;
    const fileTarget = request.params.target;
    const fileName = request.files.uploadFile.name;
    const filePath = `/_files/${fileTarget}${destId}/${fileName}`;

    // Create directory
    if (!fs.existsSync(`../frontend/public/_files/${fileTarget}${destId}`)) { 
      fs.mkdirSync(`../frontend/public/_files/${fileTarget}${destId}`);
    }

    let resp = await pool.query(
    `INSERT INTO ${fileTarget}_files (id, name, file, type, ${fileTarget}_id) 
    VALUES(default, $1, $2, $3, $4) RETURNING id`, [fileName, filePath, fileTarget, destId]);
    fs.writeFileSync(`../frontend/public/_files/${fileTarget}${destId}/${fileName}`, request.files.uploadFile.data, "binary", 
    function (err) { if (err) throw err; });

    if (resp.rows.length && fileTarget == 'lecture') {
      await pool.query(`INSERT INTO lecture_files_lectures(fileId, lectureId)
      VALUES($1, $2)`, [resp.rows[0].id, destId]);
    } else if (resp.rows.length && fileTarget == 'tutorial') {
      await pool.query(`INSERT INTO tutorial_files_tutorials(fileId, tutorialId)
      VALUES($1, $2)`, [resp.rows[0].id, destId]);
    }

    response.status(200).json({success: true, file: fileName, filePath: filePath});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// Delete file for lecture or tutorial
async function deleteLectureTutorialFile (request, response) {
  try {
    if (!request.query.target == "lecture" && !request.query.target == "tutorial") {
      throw ("file target incorrect choose (lecture or tutorial)");
    }

    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    };
    const fileTarget = request.params.target;
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

// Search file 
async function getSearchFile (request, response) {
  try {
    const searchTerm = request.params.searchTerm;
    const topicGroup = request.params.topicGroupName;
    const type = request.params.type;

    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    };

    const idReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroup]);
    if (!idReq.rows.length) throw (`Failed: Topic group {${topicGroup}} does not exist`);

    const topicGroupId = idReq.rows[0].id;
    let resp;

    if (type == 'lectures') {
      resp = await pool.query(`
      SELECT lf.id, lf.name, lf.file, lf.lecture_id 
      FROM lecture_files lf
      JOIN lectures l ON l.id = lf.lecture_id
      JOIN lecture_files_lectures lfl ON lfl.fileId = lf.id AND lfl.lectureId = l.id
      WHERE l.topic_group_id = $1 AND LOWER(lf.name) ~ LOWER($2)
      GROUP BY lf.id
      ORDER BY lf.id`, [topicGroupId, searchTerm]);
    } else {
      resp = await pool.query(`
      SELECT tf.id, tf.name, tf.file, tf.tutorial_id 
      FROM tutorial_files tf
      JOIN tutorials t ON t.id = tf.tutorial_id
      JOIN tutorial_files_tutorials tft ON tft.fileId = tf.id AND tft.tutorialId = t.id
      WHERE t.topic_group_id = $1 AND LOWER(tf.name) ~ LOWER($2)
      GROUP BY tf.id
      ORDER BY tf.id`, [topicGroupId, searchTerm]);
    }
    
    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).send(e);
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

    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    };

    const resp = await pool.query(
    `SELECT l.id, l.week, l.topic_group_id, l.topic_reference, array_agg(lf.id) as lecture_files
    FROM lectures l
    LEFT JOIN lecture_files lf ON lf.lecture_id = l.id
    WHERE l.topic_group_id = $1
    GROUP BY l.id
    ORDER BY l.id`, [topicGroupId]);

    for (const object of resp.rows) {
      var fileArr = [];
      
      for (const attachment of object.lecture_files) {
        if (attachment != null) { 
          const fileResp = await pool.query(
          `SELECT * FROM lecture_files 
          WHERE id = $1 AND lecture_id = $2`,
          [attachment, object.id]);
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

// Get lectures by search term
async function getSearchLectures (request, response) {
  try {
    const searchTerm = request.params.searchTerm.toLowerCase();
    const topicGroup = request.params.topicGroupName;
    const idReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroup]);
    if (!idReq.rows.length) throw (`Failed: Topic group {${topicGroup}} does not exist`);
    const topicGroupId = idReq.rows[0].id;

    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    };

    const resp = await pool.query(
      `SELECT l.id, l.week, l.topic_group_id, l.topic_reference, array_agg(lf.id) as lecture_files
      FROM lectures l
      LEFT JOIN lecture_files lf ON lf.lecture_id = l.id
      WHERE l.topic_group_id = $1 AND (l.week = $2 OR l.topic_reference = $2) 
      GROUP BY l.id`, [topicGroupId, searchTerm, `%${searchTerm}%`]);
  
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

// Create new lecture
async function postLecture (request, response) {
  try {
    const topicGroupName = request.params.topicGroupName;
    const week = request.body.week;
    //const topicRef = request.body.topicReference ? request.body.topicReference : null;

    /* const topicReq = await pool.query(`SELECT id FROM topics WHERE LOWER(name) = LOWER($1)`, [topicRef]);
    if (!topicReq.rows.length) throw (`Failed: Topic {${topicRef}} does not exist`);
    const topicId = topicReq.rows[0].id; */

    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    };

    const tgReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if(!tgReq.rows.length) throw (`Failed: Topic group {${topicGroupName}} does not exist`);
    const topicGroupId = tgReq.rows[0].id;

    // Check week
    let tmp = await pool.query(`SELECT * FROM lectures WHERE week = $1`, [week]);
    if (tmp.rows.length) {
      const id = tmp.rows[0].id;
      response.status(200).json({success: true, lectureId: id});
      return;
    }

    let resp = await pool.query(
      `INSERT INTO lectures(id, topic_group_id, week)
      VALUES(default, $1, $2) RETURNING id`, 
      [topicGroupId, week]);
    if (!resp.rows.length) throw (`Failed: Lecture creation unsuccessful`);

    response.status(200).json({success: true, lectureId: resp.rows[0].id});
  } catch (e) {
    response.status(400).json(e);
  }
}

// Get lecture by id
async function putLecture (request, response) {
  try {
    const topicGroupName = request.params.topicGroupName;
    const lectureId = request.params.lectureId;
    const week = request.body.week;
    // const topicRef = request.body.topicReference;

    const tgReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if(!tgReq.rows.length) throw (`Failed: Topic group {${topicGroupName}} does not exist`);
    const topicGroupId = tgReq.rows[0].id;

    /* const topicReq = await pool.query(`SELECT id FROM topics WHERE LOWER(name) = LOWER($1)`, [topicRef]);
    if (!topicReq.rows.length) throw (`Failed: Topic {${topicRef}} does not exist`);
    const topicId = topicReq.rows[0].id; */

    let resp = await pool.query(
      `UPDATE lectures
      SET week = $1 WHERE topic_group_id = $2 AND id = $3
      RETURNING id`, 
      [week, topicGroupId, lectureId]);
    if (!resp.rows.length) throw (`Failed: Lecture update unsuccessful`);

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// Get lecture by id
async function deleteLecture (request, response) {
  try {
    // deletes by week
    const lectureId = request.params.lectureId;
    const topicGroupName = request.params.topicGroupName;

    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    };

    const tgReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if(!tgReq.rows.length) throw (`Failed: Topic group {${topicGroupName}} does not exist`);
    const topicGroupId = tgReq.rows[0].id;

    const req = await pool.query(`DELETE FROM lectures WHERE id = $1 AND topic_group_id = $2 RETURNING id`, [lectureId, topicGroupId]);
    if (!req.rows.length) throw (`Lecture with id {${lectureId}} does not exist`);

    if (fs.existsSync(`../frontend/public/_files/lecture${lectureId}`)) {
      fs.rmdir(
        `../frontend/public/_files/lecture${lectureId}`,
        { recursive: true },
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
    }

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

    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    };

    const resp = await pool.query(
    `SELECT l.id, l.week, l.topic_group_id, l.topic_reference, array_agg(lf.id) as tutorial_files
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
          [attachment, object.id])
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
    const week = request.body.week;

    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    };

    const tgReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if(!tgReq.rows.length) throw (`Failed: Topic group {${topicGroupName}} does not exist`);
    const topicGroupId = tgReq.rows[0].id;

    let resp = await pool.query(
      `INSERT INTO tutorials(id, topic_group_id, week)
      VALUES(default, $1, $2) RETURNING id`, 
      [topicGroupId, week]);
    if (!resp.rows.length) throw (`Failed: Tutorial creation unsuccessful`);

    response.status(200).json({success: true, tutorialId: resp.rows[0].id});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// Get tutorial by id
async function putTutorial (request, response) {
  try {
    const topicGroupName = request.params.topicGroupName;
    const tutorialId = request.params.tutorialId;
    const week = request.body.week;
    
    const tgReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    if(!tgReq.rows.length) throw (`Failed: Topic group {${topicGroupName}} does not exist`);
    const topicGroupId = tgReq.rows[0].id;

    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    };

    let resp = await pool.query(
      `UPDATE tutorials
      SET week = $1 WHERE topic_group_id = $2 AND id = $3
      RETURNING id`, 
      [week, topicGroupId, tutorialId]);
    if (!resp.rows.length) throw (`Failed: Tutorial update unsuccessful`);

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

// Get tutorial by id
async function deleteTutorial (request, response) {
  try {
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }; 

    const tutorialId = request.params.tutorialId;
    const resp = await pool.query(`DELETE FROM tutorials WHERE id = $1 RETURNING id`, [tutorialId]);
    if (!resp.rows.length) throw (`Failed: Tutorial with id {${tutorialId}} does not exist`);

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).json({error: e});
  }
}

module.exports = {
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
  deleteTutorial,
  getSearchLectures,
  getSearchFile,
  putRecordingPanel,
  postRecordingPanel,
  deleteRecordingPanel,
  getRecordingPanel
};
