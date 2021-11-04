const pool = require("./db/database");
var fs = require("fs");

const auth = require("./api/authentication.js")

/***************************************************************
                       Topic Group Functions
***************************************************************/

async function getAllTopicGroups(request, response) {
  void request;
  //Validate Token
  let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
  if (zId == null) {
    response.status(403).send({ error: "Invalid Token" });
    throw "Invalid Token";
  }

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
    GROUP BY tp_group.id`
  );

  for (var object of resp.rows) {
    // Loop through list of topic groups
    var adminArr = [];
    var topicArr = [];
    var tutArr = [];
    var announcementArr = [];

    for (const topicId of object.topics_list) {
      let tmp = await pool.query(
        `
        SELECT t.id, t.topic_group_id, t.name,
        array_agg(DISTINCT tf.id) as course_materials
        FROM topics t 
        LEFT JOIN topic_files tf ON tf.topic_id = t.id
        WHERE t.id = $1
        GROUP BY t.id`,
        [topicId]
      );

      if (tmp.rows[0]) {
        if (tmp.rows[0].course_materials[0] !== null) {
          var topicFilesArr = [];
          for (const fileId of tmp.rows[0].course_materials) {
            let fileReq = await pool.query(
              `SELECT * FROM topic_files WHERE id = $1`,
              [fileId]
            );
            topicFilesArr.push(fileReq.rows[0]);
          }
          tmp.rows[0].course_materials = topicFilesArr;
        }
        let temp3 = await pool.query(
          `SELECT tags.name from tags JOIN topic_tags ON topic_tags.tag_id = tags.tag_id WHERE topic_id = $1 GROUP BY tags.tag_id`,
          [topicId]
        );
        tmp.rows[0].tags = temp3.rows;
      }

      topicArr.push(tmp.rows[0]);
    }

    for (const tutorialId of object.tutorial_list) {
      let tmp = await pool.query(`SELECT * FROM tutorials WHERE id = $1`, [
        tutorialId,
      ]);
      tutArr.push(tmp.rows[0]);
    }

    for (const adminId of object.admin_list) {
      let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [
        adminId,
      ]);
      adminArr.push(tmp.rows[0]);
    }

    for (const announcementId of object.announcements_list) {
      let tmp = await pool.query(`SELECT * FROM announcements WHERE id = $1`, [
        announcementId,
      ]);
      announcementArr.push(tmp.rows[0]);
    }

    object.topics_list = topicArr;
    object.tutorial_list = tutArr;
    object.announcements_list = announcementArr;
    object.admin_list = adminArr;
  }

  try {
    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get topic group data by name
async function getTopicGroup(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const topicGroup = request.params.topicGroupName;
    var tgId = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroup]
    );
    const topicGroupId = tgId.rows[0].id;

    let resp = await pool.query(
      `SELECT tp_group.id, tp_group.name, tp_group.topic_code, tp_group.searchable,
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
      GROUP BY tp_group.id`,
      [topicGroupId]
    );

    var adminArr = [];
    var fileArr = [];
    var topicArr = [];
    var tutArr = [];
    var announcementArr = [];
    var preReqsArr = [];

    for (const fileId of resp.rows[0].attachments) {
      let tmp = await pool.query(
        `SELECT * FROM topic_group_files WHERE id = $1`,
        [fileId]
      );
      fileArr.push(tmp.rows[0]);
    }

    for (const tutorialId of resp.rows[0].tutorial_list) {
      let tmp = await pool.query(`SELECT * FROM tutorials WHERE id = $1`, [
        tutorialId,
      ]);
      tutArr.push(tmp.rows[0]);
    }

    for (const adminId of resp.rows[0].admin_list) {
      let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [
        adminId,
      ]);
      adminArr.push(tmp.rows[0]);
    }

    for (const announcementId of resp.rows[0].announcements_list) {
      let tmp = await pool.query(`SELECT * FROM announcements WHERE id = $1`, [
        announcementId,
      ]);
      announcementArr.push(tmp.rows[0]);
    }

    for (const topic_id of resp.rows[0].topics_list) {
      let tmp = await pool.query(
        `SELECT topics.id, topics.topic_group_id, topics.name, array_agg(topic_files.id) as course_materials, 
        array_agg(DISTINCT prerequisites.prereq) as prereqs
        FROM topics 
        FULL OUTER JOIN topic_files ON topic_files.topic_id = topics.id
        FULL OUTER JOIN prerequisites ON prerequisites.topic = topics.id
        WHERE topics.id = $1
        GROUP BY topics.id`,
        [topic_id]
      );

      if (tmp.rows.length > 0) {
        var courseMaterialsArr = [];
        if (tmp.rows[0].course_materials[0] !== null) {
          for (var material_id of tmp.rows[0].course_materials) {
            let tmp2 = await pool.query(
              `SELECT * from topic_files WHERE id = $1`,
              [material_id]
            );
            courseMaterialsArr.push(tmp2.rows[0]);
          }
        }
        if (tmp.rows[0].prereqs[0] === null) {
          tmp.rows[0].prereqs = [];
        } else {
          for (const preReqId of tmp.rows[0].prereqs) {
            let tmp = await pool.query(
              `
            SELECT t.id, t.name from topics t WHERE t.id = $1
            `,
              [preReqId]
            );
            preReqsArr.push(tmp.rows[0]);
          }
          tmp.rows[0].prereqs = preReqsArr;
        }
        tmp.rows[0].course_materials = courseMaterialsArr;
        topicArr.push(tmp.rows[0]);
      }
    }

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

async function setSearchable(request, response) {
  const topicGroupName = request.params.topicGroupName;
  const searchable = request.params.searchable;
  try {
    //Validate Token
    let zId = await getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }

    //lookup topic group name to get corresponding id
    let resp = await pool.query(`SELECT id FROM topic_group WHERE name = $1`, [
      topicGroupName,
    ]);
    if (resp.rows.length === 0) {
      response.status(400).send(`No topic group with name ${topicGroupName}`);
      throw `No topic group with name ${topicGroupName}`;
    }

    const topicGroupId = resp.rows[0].id;

    resp = await pool.query(
      `UPDATE topic_group SET searchable = $1 WHERE id = $2`,
      [searchable, topicGroupId]
    );

    //return the codes
    response.status(200).send({ success: true });
  } catch (e) {
    console.error(e);
  }
}

// Get topics of topic group
async function getTopics(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const topicGroupName = request.params.topicGroupName;
    let resp = await pool.query(
      `SELECT array_agg(DISTINCT topics.id) AS topics_list
      FROM topic_group tp_group 
      JOIN topics ON topics.topic_group_id = tp_group.id
      WHERE LOWER(tp_group.name) = LOWER($1)
      GROUP BY tp_group.id;`,
      [topicGroupName]
    );

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
          GROUP BY topics.id`,
          [topic_id]
        );

        if (tmp.rows.length > 0) {
          var courseMaterialsArr = [];
          if (tmp.rows[0].course_materials[0] !== null) {
            for (var material_id of tmp.rows[0].course_materials) {
              let tmp2 = await pool.query(
                `SELECT * from topic_files WHERE id = $1`,
                [material_id]
              );
              courseMaterialsArr.push(tmp2.rows[0]);
            }
          }
          if (tmp.rows[0].prereqs[0] === null) {
            tmp.rows[0].prereqs = [];
          } else {
            for (const preReqId of tmp.rows[0].prereqs) {
              let tmp = await pool.query(
                `
              SELECT t.id, t.name from topics t WHERE t.id = $1
              `,
                [preReqId]
              );
              preReqsArr.push(tmp.rows[0]);
            }
            tmp.rows[0].prereqs = preReqsArr;
          }
          tmp.rows[0].course_materials = courseMaterialsArr;
          topicArr.push(tmp.rows[0]);
        }
      }

      object.topics_list = topicArr;
    }
    response.status(200).json(resp.rows[0]);
  } catch (e) {
    response.status(400).send(e);
  }
}

