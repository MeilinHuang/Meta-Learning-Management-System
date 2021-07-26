
const { json } = require('express');
const pool = require('./db/database');
var fs = require('fs');

// TODO : ADD AUTH AND JWTOKEN

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
  try {
    let resp = await pool.query(
    `SELECT tp_group.id, tp_group.name, tp_group.topic_code, tp_group.course_outline,
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
        let tmp = await pool.query(`SELECT * FROM topics WHERE id = $1`, [topicId]);
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
  } catch (e) {
    response.sendStatus(400);
    response.send(e);
  }
}

// Get topic group data by name
async function getTopicGroup (request, response) {
  try {
    const topicGroup = request.params.topicGroupName;
    var tgId = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroup]);
    const topicGroupId = tgId.rows[0].id;

    let resp = await pool.query(
      `SELECT tp_group.id, tp_group.name, tp_group.topic_code, array_agg(DISTINCT topics.id) AS topics_list
      FROM topic_group tp_group 
      JOIN topics ON topics.topic_group_id = tp_group.id
      WHERE tp_group.id = $1
      GROUP BY tp_group.id`, [topicGroupId]);

    var topicArr = [];
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
        tmp.rows[0].course_materials = courseMaterialsArr;
        topicArr.push(tmp.rows[0]);
      }
    };

    resp.rows[0].topics_list = topicArr;

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

    for (var prereq_id of resp.rows[0].prerequisites_list) {
      let tmp = await pool.query(`SELECT * from topics WHERE id = $1`, [prereq_id]);
      preReqsArr.push(tmp.rows[0]);
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

  let resp = await pool.query(
    'INSERT INTO prerequisites(prereq, topic) VALUES($1, $2)', [preReqId, topicId]);

  response.status(200).send(`Pre-requisite added with ID: ${preReqId}`)
}

// Delete pre-requisite data
async function deletePreReq (request, response) {
  const preReqId = parseInt(request.preReqId);
  const topicId = parseInt(request.topicId);

  let resp = await pool.query(
    'DELETE FROM prerequisites WHERE prereq = $1 AND topic = $2', [preReqId, topicId]);

  response.status(200).send(
    `Pre-requisite deleted with Topic ID: ${topicId} and Pre-Req ID : ${preReqId}`)

}

// Create topic group
async function postTopicGroup (request, response) {
  const topicGroupName = request.params.topicGroupName;
  const topic_code = request.body.topic_code;
  const course_outline = request.body.course_outline;

  let resp = await pool.query(
    'INSERT INTO topic_group(id, name, topic_code, course_outline) values(default, $1, $2, $3)',
    [topicGroupName, topic_code, course_outline]);

  response.status(200).send(`Topic Group created with name: ${topicGroupName}`)
} 

// Delete a topic group
async function deleteTopicGroup (request, response) {
  const topicGroupName = request.params.topicGroupName;

  let resp = await pool.query(
    'DELETE FROM topic_group WHERE LOWER(name) = LOWER($1)',
    [topicGroupName]);

  response.status(200).send(`Topic Group deleted with name: ${topicGroupName}`)
}

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
    `SELECT id FROM topics WHERE name = $1 AND topic_group_id = $2`
  , [topicName, topicGroupId]);
  if (tmp.rows.length == 0) {
    response.status(400).json({error: "Could not find topic in database"});
    return;
  }
  let topicId = tmp.rows[0].id;
  await pool.query(`DELETE FROM prerequisites WHERE topic = $1 or prereq = $1`, [topicId]);
  await pool.query(`DELETE FROM topics WHERE id = $1`, [topicId]);
  response.status(200).json({ success: true, topicId: topicId});
}

async function postTopic (request, response) {
  const topicGroupName = request.params.topicGroupName;
  const topicName = request.params.topicName;
  const idResp = await pool.query(`SELECT id FROM topic_group WHERE name = $1`, [topicGroupName]);
  if (idResp.rows.length == 0) {
    response.status(400).json({error: "Could not find topic group"});
    return;
  }
  const topicGroupId = idResp.rows[0].id;

  let resp = await pool.query(
    'INSERT INTO topics(id, topic_group_id, name) values(default, $1, $2)',
    [topicGroupId, topicName]);
  
  let tmp = await pool.query(
    `SELECT id FROM topics WHERE name = $1 AND topic_group_id = $2`
  , [topicName, topicGroupId]);
  if (tmp.rows.length == 0) {
    response.status(400).json({error: "Could not find newly created topic in database"});
    return;
  }
  let topicId = tmp.rows[0];

  response.status(200).json(topicId);
}

/***************************************************************
                       Forum Functions
***************************************************************/

async function getAllForumPosts (request, response) {
  void (request);
  try {
    let resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, 
      fp.isPinned, fp.related_link, fp.num_of_upvotes, array_agg(DISTINCT uv.user_id) as upvoters, fp.isEndorsed,
      array_agg(DISTINCT t.tag_id) as tags, array_agg(DISTINCT r.reply_id) as replies, array_agg(DISTINCT comments.comment_id) as comments
      FROM forum_posts fp
      LEFT JOIN post_tags pt ON pt.post_id = fp.post_id
      LEFT JOIN tags t ON t.tag_id = pt.tag_id
      LEFT JOIN post_replies pr ON pr.post_id = fp.post_id
      LEFT JOIN replies r ON r.reply_id = pr.reply_id
      LEFT JOIN post_comments pc ON pc.post_id = fp.post_id
      LEFT JOIN comments ON comments.comment_id = pc.comment_id
      LEFT JOIN upvotes uv ON uv.post_id = fp.post_id
      GROUP BY fp.post_id`);

    for (var object of resp.rows) {
      var tagsArr = [];
      var repliesArr = [];
      var commentsArr = [];
      var upvArr = [];

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

      object.upvoters = upvArr;
      object.tags = tagsArr;
      object.replies = repliesArr;
      object.comments = commentsArr;
    }
    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).send(e.detail);
  }
}

