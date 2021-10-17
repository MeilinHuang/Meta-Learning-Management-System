const jwt = require("jsonwebtoken");
const pool = require("../db/database");
var fs = require("fs");

const JWT_SECRET = "metalms";

/***************************************************************
                       Forum Functions
***************************************************************/

async function getAllForumPosts(request, response) {
  try {
    const topicGroupName = request.params.topicGroup;
    const tmpQ = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );
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
      GROUP BY fp.post_id`,
      [topicGroupId]
    );

    for (var object of resp.rows) {
      var tagsArr = [];
      var repliesArr = [];
      var commentsArr = [];
      var upvArr = [];
      var fileArr = [];

      for (const upvId of object.upvoters) {
        let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [
          upvId,
        ]);
        upvArr.push(tmp.rows[0]);
      }

      for (const tagId of object.tags) {
        let tmp = await pool.query(`SELECT * FROM tags WHERE tag_id = $1`, [
          tagId,
        ]);
        tagsArr.push(tmp.rows[0]);
      }

      for (const replyId of object.replies) {
        let tmp = await pool.query(
          `SELECT * FROM replies WHERE reply_id = $1`,
          [replyId]
        );
        repliesArr.push(tmp.rows[0]);
      }

      for (const commentId of object.comments) {
        let tmp = await pool.query(
          `SELECT * FROM comments WHERE comment_id = $1`,
          [commentId]
        );
        commentsArr.push(tmp.rows[0]);
      }

      for (const fileId of object.attachments) {
        let tmp = await pool.query(
          `SELECT * FROM forum_post_files WHERE id = $1`,
          [fileId]
        );
        fileArr.push(tmp.rows[0]);
      }

      object.upvoters = upvArr;
      object.tags = tagsArr;
      object.replies = repliesArr;
      object.comments = commentsArr;
      object.attachments = fileArr;
    }
    console.log(resp.rows);
    response.status(200).json(resp.rows);
  } catch (e) {
    console.log(e);
    response.status(400).send(e.detail);
  }
}

// Get all pinned forum posts
async function getAllPinnedPosts(request, response) {
  try {
    const topicGroupName = request.params.topicGroup;
    const tmpQ = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );
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
      GROUP BY fp.post_id`,
      [topicGroupId]
    );

    for (var object of resp.rows) {
      var tagsArr = [];
      var repliesArr = [];
      var commentsArr = [];
      var upvArr = [];
      var fileArr = [];

      for (const upvId of object.upvoters) {
        let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [
          upvId,
        ]);
        upvArr.push(tmp.rows[0]);
      }

      for (const tagId of object.tags) {
        let tmp = await pool.query(`SELECT * FROM tags WHERE tag_id = $1`, [
          tagId,
        ]);
        tagsArr.push(tmp.rows[0]);
      }

      for (const replyId of object.replies) {
        let tmp = await pool.query(
          `SELECT * FROM replies WHERE reply_id = $1`,
          [replyId]
        );
        repliesArr.push(tmp.rows[0]);
      }

      for (const commentId of object.comments) {
        let tmp = await pool.query(
          `SELECT * FROM comments WHERE comment_id = $1`,
          [commentId]
        );
        commentsArr.push(tmp.rows[0]);
      }

      for (const fileId of object.attachments) {
        let tmp = await pool.query(
          `SELECT * FROM forum_post_files WHERE id = $1`,
          [fileId]
        );
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
async function getSearchPosts(request, response) {
  try {
    const topicGroupName = request.params.topicGroup;
    const tmpQ = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );
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
      GROUP BY fp.post_id`,
      [`%${forumSearchTerm}%`, topicGroupId]
    );

    for (var object of resp.rows) {
      var tagsArr = [];
      var repliesArr = [];
      var commentsArr = [];
      var upvArr = [];
      var fileArr = [];

      for (const upvId of object.upvoters) {
        let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [
          upvId,
        ]);
        upvArr.push(tmp.rows[0]);
      }

      for (const tagId of object.tags) {
        let tmp = await pool.query(`SELECT * FROM tags WHERE tag_id = $1`, [
          tagId,
        ]);
        tagsArr.push(tmp.rows[0]);
      }

      for (const replyId of object.replies) {
        let tmp = await pool.query(
          `SELECT * FROM replies WHERE reply_id = $1`,
          [replyId]
        );
        repliesArr.push(tmp.rows[0]);
      }

      for (const commentId of object.comments) {
        let tmp = await pool.query(
          `SELECT * FROM comments WHERE comment_id = $1`,
          [commentId]
        );
        commentsArr.push(tmp.rows[0]);
      }

      for (const fileId of object.attachments) {
        let tmp = await pool.query(
          `SELECT * FROM forum_post_files WHERE id = $1`,
          [fileId]
        );
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
async function getFilterPosts(request, response) {
  try {
    const topicGroupName = request.params.topicGroup;
    const tmpQ = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );

    if (tmpQ.rows.length == 0) throw new Error (`Topic Group with name ${topicGroupName} does not exist`);

    const topicGroupId = tmpQ.rows[0].id;
    const filterTerms = request.query.forumFilterTerms.split(",");

    let query = (`SELECT fp.post_id, fp.title, fp.user_id, fp.author, fp.published_date, fp.description, 
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
    WHERE fp.topic_group = ${topicGroupId}`);

    if (filterTerms.length) {
      query += ` AND (`
      for (var i = 0; i <= filterTerms.length; i++) {
        query += `LOWER(t.name) LIKE LOWER('${filterTerms[i]}')`;
        if (i+1 <= filterTerms.length) query += ` OR `;
      }
      query += `) `;
    }
    
    query += `GROUP BY fp.post_id`;

    let resp = await pool.query(query);

    for (var object of resp.rows) {
      var tagsArr = [];
      var repliesArr = [];
      var commentsArr = [];
      var upvArr = [];
      var fileArr = [];

      for (const upvId of object.upvoters) {
        let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [
          upvId,
        ]);
        upvArr.push(tmp.rows[0]);
      }

      for (const tagId of object.tags) {
        let tmp = await pool.query(`SELECT * FROM tags WHERE tag_id = $1`, [
          tagId,
        ]);
        tagsArr.push(tmp.rows[0]);
      }

      for (const replyId of object.replies) {
        let tmp = await pool.query(
          `SELECT * FROM replies WHERE reply_id = $1`,
          [replyId]
        );
        repliesArr.push(tmp.rows[0]);
      }

      for (const commentId of object.comments) {
        let tmp = await pool.query(
          `SELECT * FROM comments WHERE comment_id = $1`,
          [commentId]
        );
        commentsArr.push(tmp.rows[0]);
      }

      for (const fileId of object.attachments) {
        let tmp = await pool.query(
          `SELECT * FROM forum_post_files WHERE id = $1`,
          [fileId]
        );
        fileArr.push(tmp.rows[0]);
      }

      object.upvoters = upvArr;
      object.tags = tagsArr;
      object.replies = repliesArr;
      object.comments = commentsArr;
      object.attachments = fileArr;
    }

    if (resp.rows.length == 0) throw (`Error: No posts found with filter`);
 
    response.status(200).json(resp.rows);
  } catch (e) {
    response.send(e);
  }
}

// Create new post on forum (TAGS MUST ALREADY EXIST and USER MUST EXIST)
async function postForum(request, response) {
  try {
    const title = request.body.title;
    const user_id = request.body.user_id;
    const authReq = await pool.query(`SELECT name FROM users WHERE id = $1`, [
      user_id,
    ]);

    if (!authReq.rows[0]) throw (`User does not exist with id: ${user_id}`);

    const author = authReq.rows[0].name;
    const publishedDate = request.body.publishedDate;
    const description = request.body.description;
    const related_link = request.body.related_link;

    const topicGroupName = request.params.topicGroup;
    const tmpQ = await pool.query(
      `SELECT id FROM topic_group WHERE LOWER(name) = LOWER($1)`,
      [topicGroupName]
    );
    const topicGroupId = tmpQ.rows[0].id;

    let resp = await pool.query(
      `INSERT INTO forum_posts(post_id, title, user_id, 
        author, published_date, description, isPinned, related_link, num_of_upvotes, isEndorsed, topic_group) 
        values(default, $1, $2, $3, $4, $5, false, $6, 0, false, $7) 
        RETURNING post_id`,
      [
        title,
        user_id,
        author,
        publishedDate,
        description,
        related_link,
        topicGroupId,
      ]
    );

    if (request.body.tags) {
      const tags = request.body.tags.split(",");
      if (tags.length) {
        for (const tag of tags) {
          // Insert linked tags
          await pool.query(
            `INSERT INTO post_tags(post_id, tag_id) VALUES($1, $2)`,
            [resp.rows[0].post_id, tag]
          );
        }
      }
    }

    if (request.files != null) {
      if (
        !fs.existsSync(
          `../frontend/public/_files/forum_post${resp.rows[0].post_id}`
        )
      ) {
        fs.mkdirSync(
          `../frontend/public/_files/forum_post${resp.rows[0].post_id}`
        );
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(
            `INSERT INTO forum_post_files(id, name, file, post_id)
          VALUES(default, $1, $2, $3)`,
            [
              file.name,
              `/_files/forum_post${resp.rows[0].post_id}/${file.name}`,
              resp.rows[0].post_id,
            ]
          );
          fs.writeFile(
            `../frontend/public/_files/forum_post${resp.rows[0].post_id}/${file.name}`,
            file.name,
            "binary",
            function (err) {
              if (err) throw err;
            }
          );
        }
      } else {
        await pool.query(
          `INSERT INTO forum_post_files(id, name, file, post_id)
        VALUES(default, $1, $2, $3)`,
          [
            request.files.uploadFile.name,
            `/_files/forum_post${resp.rows[0].post_id}/${request.files.uploadFile.name}`,
            resp.rows[0].post_id,
          ]
        );
        fs.writeFile(
          `../frontend/public/_files/forum_post${resp.rows[0].post_id}/${request.files.uploadFile.name}`,
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
    console.log(e);
    response.status(400).send(e);
  }
}

// Get post details of selected post
async function getPostById(request, response) {
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
      GROUP BY fp.post_id`,
      [postId]
    );

    for (var object of resp.rows) {
      var tagsArr = [];
      var repliesArr = [];
      var commentsArr = [];
      var upvArr = [];
      var fileArr = [];

      for (const upvId of object.upvoters) {
        let tmp = await pool.query(`SELECT * FROM users WHERE id = $1`, [
          upvId,
        ]);
        upvArr.push(tmp.rows[0]);
      }

      for (const tagId of object.tags) {
        let tmp = await pool.query(`SELECT * FROM tags WHERE tag_id = $1`, [
          tagId,
        ]);
        tagsArr.push(tmp.rows[0]);
      }

      for (const replyId of object.replies) {
        // forum reply files
        var replyFileArr = [];

        let tmp = await pool.query(
          `
        SELECT r.reply_id, r.user_id, r.author, r.published_date, r.reply,
        array_agg(file.id) as attachments
        FROM replies r
        LEFT JOIN forum_reply_files file ON file.reply_id = r.reply_id
        WHERE r.reply_id = $1
        GROUP BY r.reply_id`,
          [replyId]
        );

        if (!tmp.rows[0]) {
          continue;
        }

        for (const fileId of tmp.rows[0].attachments) {
          let tmp = await pool.query(
            `SELECT * FROM forum_reply_files WHERE id = $1`,
            [fileId]
          );
          replyFileArr.push(tmp.rows[0]);
        }
        tmp.rows[0].attachments = replyFileArr;
        repliesArr.push(tmp.rows[0]);
      }

      for (const commentId of object.comments) {
        // forum comment files
        var commentFileArr = [];

        let tmp = await pool.query(
          `
        SELECT c.comment_id, c.user_id, c.author, c.published_date, c.comment, c.isEndorsed,
        array_agg(file.id) as attachments
        FROM comments c
        LEFT JOIN forum_comment_files file ON file.comment_id = c.comment_id
        WHERE c.comment_id = $1
        GROUP BY c.comment_id`,
          [commentId]
        );

        if (!tmp.rows[0]) {
          continue;
        }

        for (const fileId of tmp.rows[0].attachments) {
          let tmp = await pool.query(
            `SELECT * FROM forum_comment_files WHERE id = $1`,
            [fileId]
          );
          commentFileArr.push(tmp.rows[0]);
        }
        tmp.rows[0].attachments = commentFileArr;
        commentsArr.push(tmp.rows[0]);
      }

      for (const fileId of object.attachments) {
        // forum post files
        let tmp = await pool.query(
          `SELECT * FROM forum_post_files WHERE id = $1`,
          [fileId]
        );
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
    console.log(e);
    response.status(400).send(e.detail);
  }
}

// Update post details
async function putPost(request, response) {
  try {
    const postId = request.params.postId;
    const newDesc = request.body.description;
    const relLink = request.body.related_link;

    // Deletes files specified in delete list
    if (request.body.fileDeleteList) {
      const deleteList = request.body.fileDeleteList.split(",");
      for (const fileId of deleteList) {
        let fileResp = await pool.query(
          `DELETE FROM forum_post_files WHERE id = $1 RETURNING file`,
          [fileId]
        );
        fs.unlinkSync("../frontend/public" + fileResp.rows[0].file);
      }
    }

    await pool.query(
      `UPDATE forum_posts SET description = $1, related_link = $2 WHERE post_id = $3`,
      [newDesc, relLink, postId]
    );

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/forum_post${postId}`)) {
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}`);
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(
            `INSERT INTO forum_post_files(id, name, file, post_id)
          VALUES(default, $1, $2, $3)`,
            [file.name, `/_files/forum_post${postId}/${file.name}`, postId]
          );
          fs.writeFile(
            `../frontend/public/_files/forum_post${postId}/${file.name}`,
            file.name,
            "binary",
            function (err) {
              if (err) throw err;
            }
          );
        }
      } else {
        await pool.query(
          `INSERT INTO forum_post_files(id, name, file, post_id)
        VALUES(default, $1, $2, $3)`,
          [
            request.files.uploadFile.name,
            `/_files/forum_post${postId}/${request.files.uploadFile.name}`,
            postId,
          ]
        );
        fs.writeFile(
          `../frontend/public/_files/forum_post${postId}/${request.files.uploadFile.name}`,
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

// delete forum post
async function deletePost(request, response) {
  try {
    const postId = request.params.postId;
    await pool.query(`DELETE FROM forum_posts WHERE post_id = $1`, [postId]);
    if (fs.existsSync(`../frontend/public/_files/forum_post${postId}`)) {
      fs.rmdir(
        `../frontend/public/_files/forum_post${postId}`,
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
    response.status(400).send(e.detail);
  }
}

// Create new reply
async function postReply(request, response) {
  try {
    const user_id = request.body.user_id;
    const authReq = await pool.query(`SELECT name FROM users WHERE id = $1`, [
      user_id,
    ]);

    if (typeof authReq.rows[0].name == "undefined") {
      throw `User doesn't exist with id: ${user_id}`;
    }

    const author = authReq.rows[0].name;
    const postId = request.params.postId;
    const reply = request.body.reply;

    let resp = await pool.query(
      `INSERT INTO replies(reply_id, user_id, author, published_date, reply) 
      VALUES(default, $1, $2, CURRENT_TIMESTAMP, $3) RETURNING reply_id`,
      [user_id, author, reply]
    );

    await pool.query(
      `INSERT INTO post_replies(post_id, reply_id) 
    VALUES($1, $2)`,
      [postId, resp.rows[0].reply_id]
    );

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/forum_post${postId}`)) {
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}`);
        fs.mkdirSync(
          `../frontend/public/_files/forum_post${postId}/reply${resp.rows[0].reply_id}`
        );
      } else if (
        !fs.existsSync(
          `../frontend/public/_files/forum_post${postId}/reply${resp.rows[0].reply_id}`
        )
      ) {
        fs.mkdirSync(
          `../frontend/public/_files/forum_post${postId}/reply${resp.rows[0].reply_id}`
        );
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(
            `INSERT INTO forum_reply_files(id, name, file, reply_id)
          VALUES(default, $1, $2, $3)`,
            [
              file.name,
              `/_files/forum_post${postId}/reply${resp.rows[0].reply_id}/${file.name}`,
              postId,
            ]
          );
          fs.writeFile(
            `../frontend/public/_files/forum_post${postId}/reply${resp.rows[0].reply_id}/${file.name}`,
            file.name,
            "binary",
            function (err) {
              if (err) throw err;
            }
          );
        }
      } else {
        await pool.query(
          `INSERT INTO forum_reply_files(id, name, file, reply_id)
        VALUES(default, $1, $2, $3)`,
          [
            request.files.uploadFile.name,
            `/_files/forum_post${postId}/reply${resp.rows[0].reply_id}/${request.files.uploadFile.name}`,
            postId,
          ]
        );
        fs.writeFile(
          `../frontend/public/_files/forum_post${postId}/reply${resp.rows[0].reply_id}/${request.files.uploadFile.name}`,
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

// Update post reply with id
async function putPostReply(request, response) {
  try {
    const replyId = request.params.replyId;
    const postId = request.params.postId;
    const newReply = request.body.reply;

    if (request.body.fileDeleteList) {
      const deleteList = request.body.fileDeleteList.split(",");
      for (const fileId of deleteList) {
        let fileResp = await pool.query(
          `DELETE FROM forum_reply_files WHERE id = $1 RETURNING file`,
          [fileId]
        );
        fs.unlinkSync("../frontend/public" + fileResp.rows[0].file);
      }
    }

    await pool.query(`UPDATE replies SET reply = $1 WHERE reply_id = $2`, [
      newReply,
      replyId,
    ]);

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/forum_post${postId}`)) {
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}`);
        fs.mkdirSync(
          `../frontend/public/_files/forum_post${postId}/reply${replyId}`
        );
      } else if (
        !fs.existsSync(
          `../frontend/public/_files/forum_post${postId}/reply${replyId}`
        )
      ) {
        fs.mkdirSync(
          `../frontend/public/_files/forum_post${postId}/reply${replyId}`
        );
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(
            `INSERT INTO forum_reply_files(id, name, file, reply_id)
          VALUES(default, $1, $2, $3)`,
            [
              file.name,
              `/_files/forum_post${postId}/reply${replyId}/${file.name}`,
              postId,
            ]
          );
          fs.writeFile(
            `../frontend/public/_files/forum_post${postId}/reply${replyId}/${file.name}`,
            file.name,
            "binary",
            function (err) {
              if (err) throw err;
            }
          );
        }
      } else {
        await pool.query(
          `INSERT INTO forum_reply_files(id, name, file, reply_id)
        VALUES(default, $1, $2, $3)`,
          [
            request.files.uploadFile.name,
            `/_files/forum_post${postId}/reply${replyId}/${request.files.uploadFile.name}`,
            postId,
          ]
        );
        fs.writeFile(
          `../frontend/public/_files/forum_post${postId}/reply${replyId}/${request.files.uploadFile.name}`,
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
    response.status(400).send(e.detail);
  }
}

// Update post reply with id
async function deletePostReply(request, response) {
  try {
    const replyId = request.params.replyId;
    const postId = request.params.postId;
    await pool.query(`DELETE FROM replies WHERE reply_id = $1`, [replyId]);
    if (
      fs.existsSync(
        `../frontend/public/_files/forum_post${postId}/reply${replyId}`
      )
    ) {
      fs.rmdir(
        `../frontend/public/_files/forum_post${postId}/reply${replyId}`,
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
    response.status(400).send(e.detail);
  }
}

// Post new comment
async function postComment(request, response) {
  try {
    const user_id = request.body.user_id;
    const authReq = await pool.query(`SELECT name FROM users WHERE id = $1`, [
      user_id,
    ]);
    if (typeof authReq.rows[0].name == "undefined") {
      throw `User doesn't exist with id: ${user_id}`;
    }
    const author = authReq.rows[0].name;
    const postId = request.params.postId;
    const comment = request.body.comment;

    let resp = await pool.query(
      `INSERT INTO comments(comment_id, user_id, author, published_date, comment, isEndorsed) 
      VALUES(default, $1, $2, CURRENT_TIMESTAMP, $3, false) RETURNING comment_id`,
      [user_id, author, comment]
    );

    await pool.query(
      `INSERT INTO post_comments(post_id, comment_id) 
    VALUES($1, $2)`,
      [postId, resp.rows[0].comment_id]
    );

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/forum_post${postId}`)) {
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}`);
        fs.mkdirSync(
          `../frontend/public/_files/forum_post${postId}/comment${resp.rows[0].comment_id}`
        );
      } else if (
        !fs.existsSync(
          `../frontend/public/_files/forum_post${postId}/comment${resp.rows[0].comment_id}`
        )
      ) {
        fs.mkdirSync(
          `../frontend/public/_files/forum_post${postId}/comment${resp.rows[0].comment_id}`
        );
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(
            `INSERT INTO forum_comment_files(id, name, file, comment_id)
          VALUES(default, $1, $2, $3)`,
            [
              file.name,
              `/_files/forum_post${postId}/comment${resp.rows[0].comment_id}/${file.name}`,
              postId,
            ]
          );
          fs.writeFile(
            `../frontend/public/_files/forum_post${postId}/comment${resp.rows[0].comment_id}/${file.name}`,
            file.name,
            "binary",
            function (err) {
              if (err) throw err;
            }
          );
        }
      } else {
        await pool.query(
          `INSERT INTO forum_comment_files(id, name, file, comment_id)
        VALUES(default, $1, $2, $3)`,
          [
            request.files.uploadFile.name,
            `/_files/forum_post${postId}/comment${resp.rows[0].comment_id}/${request.files.uploadFile.name}`,
            postId,
          ]
        );
        fs.writeFile(
          `../frontend/public/_files/forum_post${postId}/comment${resp.rows[0].comment_id}/${request.files.uploadFile.name}`,
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

// Put comment
async function putComment(request, response) {
  try {
    const postId = request.params.postId;
    const commentId = request.params.commentId;
    const commentDescription = request.body.comment;

    if (request.body.fileDeleteList) {
      const deleteList = request.body.fileDeleteList.split(",");
      for (const fileId of deleteList) {
        let fileResp = await pool.query(
          `DELETE FROM forum_comment_files WHERE id = $1 RETURNING file`,
          [fileId]
        );
        fs.unlinkSync("../frontend/public" + fileResp.rows[0].file);
      }
    }

    await pool.query(`UPDATE comments SET comment = $1 WHERE comment_id = $2`, [
      commentDescription,
      commentId,
    ]);

    if (request.files != null) {
      if (!fs.existsSync(`../frontend/public/_files/forum_post${postId}`)) {
        fs.mkdirSync(`../frontend/public/_files/forum_post${postId}`);
        fs.mkdirSync(
          `../frontend/public/_files/forum_post${postId}/comment${commentId}`
        );
      } else if (
        !fs.existsSync(
          `../frontend/public/_files/forum_post${postId}/comment${commentId}`
        )
      ) {
        fs.mkdirSync(
          `../frontend/public/_files/forum_post${postId}/comment${commentId}`
        );
      }
      if (request.files.uploadFile.length > 1) {
        for (const file of request.files.uploadFile) {
          await pool.query(
            `INSERT INTO forum_comment_files(id, name, file, comment_id)
          VALUES(default, $1, $2, $3)`,
            [
              file.name,
              `/_files/forum_post${postId}/comment${commentId}/${file.name}`,
              postId,
            ]
          );
          fs.writeFile(
            `../frontend/public/_files/forum_post${postId}/comment${commentId}/${file.name}`,
            file.name,
            "binary",
            function (err) {
              if (err) throw err;
            }
          );
        }
      } else {
        await pool.query(
          `INSERT INTO forum_comment_files(id, name, file, comment_id)
        VALUES(default, $1, $2, $3)`,
          [
            request.files.uploadFile.name,
            `/_files/forum_post${postId}/comment${commentId}/${request.files.uploadFile.name}`,
            postId,
          ]
        );
        fs.writeFile(
          `../frontend/public/_files/forum_post${postId}/comment${commentId}/${request.files.uploadFile.name}`,
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
    response.status(400).send(e.detail);
  }
}

// Delete new comment
async function deleteComment(request, response) {
  try {
    const commentId = request.params.commentId;
    const postId = request.params.postId;
    await pool.query(`DELETE FROM comments WHERE comment_id = $1`, [commentId]);
    if (
      fs.existsSync(
        `../frontend/public/_files/forum_post${postId}/comment${commentId}`
      )
    ) {
      fs.rmdir(
        `../frontend/public/_files/forum_post${postId}/comment${commentId}`,
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
    response.status(400).send(e.detail);
  }
}

// Endorses or un-endorses forum post comment
async function putCommentEndorse(request, response) {
  try {
    const commentId = request.params.commentId;
    const isEndorsed = request.params.isEndorsed;
    await pool.query(
      `UPDATE comments SET isendorsed = $1 WHERE comment_id = $2`,
      [isEndorsed, commentId]
    );

    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e.detail);
  }
}

// Pins or unpins forum post
async function putPostPin(request, response) {
  try {
    const postId = request.params.postId;
    const isPinned = request.params.isPinned;

    await pool.query(
      `UPDATE forum_posts SET ispinned = $1 WHERE post_id = $2`,
      [isPinned, postId]
    );

    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Gets all tags (topic group or ALL)
async function getAllTags(request, response) {
  try {
    let resp;

    if (request.params.topicGroup) { // If topic group specified then get tags for topic group only
      const topicGroupName = request.params.topicGroup;
      let topicGroupReq = await pool.query(`SELECT id FROM topic_group WHERE LOWER(name) LIKE LOWER($1)`, [topicGroupName]);
      if (!topicGroupReq.rows.length) throw (`Topic Group '${topicGroupName}' does not exist`);

      const topicGroupId = topicGroupReq.rows[0].id;
      const tags = await pool.query(`SELECT * FROM tags WHERE topic_group_id = $1`, [topicGroupId]);

      const reserved = await pool.query('SELECT * FROM reserved_tags')

      resp = {
        tags: tags.rows,
        reserved_tags: reserved.rows
      }
    } else { // No topic group specified (get all tags)
      resp = await pool.query(`SELECT * FROM tags`);
    }

    response.status(200).json(resp);
  } catch(e) {
    console.log(e)
    response.status(400).send(e);
  }
}

// Gets one tag
async function getTag(request, response) {
  try {
    const tagId = request.params.tagId;
    let resp = await pool.query(`SELECT * FROM tags WHERE tag_id = $1`, [
      tagId,
    ]);
    if (!resp.rows.length) throw "Tag id not found";
    response.status(200).json(resp.rows[0]);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Posts tag
async function postTag(request, response) {
  try {
    const tagName = request.body.tagName;
    const topicGroupName = request.params.topicGroup;
    
    const topicGroupReq = await pool.query(`SELECT id FROM topic_group 
    WHERE LOWER(name) LIKE LOWER($1)`, [topicGroupName]);
    if (!topicGroupReq.rows.length) throw (`Topic Group '${topicGroupName}' does not exist`);
    const topicGroupId = topicGroupReq.rows[0].id;

    let reservedTagCheck = await pool.query(`
    select exists(select * from reserved_tags where lower(name) like lower($1))`, [tagName]);

    if (reservedTagCheck.rows[0].exists) {
      response.status(400).json({ error: `Tag '${tagName}' is a reserved tag name`});
      return;
    }

    let dupTagCheck = await pool.query(`
    select exists(select * from tags where lower(name) like lower($1) AND topic_group_id = $2)`, [tagName, topicGroupId]);

    if (dupTagCheck.rows[0].exists) {
      response.status(400).json({
        error: `Tag '${tagName}' already exists for topic group '${topicGroupName}`,
      });
      return;
    }

    await pool.query(
      `INSERT INTO tags(tag_id, topic_group_id, name) VALUES(default, $1, $2)`,
      [topicGroupId, tagName]
    );
    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Update tag
async function putTag(request, response) {
  try {
    let reservedTagCheck = await pool.query(`
    select exists(select * from reserved_tags where lower(name) like lower($1))`, [request.body.tagName]);

    if (reservedTagCheck.rows[0].exists) {
      response.status(400).json({ error: `Tag '${request.body.tagName}' is a reserved tag name`});
      return;
    }

    let dupTagCheck = await pool.query(`select exists(select * from tags where lower(name) 
    like lower($1))`, [request.body.tagName]);

    if (dupTagCheck.rows[0].exists) {
      response.status(400).json({ error: `Tag '${tagName}' already exists` });
      return;
    }

    await pool.query(`UPDATE tags SET name = $1 WHERE tag_id = $2`, [
      request.body.tagName,
      request.params.tagId,
    ]);
    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Posts tag
async function deleteTag(request, response) {
  try {
    const tagId = request.params.tagId;
    await pool.query(`DELETE FROM tags WHERE tag_id = $1`, [tagId]);
    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e.detail);
  }
}

// Endorses or un-endorses forum post
async function putPostEndorse(request, response) {
  try {
    const postId = request.params.postId;
    const isEndorsed = request.params.isEndorsed;
    await pool.query(
      `UPDATE forum_posts SET isendorsed = $1 WHERE post_id = $2`,
      [isEndorsed, postId]
    );

    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e.detail);
  }
}

// Likes a forum post
async function putPostLike(request, response) {
  try {
    const postId = request.params.postId;
    const userId = request.body.userId;

    const upvotesResp = await pool.query(
      `SELECT num_of_upvotes FROM forum_posts WHERE post_id = $1`,
      [postId]
    );
    const upvotes = upvotesResp.rows[0].num_of_upvotes + 1;

    // Add user to upvotes table and update forum_posts upvotes
    await pool.query(`INSERT INTO upvotes (post_id, user_id) VALUES ($1, $2)`, [
      postId,
      userId,
    ]);
    await pool.query(
      `UPDATE forum_posts SET num_of_upvotes = $1 WHERE post_id = $2`,
      [upvotes, postId]
    );

    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e.detail);
  }
}

// Unlikes a forum post
async function putPostUnlike(request, response) {
  try {
    const postId = request.params.postId;
    const userId = request.body.userId;

    let upvotesResp = await pool.query(
      `SELECT num_of_upvotes FROM forum_posts WHERE post_id = $1`,
      [postId]
    );
    const upvotes =
      upvotesResp.rows[0].num_of_upvotes === 0
        ? upvotesResp.rows[0].num_of_upvotes
        : upvotesResp.rows[0].num_of_upvotes - 1;

    // Delete user from upvotes table and update forum_posts upvotes
    await pool.query(
      `DELETE FROM upvotes WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );
    await pool.query(
      `UPDATE forum_posts SET num_of_upvotes = $1 WHERE post_id = $2`,
      [upvotes, postId]
    );

    response.sendStatus(200);
  } catch (e) {
    response.status(400).send(e);
  }
}

module.exports = {
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
  getTag,
  deletePost,
  deleteComment,
  putCommentEndorse,
  putComment,
  deletePostReply,
  deleteTag,
  putTag
}