async function getTopicPreReqs(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const topicGroupName = request.params.topicGroupName;
    const topicName = request.params.topicName;
    let resp = await pool.query(
      `SELECT array_agg(DISTINCT p.prereq) as prerequisites_list 
      FROM prerequisites p
      JOIN topic_group ON LOWER(name) = LOWER($1)
      JOIN topics ON topics.topic_group_id = topic_group.id
      WHERE LOWER(topics.name) = LOWER($2)
      AND topics.topic_group_id = topic_group.id
      AND topics.id = p.topic`,
      [topicGroupName, topicName]
    );

    var preReqsArr = [];

    // console.log(resp.rows[0]);
    if (resp.rows[0].prerequisites_list !== null) {
      for (var prereq_id of resp.rows[0].prerequisites_list) {
        let tmp = await pool.query(`SELECT * from topics WHERE id = $1`, [
          prereq_id,
        ]);
        preReqsArr.push(tmp.rows[0]);
      }
    }
    resp.rows[0].prerequisites_list = preReqsArr;
    response.status(200).json(resp.rows[0]);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Create new pre requisite (Modify for topic name instead of IDs ??)
async function postPreReq(request, response, requestBody) {
  //Validate Token
  let zId = await auth.getZIdFromAuthorization(requestBody.header("Authorization"));
  if (zId == null) {
    response.status(403).send({ error: "Invalid Token" });
    throw "Invalid Token";
  }
  const preReqId = parseInt(request.preReqId);
  const topicId = parseInt(request.topicId);

  await pool.query("INSERT INTO prerequisites(prereq, topic) VALUES($1, $2)", [
    preReqId,
    topicId,
  ]);

  response.status(200).send(`Pre-requisite added with ID: ${preReqId}`);
}

// Delete pre-requisite data
async function deletePreReq(request, response) {
  //Validate Token
  let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
  if (zId == null) {
    response.status(403).send({ error: "Invalid Token" });
    throw "Invalid Token";
  }
  const preReqId = parseInt(request.preReqId);
  const topicId = parseInt(request.topicId);

  await pool.query(
    "DELETE FROM prerequisites WHERE prereq = $1 AND topic = $2",
    [preReqId, topicId]
  );

  response.status(200).json({ successs: true });
}

// Create topic group
async function postTopicGroup(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const topicGroupName = request.params.topicGroupName;
    const topic_code = request.body.topic_code;
    const fileTypeList = request.body.uploadedFileTypes.split(",");

    let resp = await pool.query(
      "INSERT INTO topic_group(id, name, topic_code) values(default, $1, $2) RETURNING id",
      [topicGroupName, topic_code]
    );

    if (request.files != null) {
      if (
        !fs.existsSync(`../frontend/public/_files/topicGroup${resp.rows[0].id}`)
      ) {
        fs.mkdirSync(`../frontend/public/_files/topicGroup${resp.rows[0].id}`);
      }
      if (request.files.uploadFile.length > 1) {
        if (fileTypeList.length > request.files.uploadFile.length)
          throw "Uploaded file type list longer than uploaded files";
        else if (fileTypeList.length < 0)
          throw "Uploaded file type list shorter than uploaded files";
        var typeCounter = 0;
        for (const file of request.files.uploadFile) {
          await pool.query(
            `INSERT INTO topic_group_files(id, name, file, type, topic_group_id)
          VALUES(default, $1, $2, $3, $4)`,
            [
              file.name,
              `/_files/topicGroup${resp.rows[0].id}/${file.name}`,
              fileTypeList[typeCounter],
              resp.rows[0].id,
            ]
          );
          fs.writeFile(
            `../frontend/public/_files/topicGroup${resp.rows[0].id}/${file.name}`,
            file.name,
            "binary",
            function (err) {
              if (err) throw err;
            }
          );
          typeCounter += 1;
        }
      } else {
        if (fileTypeList.length > 1)
          throw "Uploaded file type list longer than uploaded files";
        else if (fileTypeList.length < 0)
          throw "Uploaded file type list shorter than uploaded files";
        await pool.query(
          `INSERT INTO topic_group_files(id, name, file, type, topic_group_id)
        VALUES(default, $1, $2, $3, $4)`,
          [
            request.files.uploadFile.name,
            `/_files/topicGroup${resp.rows[0].id}/${request.files.uploadFile.name}`,
            fileTypeList[0],
            resp.rows[0].id,
          ]
        );
        fs.writeFile(
          `../frontend/public/_files/topicGroup${resp.rows[0].id}/${request.files.uploadFile.name}`,
          request.files.uploadFile.data,
          "binary",
          function (err) {
            if (err) throw err;
          }
        );
      }
    }

    response.sendStatus(200);
  } catch (e) {
    console.error(e);
    response.status(400).send(e);
  }
}

async function getAllTopics(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    let topicGroupResp = await pool.query(`SELECT name, id FROM topic_group`);
    // console.log("topicGroupResp", topicGroupResp);
    let result = [];
    for (let topicGroupName of topicGroupResp.rows) {
      // console.log("topicGroupName", topicGroupName.name);
      let resp = await pool.query(
        `SELECT array_agg(DISTINCT topics.id) AS topics_list
        FROM topic_group tp_group 
        JOIN topics ON topics.topic_group_id = tp_group.id
        WHERE LOWER(tp_group.name) = LOWER($1)
        GROUP BY tp_group.id;`,
        [topicGroupName.name]
      );
      for (var object of resp.rows) {
        var topicArr = [];
        for (const topic_id of object.topics_list) {
          let preReqsArr = [];
          let tmp = await pool.query(
            `SELECT topics.id, topics.topic_group_id, topics.name, array_agg(DISTINCT topic_files.id) as course_materials, 
            array_agg(DISTINCT prerequisites.prereq) as prereqs
            FROM topics 
            FULL OUTER JOIN topic_files ON topic_files.topic_id = topics.id
            FULL OUTER JOIN prerequisites ON prerequisites.topic = topics.id
            WHERE topics.id = $1
            GROUP BY topics.id`,
            [topic_id]
          );
          if (tmp.rows.length > 0) {
            var courseMaterialsArr = [];
            if (tmp.rows[0].course_materials[0] !== null) {
              for (var material_id of tmp.rows[0].course_materials) {
                let tmp2 = await pool.query(
                  `SELECT * from topic_files WHERE id = $1`,
                  [material_id]
                );
                courseMaterialsArr.push(tmp2.rows[0]);
              }
            }
            if (tmp.rows[0].prereqs[0] === null) {
              tmp.rows[0].prereqs = [];
            } else {
              for (const preReqId of tmp.rows[0].prereqs) {
                let tmp = await pool.query(
                  `
                SELECT t.id, t.name from topics t WHERE t.id = $1
                `,
                  [preReqId]
                );
                preReqsArr.push(tmp.rows[0]);
              }
              tmp.rows[0].prereqs = preReqsArr;
            }
            let temp3 = await pool.query(
              `SELECT tags.name from tags JOIN topic_tags ON topic_tags.tag_id = tags.tag_id WHERE topic_id = $1 GROUP BY tags.tag_id`,
              [topic_id]
            );
            tmp.rows[0].tags = temp3.rows;
            tmp.rows[0].course_materials = courseMaterialsArr;
            topicArr.push(tmp.rows[0]);
          }
        }
        object.topics_list = topicArr;
        object.name = topicGroupName.name;
        object.id = topicGroupName.id;
      }
      result.push(resp.rows[0]);
    }
    // console.log("result", result);
    response.status(200).json({ result: result });
  } catch (e) {
    response.status(400).send(e);
  }
}