// Get all pinned forum posts
async function getAllPinnedPosts (request, response) {
  void (request);
  try {
    let resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, fp.isPinned, fp.related_link, fp.num_of_upvotes, fp.isEndorsed,
      array_agg(DISTINCT t.tag_id) as tags, array_agg(DISTINCT r.reply_id) as replies, array_agg(DISTINCT comments.comment_id) as comments
      FROM forum_posts fp 
      LEFT JOIN post_tags pt ON pt.post_id = fp.post_id
      LEFT JOIN tags t ON t.tag_id = pt.tag_id
      LEFT JOIN post_replies pr ON pr.post_id = fp.post_id
      LEFT JOIN replies r ON r.reply_id = pr.reply_id
      LEFT JOIN post_comments pc ON pc.post_id = fp.post_id
      LEFT JOIN comments ON comments.comment_id = pc.comment_id
      WHERE fp.isPinned = TRUE
      GROUP BY fp.post_id`);

    for (var object of resp.rows) {
      var tagsArr = [];
      var repliesArr = [];
      var commentsArr = [];

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

      object.tags = tagsArr;
      object.replies = repliesArr;
      object.comments = commentsArr;
    }
    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).send(e.detail);
  }
}

// Get all posts related search term
async function getSearchPosts (request, response) {
  try {
    const forumSearchTerm = request.params.forumSearchTerm;
    let resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, fp.isPinned, fp.related_link, fp.num_of_upvotes, fp.isEndorsed,
      array_agg(DISTINCT t.tag_id) as tags, array_agg(DISTINCT r.reply_id) as replies, array_agg(DISTINCT comments.comment_id) as comments
      FROM forum_posts fp 
      LEFT JOIN post_tags pt ON pt.post_id = fp.post_id
      LEFT JOIN tags t ON t.tag_id = pt.tag_id
      LEFT JOIN post_replies pr ON pr.post_id = fp.post_id
      LEFT JOIN replies r ON r.reply_id = pr.reply_id
      LEFT JOIN post_comments pc ON pc.post_id = fp.post_id
      LEFT JOIN comments ON comments.comment_id = pc.comment_id
      WHERE LOWER (fp.title) LIKE LOWER($1)
      OR LOWER (fp.description) LIKE LOWER($1)
      GROUP BY fp.post_id`, [`%${forumSearchTerm}%`]);

    for (var object of resp.rows) { 
      var tagsArr = [];
      var repliesArr = [];
      var commentsArr = [];

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

      object.tags = tagsArr;
      object.replies = repliesArr;
      object.comments = commentsArr;
    }
    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get all posts related tag term
async function getFilterPosts (request, response) {
  try {
    const forumFilterTerm = request.params.forumFilterTerm;
    let resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, fp.isPinned, fp.related_link, fp.num_of_upvotes, fp.isEndorsed,
      array_agg(DISTINCT t.tag_id) as tags, array_agg(DISTINCT r.reply_id) as replies, array_agg(DISTINCT comments.comment_id) as comments
      FROM forum_posts fp
      LEFT JOIN post_tags pt ON pt.post_id = fp.post_id
      LEFT JOIN tags t ON t.tag_id = pt.tag_id
      LEFT JOIN post_replies pr ON pr.post_id = fp.post_id
      LEFT JOIN replies r ON r.reply_id = pr.reply_id
      LEFT JOIN post_comments pc ON pc.post_id = fp.post_id
      LEFT JOIN comments ON comments.comment_id = pc.comment_id
      WHERE LOWER(t.name) LIKE LOWER($1)
      GROUP BY fp.post_id`, [`%${forumFilterTerm}%`]);

    for (var object of resp.rows) {
      var tagsArr = [];
      var repliesArr = [];
      var commentsArr = [];

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

      object.tags = tagsArr;
      object.replies = repliesArr;
      object.comments = commentsArr;
    }
    response.status(200).json(resp.rows);
  } catch (e) {
    response.send(e);
  }
}

// Create new post on forum (TAGS MUST ALREADY EXIST and USER MUST EXIST)
async function postForum (request, response) {
  const title = request.body.title;
    const user_id = request.body.user_id;
    const authReq = await pool.query(`SELECT name FROM users WHERE id = $1`, [user_id]);

    if (!authReq.rows[0]) { throw (`User does not exist with id: ${user_id}`); }

    const author = authReq.rows[0].name;
    const publishedDate = request.body.publishedDate;
    const description = request.body.description;
    const tags = request.body.tags.split(",");
    const related_link = request.body.related_link;
  
    let resp = await pool.query(
      `INSERT INTO forum_posts(post_id, title, user_id, 
        author, published_date, description, isPinned, related_link, num_of_upvotes, isEndorsed) 
        values(default, $1, $2, $3, $4, $5, false, $6, 0, false) 
        RETURNING post_id`,
      [title, user_id, author, publishedDate, description, related_link]);
  
    if (tags.length) {
      for (const tag of tags) { // Insert linked tags
        await pool.query(`INSERT INTO post_tags(post_id, tag_id) VALUES($1, $2)`, 
        [resp.rows[0].post_id, tag]);
      }
    }

    if (request.files != null) {
      if (!fs.existsSync(`_files/forum_post${resp.rows[0].post_id}`)) { fs.mkdirSync(`_files/forum_post${resp.rows[0].post_id}`) }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO forum_post_files(id, name, file, post_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`_files/forum_post${resp.rows[0].post_id}/${file.name}`), 
          resp.rows[0].post_id]);
          fs.writeFile(`_files/forum_post${resp.rows[0].post_id}/${file.name}`, file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO forum_post_files(id, name, file, post_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`_files/forum_post${resp.rows[0].post_id}/${request.files.uploadFile.name}`), resp.rows[0].post_id]);
        fs.writeFile(`_files/forum_post${resp.rows[0].post_id}/${request.files.uploadFile.name}`, 
        request.files.uploadFile.data, "binary", function (err) {
          if (err) throw err;
        });
      }
    }

    response.sendStatus(200);
  try {
    
  } catch (e) {
    response.status(400).send(e);
  }
};

// Get post details of selected post
async function getPostById (request, response) {
  try {
    const postId = request.params.postId;

    let resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, 
      fp.isPinned, fp.related_link, fp.num_of_upvotes, array_agg(DISTINCT uv.user_id) as upvoters, fp.isEndorsed,
      array_agg(DISTINCT t.tag_id) as tags, array_agg(DISTINCT r.reply_id) as replies, array_agg(DISTINCT comments.comment_id) as comments
      FROM forum_posts fp
      LEFT JOIN post_tags pt ON pt.post_id = fp.post_id
      LEFT JOIN tags t ON t.tag_id = pt.tag_id
      LEFT JOIN post_replies pr ON pr.post_id = fp.post_id
      LEFT JOIN replies r ON r.reply_id = pr.reply_id
      LEFT JOIN post_comments pc ON pc.post_id = fp.post_id
      LEFT JOIN comments ON comments.comment_id = pc.comment_id
      LEFT JOIN upvotes uv ON uv.post_id = fp.post_id
      WHERE fp.post_id = $1
      GROUP BY fp.post_id`, [postId]);

    for (var object of resp.rows) {
      var tagsArr = [];
      var repliesArr = [];
      var commentsArr = [];
      var upvArr = [];

      for (const upvote of object.upvoters) {
        let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [upvote]);
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

      object.upvoters = upvArr;
      object.tags = tagsArr;
      object.replies = repliesArr;
      object.comments = commentsArr;
    }

    response.status(200).json(resp.rows[0]);
  } catch (e) {
    response.status(400).send(e.detail);
  }
};

