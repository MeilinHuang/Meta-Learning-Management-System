
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

async function getTopics (request, response) { 
  const topicGroupName = request.params.topicGroupName;
  let resp;

  try {
    resp = await pool.query(
      `SELECT array_agg(DISTINCT topics.id) AS topics_list
      FROM topic_group tp_group 
      JOIN topics ON topics.topic_group_id = tp_group.id
      WHERE tp_group.name = $1
      GROUP BY tp_group.id;`, [topicGroupName]);

    var finalQuery = resp.rows;

    for (var object of finalQuery) { 
      var topicArr = [];
      for (const topic_id of object.topics_list) {

        let tmp = await pool.query(
          `SELECT topics.id, topics.topic_group_id, topics.name, array_agg(topic_files.id) as course_materials 
          FROM topics 
          JOIN topic_files ON topic_files.topic_id = topics.id
          WHERE topics.id = $1
          GROUP BY topics.id`
          , [topic_id]);

        var courseMaterialsArr = [];

        for (var material_id of tmp.rows[0].course_materials) {
          let tmp2 = await pool.query(`SELECT * from topic_files WHERE id = $1`, [material_id]);
          courseMaterialsArr.push(tmp2.rows[0]);
        }

        tmp.rows[0].course_materials = courseMaterialsArr;
        topicArr.push(tmp.rows[0]);
      };

      object.topics_list = topicArr;
    }

  } catch(e) {
    console.log(e);
  }

  response.status(200).json(finalQuery[0]);
}

async function getTopicPreReqs (request, response) {
  const topicGroupName = request.params.topicGroupName;
  const topicName = request.params.topicName;
  let resp;
    
  try {
    resp = await pool.query(
      `SELECT array_agg(DISTINCT p.prereq) as prerequisites_list 
      FROM prerequisites p
      JOIN topic_group ON name = $1
      JOIN topics ON topics.topic_group_id = topic_group.id
      WHERE topics.name = $2
      AND topics.topic_group_id = p.topic`, [topicGroupName, topicName]);

    var finalQuery = resp.rows;
    var preReqsArr = [];

    for (var prereq_id of resp.rows[0].prerequisites_list) {
      let tmp = await pool.query(`SELECT * from topics WHERE id = $1`, [prereq_id]);
      preReqsArr.push(tmp.rows[0]);
    }

    finalQuery[0].prerequisites_list = preReqsArr;
  } catch(e) {
    console.log(e);
  }

  response.status(200).json(finalQuery[0]);
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
    'DELETE FROM topic_group WHERE name = $1',
    [topicGroupName]);

  response.status(200).send(`Topic Group deleted with name: ${topicGroupName}`)
}

async function postTopic (request, response) {
  const topicGroupName = request.params.topicGroupName;
  const topicName = request.params.topicName;
  const idResp = await pool.query(`SELECT id FROM topic_group WHERE name = $1`, [topicGroupName]);
  const topicGroupId = idResp.rows[0].id;

  let resp = await pool.query(
    'INSERT INTO topics(id, topic_group_id, name) values(default, $1, $2)',
    [topicGroupId, topicName]);

  response.status(200).send(`Topic created with name: ${topicGroupName}`)
}

/***************************************************************
                       Forum Functions
***************************************************************/

async function getAllForumPosts (request, response) {
  void (request);
  let resp;
  try {
    resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, fp.isPinned, 
      array_agg(DISTINCT t.tag_id) as tags, array_agg(DISTINCT r.reply_id) as replies, array_agg(DISTINCT comments.comment_id) as comments
      FROM forum_posts fp
      LEFT JOIN post_tags pt ON pt.post_id = fp.post_id
      LEFT JOIN tags t ON t.tag_id = pt.tag_id
      LEFT JOIN post_replies pr ON pr.post_id = fp.post_id
      LEFT JOIN replies r ON r.reply_id = pr.reply_id
      LEFT JOIN post_comments pc ON pc.post_id = fp.post_id
      LEFT JOIN comments ON comments.comment_id = pc.comment_id
      GROUP BY fp.post_id`);

    var finalQuery = resp.rows;

    for (var object of finalQuery) { // Loop through list of topic groups
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

  } catch (e) {
    console.log(e);
  }

  response.status(200).json(finalQuery);
}

// Get all pinned forum posts
async function getAllPinnedPosts (request, response) {
  void (request);
  let resp;
  try {
    resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, fp.isPinned, 
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

    var finalQuery = resp.rows;

    for (var object of finalQuery) { // Loop through list of topic groups
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

  } catch (e) {
    console.log(e);
  }

  response.status(200).json(finalQuery);
}

// Get all posts related search term
async function getSearchPosts (request, response) {
  const forumSearchTerm = request.params.forumSearchTerm;
  let resp;
  try {
    resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, fp.isPinned, 
      array_agg(DISTINCT t.tag_id) as tags, array_agg(DISTINCT r.reply_id) as replies, array_agg(DISTINCT comments.comment_id) as comments
      FROM forum_posts fp 
      LEFT JOIN post_tags pt ON pt.post_id = fp.post_id
      LEFT JOIN tags t ON t.tag_id = pt.tag_id
      LEFT JOIN post_replies pr ON pr.post_id = fp.post_id
      LEFT JOIN replies r ON r.reply_id = pr.reply_id
      LEFT JOIN post_comments pc ON pc.post_id = fp.post_id
      LEFT JOIN comments ON comments.comment_id = pc.comment_id
      WHERE LOWER (fp.title) LIKE $1
      OR LOWER (fp.description) LIKE $1
      GROUP BY fp.post_id`, [`%${forumSearchTerm}%`]);

    var finalQuery = resp.rows;

    for (var object of finalQuery) { // Loop through list of topic groups
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

  } catch (e) {
    console.log(e);
  }

  response.status(200).json(finalQuery);
}