// Update topic group details
async function putTopicGroup(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const newName = request.body.name;
    const newTopicCode = request.body.topic_code;
    const topicGroupName = request.params.topicGroupName;

    let tgReq = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );
    if (!tgReq.rows.length)
      throw `Failed: topic group {${topicGroupName}} does not exist`;

    const topicGroupId = tgReq.rows[0].id;
    const fileTypeList = request.body.uploadedFileTypes.split(",");

    await pool.query(
      `UPDATE topic_group SET name = $1, topic_code = $2
    WHERE id = $3`,
      [newName, newTopicCode, topicGroupId]
    );

    if (request.body.fileDeleteList) {
      const fileDeleteList = request.body.fileDeleteList.split(",");
      if (fileDeleteList.length) {
        // Deletes files specified in delete list
        for (const fileId of fileDeleteList) {
          let tmpQ = await pool.query(
            `DELETE FROM topic_group_files WHERE id = $1 RETURNING file`,
            [fileId]
          );
          fs.unlinkSync("../frontend/public" + tmpQ.rows[0].file);
        }
      }
    }

    if (request.files != null) {
      if (
        !fs.existsSync(`../frontend/public/_files/topicGroup${topicGroupId}`)
      ) {
        fs.mkdirSync(`../frontend/public/_files/topicGroup${topicGroupId}`);
      }
      if (request.files.uploadFile.length > 1) {
        if (fileTypeList.length > request.files.uploadFile.length)
          throw "Uploaded file type list longer than uploaded files";
        else if (fileTypeList.length < 0)
          throw "Uploaded file type list shorter than uploaded files";
        var typeCounter = 0;
        for (const file of request.files.uploadFile) {
          await pool.query(
            `INSERT INTO topic_group_files(id, name, file, type, topic_group_id)
          VALUES(default, $1, $2, $3, $4)`,
            [
              file.name,
              `/_files/topicGroup${topicGroupId}/${file.name}`,
              fileTypeList[typeCounter],
              topicGroupId,
            ]
          );
          fs.writeFile(
            `../frontend/public/_files/topicGroup${topicGroupId}/${file.name}`,
            file.name,
            "binary",
            function (err) {
              if (err) throw err;
            }
          );
          typeCounter += 1;
        }
      } else {
        if (fileTypeList.length > 1)
          throw "Uploaded file type list longer than uploaded files";
        else if (fileTypeList.length < 0)
          throw "Uploaded file type list shorter than uploaded files";
        await pool.query(
          `INSERT INTO topic_group_files(id, name, file, type, topic_group_id)
        VALUES(default, $1, $2, $3, $4)`,
          [
            request.files.uploadFile.name,
            `/_files/topicGroup${topicGroupId}/${request.files.uploadFile.name}`,
            fileTypeList[0],
            topicGroupId,
          ]
        );
        fs.writeFile(
          `../frontend/public/_files/topicGroup${topicGroupId}/${request.files.uploadFile.name}`,
          request.files.uploadFile.data,
          "binary",
          function (err) {
            if (err) throw err;
          }
        );
      }
    }

    response.status(200).json({ success: true });
  } catch (e) {
    response.status(400).json({ error: e });
  }
}

// Delete a topic group
async function deleteTopicGroup(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const topicGroupName = request.params.topicGroupName;

    let checkExist = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );
    if (!checkExist.rows.length)
      throw `Failed: Topic group {${topicGroupName}} doesn't exist in database`;

    await pool.query("DELETE FROM topic_group WHERE LOWER(name) = LOWER($1)", [
      topicGroupName,
    ]);

    if (
      fs.existsSync(
        `../frontend/public/_files/topicGroup${checkExist.rows[0].id}`
      )
    ) {
      fs.rmdir(
        `../frontend/public/_files/topicGroup${checkExist.rows[0].id}`,
        { recursive: true },
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
    }

    response.status(200).json({ success: true, deleted: topicGroupName });
  } catch (e) {
    response.status(400).json({ error: e });
  }
}