// Update post details
async function putPost (request, response) {
  try {
    const postId = request.params.postId;
    const newDesc = request.body.description;

    await pool.query(`UPDATE forum_posts SET description = $1 WHERE post_id = $2`,
    [newDesc, postId]);

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
     if (fs.existsSync(`_files/forum_post${postId}`)) { 
      fs.rmdir(`_files/forum_post${postId}`, { recursive: true }, (err) => {
        if (err) { throw err; }
      }); 
    }
    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e.detail);
  }
};

// Update post reply with id
async function putPostReply (request, response) {
  try {
    const replyId = request.params.replyId;
    const newReply = request.body.reply;
    await pool.query(`UPDATE replies SET reply = $1 WHERE reply_id = $2`, [newReply, replyId]);

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e.detail);
  }
};

// Update post reply with id
async function deletePostReply (request, response) {
  try {
    const replyId = request.params.replyId;
    await pool.query(`DELETE FROM replies WHERE reply_id = $1`, [replyId]);

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
    const publishedDate = request.body.published_date;
    const reply = request.body.reply;

    let resp = await pool.query(
      `INSERT INTO replies(reply_id, user_id, author, published_date, reply) 
      VALUES(default, $1, $2, $3, $4) RETURNING reply_id`,
      [user_id, author, publishedDate, reply]);

    let linkReply = await pool.query(`INSERT INTO post_replies(post_id, reply_id) 
    VALUES($1, $2)`, [postId, resp.rows[0].reply_id]);
  
    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
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
    const publishedDate = request.body.published_date;
    const comment = request.body.comment;

    let resp = await pool.query(
      `INSERT INTO comments(comment_id, user_id, author, published_date, comment) 
      VALUES(default, $1, $2, $3, $4) RETURNING comment_id`,
      [user_id, author, publishedDate, comment]);
  
    let linkComment = await pool.query(`INSERT INTO post_comments(post_id, comment_id) 
    VALUES($1, $2)`, [postId, resp.rows[0].comment_id]);

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Put comment
async function putComment (request, response) {
  try {
    const commentId = request.params.commentId;
    const commentDescription = request.body.comment;

    await pool.query(
      `UPDATE comments SET comment = $1 WHERE comment_id = $2`,
      [commentDescription, commentId]);

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e.detail);
  }
};

// Delete new comment
async function deleteComment (request, response) {
  try {
    const commentId = request.params.commentId;
    await pool.query(`DELETE FROM comments WHERE comment_id = $1`, [commentId]);

    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e.detail);
  }
};