// Get all posts related tag term
async function getFilterPosts (request, response) {
  const forumFilterTerm = request.params.forumFilterTerm;
  let resp;
  try {
    resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, fp.isPinned, 
      array_agg(DISTINCT t.tag_id) as tags, array_agg(DISTINCT r.reply_id) as replies, array_agg(DISTINCT comments.comment_id) as comments
      FROM forum_posts fp
      LEFT JOIN post_tags pt ON pt.post_id = fp.post_id
      LEFT JOIN tags t ON t.tag_id = pt.tag_id
      LEFT JOIN post_replies pr ON pr.post_id = fp.post_id
      LEFT JOIN replies r ON r.reply_id = pr.reply_id
      LEFT JOIN post_comments pc ON pc.post_id = fp.post_id
      LEFT JOIN comments ON comments.comment_id = pc.comment_id
      WHERE LOWER(t.name) LIKE $1
      GROUP BY fp.post_id`, [`%${forumFilterTerm}%`]);

    var finalQuery = resp.rows;

    for (var object of finalQuery) { // Loop through list of topic groups
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

  } catch (e) {
    console.log(e);
  }

  response.status(200).json(finalQuery);
}

// Create new post on forum (TAGS MUST ALREADY EXIST and USER MUST EXIST)
async function postForum (request, response) {
  const title = request.body.title;
  const user_id = request.body.user_id;
  const authReq = await pool.query(`SELECT name FROM users WHERE id = $1`, [user_id]);
  const author = authReq.rows[0].name;
  const publishedDate = request.body.publishedDate;
  const description = request.body.description;
  const tags = request.body.tags;

  let resp = await pool.query(
    `INSERT INTO forum_posts(post_id, title, user_id, 
      author, published_date, description, isPinned) 
      values(default, $1, $2, $3, $4, $5, false) 
      RETURNING post_id`,
    [title, user_id, author, publishedDate, description]);

  for (const tag of tags) { // Insert linked tags
    let linkPostTag = await pool.query(
      `INSERT INTO post_tags(post_id, tag_id) VALUES($1, $2)`, [resp.rows[0].post_id, tag.tag_id]);
  }

  response.sendStatus(200);
};

// Get post details of selected post
async function getPostById (request, response) {
  const postId = request.params.postId;
  let resp;
  try {
    resp = await pool.query(
      `SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, fp.isPinned, 
      array_agg(DISTINCT t.tag_id) as tags, array_agg(DISTINCT r.reply_id) as replies, array_agg(DISTINCT comments.comment_id) as comments
      FROM forum_posts fp
      LEFT JOIN post_tags pt ON pt.post_id = fp.post_id
      LEFT JOIN tags t ON t.tag_id = pt.tag_id
      LEFT JOIN post_replies pr ON pr.post_id = fp.post_id
      LEFT JOIN replies r ON r.reply_id = pr.reply_id
      LEFT JOIN post_comments pc ON pc.post_id = fp.post_id
      LEFT JOIN comments ON comments.comment_id = pc.comment_id
      WHERE fp.post_id = $1
      GROUP BY fp.post_id`, [postId]);

    var finalQuery = resp.rows;

    for (var object of finalQuery) { // Loop through list of topic groups
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

  } catch (e) {
    console.log(e);
  }

  response.status(200).json(finalQuery);
};

// Update post details
async function putPost (request, response) {
  const postId = request.params.postId;
  const newDesc = request.body.description;

  try {
    let resp = await pool.query(`UPDATE forum_posts SET description = $1 WHERE post_id = $2`,
    [newDesc, postId]);
    response.status(200).send('Update success');
  } catch(e) {
    response.status(400).send(e);
  }
};

// Update post reply with id
async function putPostReply (request, response) {
  const replyId = request.params.replyId;
  const newReply = request.body.reply;

  let resp = await pool.query(`UPDATE replies SET reply = $1 WHERE reply_id = $2`,
    [newReply, replyId]);
    response.status(200).send('Update success');

  try {
    
  } catch(e) {
    response.status(400).send(e);
  }
};

// Create new reply
async function postReply (request, response) {
  const author = request.body.author;
  const postId = request.params.postId;
  const idReq = await pool.query(`SELECT id FROM users WHERE name = $1`, [author]);
  const user_id = idReq.rows[0].id;
  const publishedDate = request.body.published_date;
  const reply = request.body.reply;

  try {
    let resp = await pool.query(
      `INSERT INTO replies(reply_id, user_id, author, published_date, reply) 
      VALUES(default, $1, $2, $3, $4) RETURNING reply_id`,
      [user_id, author, publishedDate, reply]);

    let linkReply = await pool.query(`INSERT INTO post_replies(post_id, reply_id) 
    VALUES($1, $2)`, [postId, resp.rows[0].reply_id]);
  
    response.status(200).send("Update success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Post new comment
async function postComment (request, response) {
  const author = request.body.author;
  const postId = request.params.postId;
  const idReq = await pool.query(`SELECT id FROM users WHERE name = $1`, [author]);
  const user_id = idReq.rows[0].id;
  const publishedDate = request.body.published_date;
  const comment = request.body.comment;

  try {
    let resp = await pool.query(
      `INSERT INTO comments(comment_id, user_id, author, published_date, comment) 
      VALUES(default, $1, $2, $3, $4) RETURNING comment_id`,
      [user_id, author, publishedDate, comment]);
  
    let linkComment = await pool.query(`INSERT INTO post_comments(post_id, comment_id) 
    VALUES($1, $2)`, [postId, resp.rows[0].comment_id]);

    response.status(200).send("Update success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Pins or unpins forum post
async function putPostPin (request, response) {
  const postId = request.params.postId;
  const isPinned = request.params.isPinned;

  try {
    let resp = await pool.query(`UPDATE forum_posts SET ispinned = $1 WHERE post_id = $2`,
    [isPinned, postId]);
    response.status(200).send('Update success');
  } catch(e) {
    response.status(400).send(e);
  }
}

// Gets all tags
async function getAllTags (request, response) {
  void (request);
  try {
    let resp = await pool.query(`SELECT * FROM tags`);
    response.status(200).json(resp.rows);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Posts tag
async function postTag (request, response) {
  const tagName = request.body.tagName;

  try {
    let resp = await pool.query(`INSERT INTO tags(tag_id, name) VALUES(default, $1)`,
     [tagName]);
    response.status(200).send(`Tag created with name: ${tagName}`);
  } catch(e) {
    response.status(400).send(e);
  } 
};

/***************************************************************
                       Course Pages Functions
***************************************************************/

// Get all announcements of topic group / course
async function getAnnouncements (request, response) {
  const topicGroupName = request.params.topicGroup;
  const tmpQ = await pool.query(`SELECT id FROM topic_group WHERE name = $1`, [topicGroupName]);
  const topicGroupId = tmpQ.rows[0].id;

  try {
    let resp = await pool.query(
      `SELECT a.id, a.author, a.topic_group, a.title, a.content, a.post_date, array_agg(af.name) as attachments
      FROM announcements a
      LEFT JOIN announcement_files af ON af.announcement_id = a.id
      WHERE a.topic_group = $1
      GROUP BY a.id`, [topicGroupId])
    response.status(200).json(resp.rows);
  } catch(e) {
    response.status(400).send(e);
  }
};

// Create new announcement for topic group / course
async function postAnnouncement (request, response) {
  const topicGroupName = request.params.topicGroup;
  const tmpQ = await pool.query(`SELECT id FROM topic_group WHERE name = $1`, [topicGroupName]);
  const topic_group = tmpQ.rows[0].id;
  const author = request.body.author;
  const title = request.body.title;
  const content = request.body.content;
  const postDate = request.body.postDate;
  const attachments = request.body.attachments;

  try {
    let resp = await pool.query(
      `INSERT INTO announcements(id, author, topic_group, title, content, post_date) 
      VALUES(default, $1, $2, $3, $4, $5) RETURNING id`, [author, topic_group, title, content, postDate])
    const aId = resp.rows[0].id;

    // Loop to add attachments to db
    if (attachments.length) {
      for (const item of attachments) {
        let addItem = await pool.query(
          `INSERT INTO announcement_files(id, name, file_id, announcement_id)
          VALUES(default, $1, $1, $2)`, [item, aId])
      }
    }

    response.status(200).send("Post success");
  } catch(e) {
    response.status(400).send(e);
  }
};

// Create new comment for announcement
async function postAnnouncementComment (request, response) {
  //const topicGroupName = request.params.topicGroup;
  const announcementId = request.body.announcementId;
  const author = request.body.author;
  const content = request.body.content;
  const postDate = request.body.postDate;
  const attachments = request.body.attachments;

  let resp = await pool.query(
    `INSERT INTO announcement_comment(id, announcement_id, author, content, post_date) 
    VALUES(default, $1, $2, $3, $4) RETURNING id`, [announcementId, author, content, postDate])
  const aId = resp.rows[0].id;

  // Loop to add attachments to db
  if (attachments.length) {
    for (const item of attachments) {
      let addItem = await pool.query(
        `INSERT INTO announcement_comment_files(id, name, file_id, comment_id)
        VALUES(default, $1, $1, $2)`, [item, aId])
    }
  }

  response.status(200).send("Post comment success");
  try {
    
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
  const questionId = request.params.questionId;

  try {
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
  postQuizQuestion
};