// Delete topic
async function deleteTopic(request, response) {
  //Validate Token
  let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
  if (zId == null) {
    response.status(403).send({ error: "Invalid Token" });
    throw "Invalid Token";
  }
  const topicGroupName = request.params.topicGroupName;
  const topicName = request.params.topicName;
  const idResp = await pool.query(
    `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
    [topicGroupName]
  );
  if (idResp.rows.length == 0) {
    response.status(400).json({ error: "Could not find topic group" });
    return;
  }

  console.log('topicName', topicName);
  console.log('topicGroup', topicGroupName);

  const topicGroupId = idResp.rows[0].id;
  let tmp = await pool.query(
    `SELECT id FROM topics WHERE LOWER(name) = LOWER($1) AND topic_group_id = $2`,
    [topicName, topicGroupId]
  );
  if (tmp.rows.length == 0) {
    response.status(400).json({ error: "Could not find topic in database" });
    return;
  }

  if (
    fs.existsSync(
      `../frontend/public/_files/topicGroup${idResp.rows[0].id}/topic${tmp.rows[0].id}`
    )
  ) {
    fs.rmdir(
      `../frontend/public/_files/topicGroup${idResp.rows[0].id}/topic${tmp.rows[0].id}`,
      { recursive: true },
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
  }

  const topicId = tmp.rows[0].id;
  await pool.query(
    `DELETE FROM prerequisites WHERE topic = $1 or prereq = $1`,
    [topicId]
  );
  await pool.query(`DELETE FROM topics WHERE id = $1`, [topicId]);
  response.status(200).json({ success: true, topicId: topicId });
}

async function putTopicTag(request, response) {
  // console.log("running inner function");
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const topicName = request.params.topicName;
    const topicGroupName = request.params.topicGroupName;

    const tagName = request.body.tagName;
    // console.log("tagName", tagName);
    // console.log("topicName", topicName);
    // console.log("topicGroupName", topicGroupName);
    let tgReq = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );
    if (!tgReq.rows.length)
      throw `Failed: topic group {${topicGroupName}} does not exist`;
    const topicGroupId = tgReq.rows[0].id;
    let tReq = await pool.query(
      `SELECT id FROM topics WHERE LOWER(name) = LOWER($1) and topic_group_id = $2`,
      [topicName, topicGroupId]
    );
    if (!tReq.rows.length) throw `Failed: topic {${topicName}} does not exist`;

    
    const topicId = tReq.rows[0].id;

    let resp = await pool.query(
      "INSERT INTO tags(tag_id, topic_group_id, name) values(default, $1, $2) RETURNING tag_id",
      [topicGroupId, tagName]
    );

    let tagId = resp.rows[0].tag_id;
    await pool.query(
      "INSERT INTO topic_tags(topic_id, tag_id) values ($1, $2)",
      [topicId, tagId]
    );

    response.sendStatus(200);
  } catch (e) {
    console.error(e);
    response.status(400).json({ error: e });
  }
}

async function deleteTopicTag(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const topicName = request.params.topicName;
    const topicGroupName = request.params.topicGroupName;

    const tagName = request.body.tagName;
    // console.log("tagName", tagName);
    // console.log("topicName", topicName);
    // console.log("topicGroupName", topicGroupName);
    let tgReq = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );
    if (!tgReq.rows.length)
      throw `Failed: topic group {${topicGroupName}} does not exist`;

    let tReq = await pool.query(
      `SELECT id FROM topics WHERE LOWER(name) = LOWER($1)`,
      [topicName]
    );
    if (!tReq.rows.length) throw `Failed: topic {${topicName}} does not exist`;

    const topicGroupId = tgReq.rows[0].id;
    const topicId = tReq.rows[0].id;

    let resp = await pool.query(
      `SELECT tag_id FROM tags WHERE LOWER(name) = LOWER($1)`,
      [tagName]
    );

    for (let i = 0; i < resp.rows.length; i++) {
      let tagId = resp.rows[i].tag_id;
      let topicTagRes = await pool.query(
        `SELECT topic_id, tag_id FROM topic_tags WHERE tag_id = $1 AND topic_id = $2`,
        [tagId, topicId]
      );
      if (topicTagRes.rows.length > 0) {
        await pool.query(
          `DELETE FROM topic_tags WHERE tag_id = $1 and topic_id = $2`,
          [tagId, topicId]
        );
        break;
      }
    }

    response.sendStatus(200);
  } catch (e) {
    console.error(e);
    response.status(400).json({ error: e });
  }
}

// Update topic details
async function putTopic(request, response) {
  console.log('putting topic');
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const topicName = request.params.topicName;
    const newName = request.body.name;
    const topicGroupName = request.params.topicGroupName;

    let tgReq = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );
    if (!tgReq.rows.length)
      throw `Failed: topic group {${topicGroupName}} does not exist`;
    const topicGroupId = tgReq.rows[0].id;
    let tReq = await pool.query(
      `SELECT id FROM topics WHERE LOWER(name) = LOWER($1) AND topic_group_id = $2`,
      [topicName, topicGroupId]
    );
    if (!tReq.rows.length) throw `Failed: topic {${topicName}} does not exist`;

    
    const topicId = tReq.rows[0].id;
    const fileTypeList = request.body.uploadedFileTypes.split(",");

    await pool.query(`UPDATE topics SET name = $1 WHERE id = $2`, [
      newName,
      topicId,
    ]);

    if (request.body.fileDeleteList) {
      const fileDeleteList = request.body.fileDeleteList.split(",");
      if (fileDeleteList.length) {
        // Deletes files specified in delete list
        for (const fileName of fileDeleteList) {
          
          let tmpQ = await pool.query(
            `DELETE FROM topic_files WHERE name = $1 AND topic_id = $2 RETURNING file`,
            [fileName, topicId]
          );
          fs.unlinkSync("../frontend/public" + tmpQ.rows[0].file);
        }
      }
    }

    // Checks if directory exists for topic group and topic and makes it
    if (!fs.existsSync(`../frontend/public/_files/topicGroup${topicGroupId}`)) {
      fs.mkdirSync(`../frontend/public/_files/topicGroup${topicGroupId}`);
      fs.mkdirSync(
        `../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}`
      );
    } else if (
      !fs.existsSync(
        `../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}`
      )
    ) {
      fs.mkdirSync(
        `../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}`
      );
    }

    if (request.files != null) {
      if (request.files.uploadFile.length > 1) {
        if (fileTypeList.length > request.files.uploadFile.length)
          throw "Uploaded file type list longer than uploaded files";
        else if (fileTypeList.length < 0)
          throw "Uploaded file type list shorter than uploaded files";
        var typeCounter = 0;
        for (const file of request.files.uploadFile) {
          await pool.query(
            `INSERT INTO topic_files(id, name, file, type, topic_id)
          VALUES(default, $1, $2, $3, $4)`,
            [
              file.name,
              `/_files/topicGroup${topicGroupId}/topic${topicId}/${file.name}`,
              fileTypeList[typeCounter],
              topicId,
            ]
          );
          fs.writeFile(
            `../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}/${file.name}`,
            file.name,
            "binary",
            function (err) {
              if (err) throw err;
            }
          );
          typeCounter += 1;
        }
      } else {
        if (fileTypeList.length > 1)
          throw "Uploaded file type list longer than uploaded files";
        else if (fileTypeList.length < 0)
          throw "Uploaded file type list shorter than uploaded files";
        await pool.query(
          `INSERT INTO topic_files(id, name, file, type, topic_id)
        VALUES(default, $1, $2, $3, $4)`,
          [
            request.files.uploadFile.name,
            `/_files/topicGroup${topicGroupId}/topic${topicId}/${request.files.uploadFile.name}`,
            fileTypeList[0],
            topicId,
          ]
        );
        fs.writeFile(
          `../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}/${request.files.uploadFile.name}`,
          request.files.uploadFile.data,
          "binary",
          function (err) {
            if (err) throw err;
          }
        );
      }
    }

    response.status(200).json({ success: true, topic: topicId });
  } catch (e) {
    console.log('error', e);
    response.status(400).json({ error: e });
  }
}

async function postTopic(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const topicGroupName = request.params.topicGroupName;
    const topicName = request.params.topicName;
    const idResp = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );
    if (idResp.rows.length == 0) throw "Could not find topic group";
    const topicGroupId = idResp.rows[0].id;
    const fileTypeList = request.body.uploadedFileTypes.split(",");
    const cloneTopic = request.body.cloneTopic;
    console.log('cloneTopic', cloneTopic);

    if (cloneTopic) {
      const cloneTopicGroupId = request.body.cloneTopicGroupId;
      let tReq = await pool.query(
        `SELECT id FROM topics WHERE LOWER(name) = LOWER($1) AND topic_group_id = $2`,
        [topicName, cloneTopicGroupId]
      );
      console.log('tReq', tReq);

      var topicCloneId = tReq.rows[0].id;

    }

    let resp = await pool.query(
      "INSERT INTO topics(id, topic_group_id, name) values(default, $1, $2) RETURNING id",
      [topicGroupId, topicName]
    );
    const topicId = resp.rows[0].id;

    /* let tmp = await pool.query(
      `SELECT id FROM topics WHERE name = $1 AND topic_group_id = $2`
    , [topicName, topicGroupId]);
    if (tmp.rows.length == 0) throw ("Could not find newly created topic in database");
    let topicId = tmp.rows[0]; */

    // Checks if directory exists for topic group and topic and makes it
    if (!fs.existsSync(`../frontend/public/_files/topicGroup${topicGroupId}`)) {
      fs.mkdirSync(`../frontend/public/_files/topicGroup${topicGroupId}`);
      fs.mkdirSync(
        `../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}`
      );
    } else if (
      !fs.existsSync(
        `../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}`
      )
    ) {
      fs.mkdirSync(
        `../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}`
      );
    }

    if (cloneTopic) {

      let fileResp = await pool.query(
        "SELECT id, name, file, type FROM topic_files WHERE topic_id = $1",
        [topicCloneId]
      );
      console.log('fileResp');
      for (let fileRow of fileResp.rows) {
        await pool.query(
          "INSERT INTO topic_files (id, name, file, type, topic_id) VALUES (default, $1, $2, $3, $4)",
          [fileRow.name, fileRow.file, fileRow.type, topicCloneId]
        );
      }

    }

    if (request.files != null) {
      if (request.files.uploadFile.length > 1) {
        if (fileTypeList.length > request.files.uploadFile.length)
          throw "Uploaded file type list longer than uploaded files";
        else if (fileTypeList.length < 0)
          throw "Uploaded file type list shorter than uploaded files";
        var typeCounter = 0;
        for (const file of request.files.uploadFile) {
          await pool.query(
            `INSERT INTO topic_files(id, name, file, type, topic_id)
          VALUES(default, $1, $2, $3, $4)`,
            [
              file.name,
              `/_files/topicGroup${topicGroupId}/topic${topicId}/${file.name}`,
              fileTypeList[typeCounter],
              topicId,
            ]
          );
          fs.writeFile(
            `../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}/${file.name}`,
            file.name,
            "binary",
            function (err) {
              if (err) throw err;
            }
          );
          typeCounter += 1;
        }
      } else {
        if (fileTypeList.length > 1)
          throw "Uploaded file type list longer than uploaded files";
        else if (fileTypeList.length < 0)
          throw "Uploaded file type list shorter than uploaded files";
        await pool.query(
          `INSERT INTO topic_files(id, name, file, type, topic_id)
        VALUES(default, $1, $2, $3, $4)`,
          [
            request.files.uploadFile.name,
            `/_files/topicGroup${topicGroupId}/topic${topicId}/${request.files.uploadFile.name}`,
            fileTypeList[0],
            topicId,
          ]
        );
        fs.writeFile(
          `../frontend/public/_files/topicGroup${topicGroupId}/topic${topicId}/${request.files.uploadFile.name}`,
          request.files.uploadFile.data,
          "binary",
          function (err) {
            if (err) throw err;
          }
        );
      }
    }

    response.status(200).json({ success: true, topic: topicId });
  } catch (e) {
    console.error(e);
    response.status(400).send(e);
  }
}

// Get topic files
async function getTopicFile(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const topicGroupName = request.params.topicGroupName;
    const topicName = request.params.topicName;

    // Checks topicgroup and topic validity
    let tgResp = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );
    if (!tgResp.rows.length)
      throw `Failed: Topic group {${topicGroupName}} does not exist.`;

    let tnResp = await pool.query(
      `SELECT id FROM topics WHERE LOWER(name) = LOWER($1) AND topics.topic_group_id = $2`,
      [topicName, tgResp.rows[0].id]
    );
    if (!tnResp.rows.length)
      throw `Failed: Topic {${topicName}} does not exist.`;

    let resp = await pool.query(
      `SELECT * FROM topic_files WHERE topic_id = $1`,
      [tnResp.rows[0].id]
    );

    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).json({ error: e });
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
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmonpqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

function addHours(date, hours) {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + Number(hours));
  return newDate;
}

async function generateCode(request, response) {
  const topicGroupName = request.params.topicGroupName;
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    //TODO check if zid is admin

    //lookup topic group name to get corresponding id
    let resp = await pool.query(`SELECT id FROM topic_group WHERE name = $1`, [
      topicGroupName,
    ]);
    if (resp.rows.length === 0) {
      response.status(400).send(`No topic group with name ${topicGroupName}`);
      throw `No topic group with name ${topicGroupName}`;
    }
    const topicGroupId = resp.rows[0].id;

    //generate a code, insert into db
    const code = randomString(8); // TODO check code uniqueness

    if (request.body.hasOwnProperty("uses")) {
      const uses = request.body.uses;
      if (request.body.hasOwnProperty("expiration")) {
        const expiration = request.body.expiration;
        let now = Date.now();
        console.log(now);
        now = addHours(now, expiration);
        let insResp = await pool.query(
          `INSERT INTO enroll_codes(id, code, topic_group_id, uses, expiration) VALUES(default, $1, $2, $3, $4)`,
          [code, topicGroupId, uses, now]
        );
      } else {
        let insResp = await pool.query(
          `INSERT INTO enroll_codes(id, code, topic_group_id, uses) VALUES(default, $1, $2, $3)`,
          [code, topicGroupId, uses]
        );
      }
    } else {
      if (request.body.hasOwnProperty("expiration")) {
        const expiration = request.body.expiration;
        let now = Date.now();
        console.log(now);
        now = addHours(now, expiration);
        let insResp = await pool.query(
          `INSERT INTO enroll_codes(id, code, topic_group_id, expiration) VALUES(default, $1, $2, $3)`,
          [code, topicGroupId, now]
        );
      } else {
        let insResp = await pool.query(
          `INSERT INTO enroll_codes(id, code, topic_group_id) VALUES(default, $1, $2)`,
          [code, topicGroupId]
        );
      }
    }
    //return the code
    response.status(200).send({ code: code });
  } catch (e) {
    console.error(e);
  }
}

async function enrollUserWithCode(request, response) {
  const inviteCode = request.params.inviteCode;
  const userId = request.params.userId;
  try {
    //Validate Token
    let zId = await getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }

    const topicGroupId = resp.rows[0].id;
    resp = await pool.query(`SELECT * FROM enroll_codes WHERE code = $1`, [
      inviteCode,
    ]);
    // check code exists
    if (resp.rows.length === 0) {
      response.status(400).send({ error: `No such code "${inviteCode}"` });
      throw `No such code ${inviteCode}`;
    }

    const code = resp.rows[0];

    // check code has uses, delete if not
    if (code.uses !== null) {
      // check if its 0, if it is, delete and error
      if (code.uses === 0) {
        resp = await pool.query(`DELETE FROM enroll_codes WHERE id = $1`, [
          code.id,
        ]);

        response.status(400).send({ error: `Code expired "${inviteCode}"`});
        throw `Code expired ${inviteCode}`;
      }
      // decrement
      await pool.query(`UPDATE enroll_codes SET uses = $1 WHERE id = $2`, [
        code.uses - 1,
        code.id,
      ]);
    }
    // check code has time remaining, delete if not
    if (code.expiration !== null) {
      const expiration = new Date(code.expiration);
      const now = Date.now();

      // check if its 0, if it is, delete and error
      if (expiration - now <= 0) {
        resp = await pool.query(`DELETE FROM enroll_codes WHERE id = $1`, [
          code.id,
        ]);

        response.status(400).send({ error: `Code expired "${inviteCode}"`});
        throw `Code expired ${inviteCode}`;
      }
    }

    // check if user already enrolled
    resp = await pool.query(
      `SELECT * FROM user_enrolled WHERE topic_group_id = $1 AND user_id = $2`,
      [code.topic_group_id, userId]
    );

    if (resp.rows.length !== 0) {
      response.status(400).send({ error: `You're already enrolled in that course`});
      throw `User ${userId} already enrolled in course ${code.topic_group_id}`;
    }

    resp = await pool.query(
      `INSERT INTO user_enrolled(topic_group_id, user_id, progress) VALUES($1, $2, $3)`,
      [code.topic_group_id, userId, 0]
    );

    //return the codes
    response.status(200).send({ success: "true" });
  } catch (e) {
    console.error(e);
  }
}