// Pins or unpins forum post
async function putPostPin (request, response) {
  try {
    const postId = request.params.postId;
    const isPinned = request.params.isPinned;

    let resp = await pool.query(`UPDATE forum_posts SET ispinned = $1 WHERE post_id = $2`,
    [isPinned, postId]);

    response.sendStatus(200);
  } catch(e) {
    response.status(400);
    response.send(e);
  }
}

// Gets all tags
async function getAllTags (request, response) {
  void (request);
  try {
    let resp = await pool.query(`SELECT * FROM tags`);
    response.status(200).json(resp.rows);
  } catch(e) {
    response.status(400)
    response.send(e);
  }
};

// Posts tag
async function postTag (request, response) {
  try {
    const tagName = request.body.tagName;
    let dupTagCheck = await pool.query(`select exists(select * from tags where lower(name) like lower($1))`, [tagName]);

    if (dupTagCheck.rows[0].exists) {
      response.status(400).json({ error: `Tag '${tagName}' already exists`})
      return
    } 

    let resp = await pool.query(`INSERT INTO tags(tag_id, name) VALUES(default, $1)`, [tagName]);
    response.sendStatus(200);
  } catch(e) {
    response.status(400);
    response.json(e);
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

    let resp = await pool.query(`UPDATE tags SET name = $1 WHERE tag_id = $2`, 
    [request.body.tagName, request.params.tagId]);
    response.sendStatus(200);
  } catch(e) {
    response.status(400);
    response.json(e);
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

    if (resp.rows[0].comments.length) {
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

    for (const attachment of resp.rows[0].attachments) {
      if (attachment != null) { 
        let fileQ = await pool.query(`
        SELECT id, name, file
        FROM announcement_files WHERE announcement_id = $1 AND id = $2
        `, [announcementId, attachment])
        fileArr.push(fileQ.rows[0]);
      }
    }
    resp.rows[0].attachments = fileArr;

    response.status(200).json(resp.rows[0]);
  } catch (e) {
    response.status(400).send(e);
  }
};

// Create new announcement for topic group / course
async function postAnnouncement (request, response) {
  try {
    const topicGroupName = request.params.topicGroup;
    const tmpQ = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`, [topicGroupName]);
    const topic_group = tmpQ.rows[0].id;
    const author = request.body.author;
    const title = request.body.title;
    const content = request.body.content;

    let resp = await pool.query(
      `INSERT INTO announcements(id, author, topic_group, title, content, post_date) 
      VALUES(default, $1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id`,
      [author, topic_group, title, content])

    if (request.files != null) {
      if (!fs.existsSync(`../public/_files/announcement${resp.rows[0].id}`)) { fs.mkdirSync(`../public/_files/announcement${resp.rows[0].id}`) }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO announcement_files(id, name, file, announcement_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`../public/_files/announcement${resp.rows[0].id}/${file.name}`), 
          resp.rows[0].id]);
          fs.writeFile(`../public/_files/announcement${resp.rows[0].id}/${file.name}`, file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO announcement_files(id, name, file, announcement_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`../public/_files/announcement${resp.rows[0].id}/${request.files.uploadFile.name}`), resp.rows[0].id]);
        fs.writeFile(`../public/_files/announcement${resp.rows[0].id}/${request.files.uploadFile.name}`, 
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
    const fileDeleteList = request.body.fileList.split(",");

    await pool.query(`UPDATE announcements SET title = $1, content = $2
    WHERE id = $3`, [title, content, announcementId]);

    if (fileDeleteList.length) {  // Deletes files specified in delete list
      for (const fileId of fileDeleteList) {
        let tmpQ = await pool.query(`DELETE FROM announcement_files WHERE id = $1 RETURNING file`, [fileId]);
        fs.unlinkSync(tmpQ.rows[0].file);
      }
    }

    if (request.files != null) {
      if (!fs.existsSync(`../public/_files/announcement${announcementId}`)) { fs.mkdirSync(`../public/_files/announcement${announcementId}`); }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO announcement_files(id, name, file, announcement_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`../public/_files/announcement${announcementId}/${file.name}`), 
          announcementId]);
          fs.writeFile(`../public/_files/announcement${announcementId}/${file.name}`, file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO announcement_files(id, name, file, announcement_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`../public/_files/announcement${announcementId}/${request.files.uploadFile.name}`), announcementId]);
        fs.writeFile(`../public/_files/announcement${announcementId}/${request.files.uploadFile.name}`, 
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
    if (fs.existsSync(`../public/_files/announcement${announcementId}`)) { 
      fs.rmdir(`../public/_files/announcement${announcementId}`, { recursive: true }, (err) => {
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
      if (!fs.existsSync(`../public/_files/announcement${announcementId}`)) { 
        fs.mkdirSync(`../public/_files/announcement${announcementId}`);
        fs.mkdirSync(`../public/_files/announcement${announcementId}/comment${commId}`);
      } else if (!fs.existsSync(`../public/_files/announcement${announcementId}/comment${commId}`)) { 
        fs.mkdirSync(`../public/_files/announcement${announcementId}/comment${commId}`);
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO announcement_comment_files(id, name, file, comment_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`../public/_files/announcement${announcementId}/comment${commId}/${file.name}`), 
          commId]);
          fs.writeFile(`../public/_files/announcement${announcementId}/comment${commId}/${file.name}`, file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO announcement_comment_files(id, name, file, comment_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`../public/_files/announcement${announcementId}/comment${commId}/${request.files.uploadFile.name}`), commId]);
        fs.writeFile(`../public/_files/announcement${announcementId}/comment${commId}/${request.files.uploadFile.name}`, 
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
    const fileDeleteList = request.body.fileList.split(","); // List of files to delete associated with commentid

    await pool.query(`UPDATE announcement_comment SET content = $1 WHERE id = $2`, [content, commentId]);

    if (fileDeleteList.length) {  // Deletes files specified in delete list
      for (const fileId of fileDeleteList) {
        let tmpQ = await pool.query(`DELETE FROM announcement_comment_files WHERE id = $1 RETURNING file`, [fileId]);
        fs.unlinkSync(tmpQ.rows[0].file);
      }
    }

    if (request.files != null) {
      if (!fs.existsSync(`../public/_files/announcement${announcementId}`)) { 
        fs.mkdirSync(`../public/_files/announcement${announcementId}`);
        fs.mkdirSync(`../public/_files/announcement${announcementId}/comment${commentId}`) 
      } else if (!fs.existsSync(`../public/_files/announcement${announcementId}/comment${commentId}`)) { 
        fs.mkdirSync(`../public/_files/announcement${announcementId}/comment${commentId}`) 
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(`INSERT INTO announcement_comment_files(id, name, file, comment_id)
          VALUES(default, $1, $2, $3)`, [file.name, (`../public/_files/announcement${announcementId}/comment${commentId}/${file.name}`), 
          commentId]);
          fs.writeFile(`../public/_files/announcement${announcementId}/comment${commentId}/${file.name}`, file.name, "binary", function (err) { if (err) throw err; });
        }
      } else {
        await pool.query(`INSERT INTO announcement_comment_files(id, name, file, comment_id)
        VALUES(default, $1, $2, $3)`, [request.files.uploadFile.name, 
        (`../public/_files/announcement${announcementId}/comment${commentId}/${request.files.uploadFile.name}`), commentId]);
        fs.writeFile(`../public/_files/announcement${announcementId}/comment${commentId}/${request.files.uploadFile.name}`, 
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
    if (fs.existsSync(`../public/_files/announcement${aId}/comment${commentId}`)) { 
      fs.rmdir(`../public/_files/announcement${aId}/comment${commentId}`, { recursive: true }, (err) => {
        if (err) { throw err; }
      }); 
    }
    response.sendStatus(200);
  } catch(e) {
    response.status(400).send(e);
  }
};

/***************************************************************
                       Gamification Functions
***************************************************************/

async function getQuestions (request, response) {
  void (request);
  try {
    let resp = await pool.query(
      `SELECT * from gamification_question`)
    response.status(200).json(resp.rows);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Create new gamification question
async function postQuestion (request, response) {
  const title = request.body.title;
  const questionType = request.body.questionType;
  const potentialAnswer = request.body.potentialAnswers;
  const correctAnswer = request.body.correctAnswer;
  const timeStampQuery = await pool.query(`SELECT current_timestamp`);
  const availableFrom = timeStampQuery.rows[0].current_timestamp;
  const numberOfAnswers = request.body.numberOfAnswers;
  const mediaLink = request.body.mediaLink;
  const estimatedTime = request.body.estimatedTimeRequired;

  let resp = await pool.query(
    `INSERT INTO gamification_question(id, title, questiontype, potentialAnswers, 
     correctAnswer, availableFrom, numberOfAnswers, mediaLink, estimatedTimeRequired)
     VALUES(default, $1, $2, $3, $4, $5, $6, $7, $8)`, [title, questionType, potentialAnswer, correctAnswer,
    availableFrom, numberOfAnswers, mediaLink, estimatedTime]);

  response.status(200).send("Post gamification question success");
  try {
    
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get level data from question
async function getLevelFromQuestion (request, response) {
  const questionId = request.params.questionId;
  try {
    let resp = await pool.query(
      `SELECT * from levels 
      JOIN levels_questions ON question_id = $1 AND level_id = levels.id;`, [questionId])
    response.status(200).json(resp.rows);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Edit existing question data
async function putQuestion (request, response) {
  const questionId = request.params.questionId;
  const title = request.body.title;
  const questionType = request.body.questionType;
  const potentialAnswer = request.body.potentialAnswers;
  const correctAnswer = request.body.correctAnswer;
  const availableFrom = request.body.availableFrom;
  const numberOfAnswers = request.body.numberOfAnswers;
  const mediaLink = request.body.mediaLink;
  const estimatedTime = request.body.estimatedTimeRequired;
  
  try {
    let resp = await pool.query(
      `UPDATE gamification_question SET title = $1, 
      questionType = $2, potentialAnswers = $3, correctAnswer = $4, 
      availableFrom = $5, numberOfAnswers = $6, mediaLink = $7, estimatedTimeRequired = $8
      WHERE id = $9`,
      [title, questionType, potentialAnswer, correctAnswer,
      availableFrom, numberOfAnswers, mediaLink, estimatedTime, questionId]);
    response.status(200).send("Gamification Question Update Success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Delete question from id
async function deleteQuestion (request, response) {
  const questionId = request.params.questionId;
  
  try {
    let resp = await pool.query(
      `DELETE FROM gamification_question WHERE id = $1`,
      [questionId]);
    response.status(200).send("Gamification Question Delete Success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get all gamification levels
async function getAllLevels (request, response) {
  void (request);
  try {
    let resp = await pool.query(
      `SELECT * from levels`)
    response.status(200).json(resp.rows);
  } catch(e) {
    response.status(400).send(e);
  }
}

// Get all gamification levels
async function getLevelById (request, response) {
  const levelId = request.params.levelId;
  try {
    let resp = await pool.query(
      `SELECT * from levels WHERE id = $1`, [levelId]);
    response.status(200).json(resp.rows);
  } catch(e) {
    response.status(400).send(e);
  }
}

// Edit existing level data
async function putLevel (request, response) {
  const levelId = request.params.levelId;
  const title = request.body.title;
  const topicGroupId = request.body.topicGroupId;
  const levelType = request.body.levelType;
  const availableFrom = request.body.availableFrom;
  const questionNumbers = request.body.questionNumbers;
  const estimatedTime = request.body.estimatedTimeRequired;

  try {
    let resp = await pool.query(
      `UPDATE levels SET title = $1, topic_group_id = $2, typeoflevel = $3, 
      availableFrom = $4, numberofquestions = $5, estimatedTimeRequired = $6
      WHERE id = $7`, [title, topicGroupId, levelType, availableFrom, 
      questionNumbers, estimatedTime, levelId]);
    response.status(200).send("Update level success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Delete level from id
async function deleteLevel (request, response) {
  const levelId = request.params.levelId;
  try {
    let resp = await pool.query(
      `DELETE from levels WHERE id = $1`, [levelId]);
    response.status(200).send("Delete level success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Create new level 
async function postLevel (request, response) {
  const title = request.body.title;
  const topicGroupId = request.body.topicGroupId;
  const levelType = request.body.levelType;
  const availableFrom = request.body.availableFrom;
  const questionNumbers = request.body.questionNumbers;
  const estimatedTime = request.body.estimatedTimeRequired;

  try {
    let resp = await pool.query(
      `INSERT INTO levels(id, title, topic_group_id, typeOfLevel, 
        availableFrom, numberOfQuestions, estimatedTimeRequired) 
      VALUES(default, $1, $2, $3, $4, $5, $6) RETURNING id`,
      [title, topicGroupId, levelType, availableFrom, questionNumbers, estimatedTime]);

    let insertLink = await pool.query(`INSERT INTO topic_group_levels(topic_group_id, levelsid) 
    VALUES($1, $2)`, [topicGroupId, resp.rows[0].id]);
    response.status(200).send("Post level success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get all questions linked to level 
async function getLevelQuestions (request, response) {
  const levelName = request.params.level;

  try {
    let resp = await pool.query(
      `SELECT array_agg(q.id) as questions_list
      FROM gamification_question q
      JOIN levels_questions lq ON lq.question_id = q.id
      JOIN levels l ON l.title = $1 AND lq.level_id = l.id`,
      [levelName]);

      var finalQuery = resp.rows;

      for (var object of finalQuery) { // Loop through list of topic groups
        var questionsArr = [];
  
        for (const questionId of object.questions_list) {
          let tmp = await pool.query(`SELECT * FROM gamification_question WHERE id = $1`, [questionId]);
          questionsArr.push(tmp.rows[0]);
        };
  
        object.questions_list = questionsArr;
      }

    response.status(200).json(finalQuery[0]);

  } catch(e) {
    response.status(400).send(e);
  }
};

// Remove level from topic group
async function removeTGLevel (request, response) {
  const topicGroupName = request.params.topicGroup;
  const tgQuery = await pool.query(`SELECT id FROM topic_group WHERE name = $1`, [topicGroupName]);
  const tgId = tgQuery.rows[0].id;
  const level = request.params.level;

  try {
    let resp = await pool.query(
      `DELETE FROM levels 
      WHERE levels.title = $1 AND levels.id IN 
      (SELECT levelsid from topic_group_levels WHERE topic_group_id = $2);`,
      [level, tgId]);

    response.status(200).send("Removed level from topic group");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Post new level for topic group
async function postTGLevel (request, response) {
  const title = request.body.title;
  const topicGroupId = request.params.topicGroupId;
  const levelType = request.body.levelType;
  const availableFrom = request.body.availableFrom;
  const questionNumbers = request.body.questionNumbers;
  const estimatedTime = request.body.estimatedTimeRequired;

  try {
    let resp = await pool.query(
      `INSERT INTO levels(id, title, topic_group_id, typeOfLevel, 
        availableFrom, numberOfQuestions, estimatedTimeRequired) 
      VALUES(default, $1, $2, $3, $4, $5, $6) RETURNING id`,
      [title, topicGroupId, levelType, availableFrom, questionNumbers, estimatedTime]);

    let insertLink = await pool.query(`INSERT INTO topic_group_levels(topic_group_id, levelsid) 
    VALUES($1, $2)`, [topicGroupId, resp.rows[0].id]);

    response.status(200).send("Post topic group level success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Get list of levels for topic group
async function getTGLevels (request, response) {
  const topicGroupId = request.params.topicGroupId;
  try {
    let resp = await pool.query(
      `SELECT l.id, l.title, l.topic_group_id, l.typeOfLevel, 
      l.availableFrom, l.numberOfquestions, l.estimatedTimeRequired
      FROM levels l 
      JOIN topic_group_levels tgl ON tgl.levelsid = l.id AND tgl.topic_group_id = $1`, [topicGroupId])
    response.status(200).json(resp.rows);
  } catch(e) {
    response.status(400).send(e);
  }
};

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
  getTGLevels,
  postTGLevel,
  removeTGLevel,
  getLevelQuestions,
  getUser,
  postAdmin,
  deleteUser,
  deleteAdmin,
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
  getQuestions,
  postQuestion,
  getLevelFromQuestion,
  putQuestion,
  deleteQuestion,
  getAllLevels,
  getLevelById,
  putLevel,
  deleteLevel,
  postLevel,
  postQuizQuestion,
  getTopicGroup
};