async function getCourseCodes(request, response) {
  const topicGroupName = request.params.topicGroupName;
  try {
    //Validate Token
    let zId = await getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }

    //lookup topic group name to get corresponding id
    let resp = await pool.query(`SELECT id FROM topic_group WHERE name = $1`, [
      topicGroupName,
    ]);
    if (resp.rows.length === 0) {
      response.status(400).send(`No topic group with name ${topicGroupName}`);
      throw `No topic group with name ${topicGroupName}`;
    }

    const topicGroupId = resp.rows[0].id;
    resp = await pool.query(
      `SELECT * FROM enroll_codes WHERE topic_group_id = $1`,
      [topicGroupId]
    );

    // Todo: set flag to see if we deleted any codes and need to refetch
    // then check each code in a loop to see if any are outdated or out of uses and remove them

    //return the codes
    response.status(200).send(resp.rows);
  } catch (e) {
    console.error(e);
  }
}

async function getCourseCode(request, response) {
  const courseCode = request.params.inviteCode;
  try {
    //Validate Token
    let zId = await getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }

    let resp = await pool.query(`SELECT * FROM enroll_codes WHERE code = $1`, [
      courseCode,
    ]);

    if (resp.rows.length === 0) {
      response.status(400).send(`No invite code ${courseCode}`);
      throw `No invite code ${courseCode}`;
    }

    const ret = resp.rows[0];

    //return the codes
    response.status(200).send(ret);
  } catch (e) {
    console.error(e);
  }
}

async function deleteCourseCode(request, response) {
  const courseCode = request.params.inviteCode;
  try {
    //Validate Token
    let zId = await getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }

    let resp = await pool.query(`SELECT id FROM enroll_codes WHERE code = $1`, [
      courseCode,
    ]);

    if (resp.rows.length === 0) {
      response.status(400).send(`No invite code ${courseCode}`);
      throw `No invite code ${courseCode}`;
    }

    const codeId = resp.rows[0].id;
    resp = await pool.query(`DELETE FROM enroll_codes WHERE id = $1`, [codeId]);

    //return the codes
    response.status(200).send({ success: "true" });
  } catch (e) {
    console.error(e);
  }
}

async function getEnrollments(request, response) {
  const topicGroupName = request.params.topicGroupName;
  try {
    //Validate Token
    let zId = await getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    //TODO check if zid is admin

    //lookup topic group name to get corresponding id
    let resp = await pool.query(`SELECT id FROM topic_group WHERE name = $1`, [
      topicGroupName,
    ]);
    if (resp.rows.length === 0) {
      response.status(400).send(`No topic group with name ${topicGroupName}`);
      throw `No topic group with name ${topicGroupName}`;
    }
    const topicGroupId = resp.rows[0].id;

    resp = await pool.query(
      `SELECT * FROM user_enrolled WHERE topic_group_id = $1`,
      [topicGroupId]
    );

    //return the codes
    response.status(200).send(resp.rows);
  } catch (e) {
    console.error(e);
  }
}

async function enrollUser(request, response) {
  const topicGroupName = request.params.topicGroupName;
  const userZId = request.params.zId;
  try {
    //Validate Token
    let zId = await getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    //TODO check if zid is admin

    //lookup topic group name to get corresponding id
    let resp = await pool.query(`SELECT id FROM topic_group WHERE name = $1`, [
      topicGroupName,
    ]);
    if (resp.rows.length === 0) {
      response.status(400).send(`No topic group with name ${topicGroupName}`);
      throw `No topic group with name ${topicGroupName}`;
    }
    const topicGroupId = resp.rows[0].id;

    resp = await pool.query(`SELECT id FROM users WHERE zid = $1`, [userZId]);
    if (resp.rows.length === 0) {
      response.status(400).send(`No topic group with zid ${userZId}`);
      throw `No topic group with name ${userZId}`;
    }
    const userId = resp.rows[0].id;

    // check if user already enrolled
    resp = await pool.query(
      `SELECT * FROM user_enrolled WHERE topic_group_id = $1 AND user_id = $2`,
      [topicGroupId, userId]
    );

    if (resp.rows.length !== 0) {
      response.status(400).send({ error: `User already enrolled in this course`});
      throw `User ${userId} already enrolled in course ${topicGroupId}`;
    }

    resp = await pool.query(
      `INSERT INTO user_enrolled(topic_group_id, user_id, progress) VALUES($1, $2, $3)`,
      [topicGroupId, userId, 0]
    );

    //return the codes
    response.status(200).send({ success: "true" });
  } catch (e) {
    console.error(e);
  }
}

async function unenrollUser(request, response) {
  const topicGroupName = request.params.topicGroupName;
  const userId = request.params.userId;
  try {
    //Validate Token
    let zId = await getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    //TODO check if zid is admin

    //lookup topic group name to get corresponding id
    let resp = await pool.query(`SELECT id FROM topic_group WHERE name = $1`, [
      topicGroupName,
    ]);
    if (resp.rows.length === 0) {
      response.status(400).send(`No topic group with name ${topicGroupName}`);
      throw `No topic group with name ${topicGroupName}`;
    }
    const topicGroupId = resp.rows[0].id;

    resp = await pool.query(
      `DELETE FROM user_enrolled WHERE topic_group_id = $1 AND user_id = $2`,
      [topicGroupId, userId]
    );

    //return the codes
    response.status(200).send({ success: "true" });
  } catch (e) {
    console.error(e);
  }
}

/***************************************************************
                       Course Pages Functions
***************************************************************/

// Get all announcements of topic group / course
async function getAnnouncements(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const topicGroupName = request.params.topicGroup;
    const tmpQ = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );
    const topicGroupId = tmpQ.rows[0].id;
    let resp = await pool.query(
      `SELECT a.id, a.author, a.topic_group, a.title, a.content, a.post_date, 
      array_agg(c.id) as comments, array_agg(af.id) as attachments
      FROM announcements a
      LEFT JOIN announcement_comment c ON c.announcement_id = a.id
      LEFT JOIN announcement_files af ON af.announcement_id = a.id
      WHERE a.topic_group = $1
      GROUP BY a.id`,
      [topicGroupId]
    );

    for (const object of resp.rows) {
      var fileArr = [];
      var commentArr = [];
      for (const attachment of object.attachments) {
        if (attachment != null) {
          let fileQ = await pool.query(
            `
          SELECT id, name, file
          FROM announcement_files WHERE announcement_id = $1 AND id = $2
          `,
            [object.id, attachment]
          );
          fileArr.push(fileQ.rows[0]);
        }
      }

      if (object.comments.length) {
        for (const comment of object.comments) {
          let commQ = await pool.query(
            `
          SELECT id, author, content, post_date
          FROM announcement_comment WHERE announcement_id = $1 AND id = $2
          `,
            [object.id, comment]
          );
          commentArr.push(commQ.rows[0]);
        }
      }

      object.attachments = fileArr;
      object.comments = commentArr;
    }

    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get announcement by id
async function getAnnouncementById(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const announcementId = request.params.announcementId;
    let resp = await pool.query(
      `
      SELECT a.id, a.author, a.topic_group, a.title, a.content, a.post_date,
      array_agg(c.id) as comments, array_agg(af.id) as attachments
      FROM announcements a
      LEFT JOIN announcement_comment c ON c.announcement_id = a.id
      LEFT JOIN announcement_files af ON af.announcement_id = a.id
      WHERE a.id = $1
      GROUP BY a.id
    `,
      [announcementId]
    );

    var fileArr = [];
    var commArr = [];

    // console.log(resp.rows);

    if (resp.rows[0].comments.length && resp.rows[0].comments[0] !== null) {
      for (const commId of resp.rows[0].comments) {
        let commQ = await pool.query(
          `SELECT ac.id, ac.author, ac.content, ac.post_date, array_agg(acf.id) as attachments
        FROM announcement_comment ac 
        LEFT JOIN announcement_comment_files acf ON acf.comment_id = ac.id 
        WHERE ac.id = $1
        GROUP BY ac.id`,
          [commId]
        );

        var commFileArr = [];
        if (commQ.rows[0].attachments.length) {
          for (const file of commQ.rows[0].attachments) {
            let commFileQ = await pool.query(
              `
            SELECT id, name, file FROM announcement_comment_files 
            WHERE id = $1`,
              [file]
            );
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
          let fileQ = await pool.query(
            `
          SELECT id, name, file
          FROM announcement_files WHERE announcement_id = $1 AND id = $2
          `,
            [announcementId, attachment]
          );
          fileArr.push(fileQ.rows[0]);
        }
      }
    }
    resp.rows[0].attachments = fileArr;

    response.status(200).json(resp.rows[0]);
  } catch (e) {
    console.error(e);
    response.status(400).send(e);
  }
}

// Create new announcement for topic group / course
async function postAnnouncement(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const topicGroupName = request.params.topicGroup;
    const tmpQ = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );
    const topic_group = tmpQ.rows[0].id;
    const user_id = request.body.user_id;
    const title = request.body.title;
    const description = request.body.description;

    let resp = await pool.query(
      `INSERT INTO announcements(id, author, topic_group, title, content, post_date) 
      VALUES(default, $1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id`,
      [user_id, topic_group, title, description]
    );

    if (request.files != null) {
      if (
        !fs.existsSync(
          `../frontend/public/_files/announcement${resp.rows[0].id}`
        )
      ) {
        fs.mkdirSync(
          `../frontend/public/_files/announcement${resp.rows[0].id}`
        );
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(
            `INSERT INTO announcement_files(id, name, file, announcement_id)
          VALUES(default, $1, $2, $3)`,
            [
              file.name,
              `/_files/announcement${resp.rows[0].id}/${file.name}`,
              resp.rows[0].id,
            ]
          );
          fs.writeFile(
            `../frontend/public/_files/announcement${resp.rows[0].id}/${file.name}`,
            file.name,
            "binary",
            function (err) {
              if (err) throw err;
            }
          );
        }
      } else {
        await pool.query(
          `INSERT INTO announcement_files(id, name, file, announcement_id)
        VALUES(default, $1, $2, $3)`,
          [
            request.files.uploadFile.name,
            `/_files/announcement${resp.rows[0].id}/${request.files.uploadFile.name}`,
            resp.rows[0].id,
          ]
        );
        fs.writeFile(
          `../frontend/public/_files/announcement${resp.rows[0].id}/${request.files.uploadFile.name}`,
          request.files.uploadFile.data,
          "binary",
          function (err) {
            if (err) throw err;
          }
        );
      }
    }

    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Update announcement by id
async function putAnnouncement(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const announcementId = request.params.announcementId;
    const title = request.body.title;
    const content = request.body.content;

    await pool.query(
      `UPDATE announcements SET title = $1, content = $2
    WHERE id = $3`,
      [title, content, announcementId]
    );

    if (request.body.fileList) {
      const fileDeleteList = request.body.fileList.split(",");
      if (fileDeleteList.length) {
        // Deletes files specified in delete list
        for (const fileId of fileDeleteList) {
          let tmpQ = await pool.query(
            `DELETE FROM announcement_files WHERE id = $1 RETURNING file`,
            [fileId]
          );
          fs.unlinkSync("../frontend/public" + tmpQ.rows[0].file);
        }
      }
    }

    if (request.files != null) {
      if (
        !fs.existsSync(
          `../frontend/public/_files/announcement${announcementId}`
        )
      ) {
        fs.mkdirSync(`../frontend/public/_files/announcement${announcementId}`);
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(
            `INSERT INTO announcement_files(id, name, file, announcement_id)
          VALUES(default, $1, $2, $3)`,
            [
              file.name,
              `/_files/announcement${announcementId}/${file.name}`,
              announcementId,
            ]
          );
          fs.writeFile(
            `../frontend/public/_files/announcement${announcementId}/${file.name}`,
            file.name,
            "binary",
            function (err) {
              if (err) throw err;
            }
          );
        }
      } else {
        await pool.query(
          `INSERT INTO announcement_files(id, name, file, announcement_id)
        VALUES(default, $1, $2, $3)`,
          [
            request.files.uploadFile.name,
            `/_files/announcement${announcementId}/${request.files.uploadFile.name}`,
            announcementId,
          ]
        );
        fs.writeFile(
          `../frontend/public/_files/announcement${announcementId}/${request.files.uploadFile.name}`,
          request.files.uploadFile.data,
          "binary",
          function (err) {
            if (err) throw err;
          }
        );
      }
    }

    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Delete announcement by id
async function deleteAnnouncement(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const announcementId = request.params.announcementId;
    await pool.query(`DELETE FROM announcements WHERE id = $1`, [
      announcementId,
    ]);
    if (
      fs.existsSync(`../frontend/public/_files/announcement${announcementId}`)
    ) {
      fs.rmdir(
        `../frontend/public/_files/announcement${announcementId}`,
        { recursive: true },
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
    }
    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Create new comment for announcement
async function postAnnouncementComment(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const announcementId = request.params.announcementId;
    const author = request.body.author;
    const content = request.body.content;

    let resp = await pool.query(
      `INSERT INTO announcement_comment(id, announcement_id, author, content, post_date) 
      VALUES(default, $1, $2, $3, CURRENT_TIMESTAMP) RETURNING id`,
      [announcementId, author, content]
    );
    const commId = resp.rows[0].id;

    if (request.files != null) {
      if (
        !fs.existsSync(
          `../frontend/public/_files/announcement${announcementId}`
        )
      ) {
        fs.mkdirSync(`../frontend/public/_files/announcement${announcementId}`);
        fs.mkdirSync(
          `../frontend/public/_files/announcement${announcementId}/comment${commId}`
        );
      } else if (
        !fs.existsSync(
          `../frontend/public/_files/announcement${announcementId}/comment${commId}`
        )
      ) {
        fs.mkdirSync(
          `../frontend/public/_files/announcement${announcementId}/comment${commId}`
        );
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(
            `INSERT INTO announcement_comment_files(id, name, file, comment_id)
          VALUES(default, $1, $2, $3)`,
            [
              file.name,
              `/_files/announcement${announcementId}/comment${commId}/${file.name}`,
              commId,
            ]
          );
          fs.writeFile(
            `../frontend/public/_files/announcement${announcementId}/comment${commId}/${file.name}`,
            file.name,
            "binary",
            function (err) {
              if (err) throw err;
            }
          );
        }
      } else {
        await pool.query(
          `INSERT INTO announcement_comment_files(id, name, file, comment_id)
        VALUES(default, $1, $2, $3)`,
          [
            request.files.uploadFile.name,
            `/_files/announcement${announcementId}/comment${commId}/${request.files.uploadFile.name}`,
            commId,
          ]
        );
        fs.writeFile(
          `../frontend/public/_files/announcement${announcementId}/comment${commId}/${request.files.uploadFile.name}`,
          request.files.uploadFile.data,
          "binary",
          function (err) {
            if (err) throw err;
          }
        );
      }
    }

    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Update announcement comment
async function putAnnouncementComment(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const commentId = request.params.commentId;
    const announcementId = request.params.announcementId;
    const content = request.body.content;

    await pool.query(
      `UPDATE announcement_comment SET content = $1 WHERE id = $2`,
      [content, commentId]
    );

    if (request.body.fileList) {
      const fileDeleteList = request.body.fileList.split(",");
      if (fileDeleteList.length) {
        // Deletes files specified in delete list
        for (const fileId of fileDeleteList) {
          let tmpQ = await pool.query(
            `DELETE FROM announcement_comment_files WHERE id = $1 RETURNING file`,
            [fileId]
          );
          fs.unlinkSync("../frontend/public" + tmpQ.rows[0].file);
        }
      }
    }

    if (request.files != null) {
      if (
        !fs.existsSync(
          `../frontend/public/_files/announcement${announcementId}`
        )
      ) {
        fs.mkdirSync(`../frontend/public/_files/announcement${announcementId}`);
        fs.mkdirSync(
          `../frontend/public/_files/announcement${announcementId}/comment${commentId}`
        );
      } else if (
        !fs.existsSync(
          `../frontend/public/_files/announcement${announcementId}/comment${commentId}`
        )
      ) {
        fs.mkdirSync(
          `../frontend/public/_files/announcement${announcementId}/comment${commentId}`
        );
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(
            `INSERT INTO announcement_comment_files(id, name, file, comment_id)
          VALUES(default, $1, $2, $3)`,
            [
              file.name,
              `/_files/announcement${announcementId}/comment${commentId}/${file.name}`,
              commentId,
            ]
          );
          fs.writeFile(
            `../frontend/public/_files/announcement${announcementId}/comment${commentId}/${file.name}`,
            file.name,
            "binary",
            function (err) {
              if (err) throw err;
            }
          );
        }
      } else {
        await pool.query(
          `INSERT INTO announcement_comment_files(id, name, file, comment_id)
        VALUES(default, $1, $2, $3)`,
          [
            request.files.uploadFile.name,
            `/_files/announcement${announcementId}/comment${commentId}/${request.files.uploadFile.name}`,
            commentId,
          ]
        );
        fs.writeFile(
          `../frontend/public/_files/announcement${announcementId}/comment${commentId}/${request.files.uploadFile.name}`,
          request.files.uploadFile.data,
          "binary",
          function (err) {
            if (err) throw err;
          }
        );
      }
    }

    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Delete announcement comment by id
async function deleteAnnouncementComment(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const commentId = request.params.commentId;
    let tmp = await pool.query(
      `SELECT announcement_id FROM announcement_comment WHERE id = $1`,
      [commentId]
    );
    const aId = tmp.rows[0].announcement_id;
    await pool.query(`DELETE FROM announcement_comment WHERE id = $1`, [
      commentId,
    ]);
    if (
      fs.existsSync(
        `../frontend/public/_files/announcement${aId}/comment${commentId}`
      )
    ) {
      fs.rmdir(
        `../frontend/public/_files/announcement${aId}/comment${commentId}`,
        { recursive: true },
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
    }
    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get all announcements related search term
async function getSearchAnnouncements(request, response) {
  try {
    //Validate Token
    let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    }
    const topicGroupName = request.params.topicGroup;
    const announcementSearchTerm = request.params.announcementSearchTerm;
    const tmpQ = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );
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
      GROUP BY a.id`,
      [topicGroupId, `%${announcementSearchTerm}%`]
    );

    // console.log(resp);

    for (const object of resp.rows) {
      var fileArr = [];
      var commentArr = [];
      for (const attachment of object.attachments) {
        if (attachment != null) {
          let fileQ = await pool.query(
            `
          SELECT id, name, file
          FROM announcement_files WHERE announcement_id = $1 AND id = $2
          `,
            [object.id, attachment]
          );
          fileArr.push(fileQ.rows[0]);
        }
      }

      if (object.comments.length) {
        for (const comment of object.comments) {
          let commQ = await pool.query(
            `
          SELECT id, author, content, post_date
          FROM announcement_comment WHERE announcement_id = $1 AND id = $2
          `,
            [object.id, comment]
          );
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

module.exports = {
  putAnnouncementComment,
  putAnnouncement,
  getAnnouncementById,
  deleteAnnouncement,
  deleteAnnouncementComment,
  getAllTopics,
  getAllTopicGroups,
  getTopics,
  getTopicPreReqs,
  getCourseCodes,
  postPreReq,
  deletePreReq,
  postTopicGroup,
  deleteTopicGroup,
  deleteTopic,
  postTopic,
  getAnnouncements,
  postAnnouncement,
  postAnnouncementComment,
  getSearchAnnouncements,
  generateCode,
  getTopicGroup,
  getTopicFile,
  putTopicGroup,
  putTopic,
  putTopicTag,
  getCourseCode,
  deleteCourseCode,
  deleteTopicTag,
  getEnrollments,
  unenrollUser,
  enrollUser,
  enrollUserWithCode,
  setSearchable,
};
