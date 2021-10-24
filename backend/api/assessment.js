const pool = require('../db/database');
const auth = require("./authentication");

/***************************************************************
                       Assessment Functions
***************************************************************/

// Get all quizzes for topic group
async function getAllQuizzes(request, response) {
  try {
    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    const topicGroupId = request.params.topicGroupId;
    const topicGroupReq = await pool.query(`SELECT id FROM topic_group WHERE id = $1`, [topicGroupId]);
    if (!topicGroupReq.rows.length) throw new Error (`Topic Group {${topicGroupId}} does not exist`);

    let resp = await pool.query(`
    SELECT * FROM quizzes 
    WHERE topicGroupId = $1 
    ORDER BY id`, [topicGroupId]);

    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get quiz in topic group
async function getQuizById(request, response) {
  try {
    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    const quizId = request.params.quizId;
    const topicGroupId = request.params.topicGroupId;
    const topicGroupReq = await pool.query(`SELECT id FROM topic_group WHERE id = $1`, [topicGroupId]);
    if (!topicGroupReq.rows.length) throw new Error (`Topic Group {${topicGroupId}} does not exist`);

    let resp = await pool.query(`
    SELECT * FROM quizzes 
    WHERE topicGroupId = $1 AND id = $2 
    ORDER BY id`, [topicGroupId, quizId]);

    if (!resp.rows.length) throw new Error (`Quiz {${quizId}} does not exist`);

    response.status(200).json(resp.rows[0]);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Post new assessment quiz
async function postQuiz(request, response) {
  
  try {
    /* let zId = await auth.auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */
    const topicGroupId = request.params.topicGroupId;
    const name = request.body.name;
    const openDate = request.body.openDate;
    const closeDate = request.body.closeDate;
    const timeGiven = request.body.timeGiven;
    // const numQuestions = request.body.numQuestions;

    let questionsArr = request.query.questions.split(",");

    let resp = await pool.query(
      `INSERT INTO quizzes(id, name, topicGroupId, openDate, closeDate, timeGiven, numQuestions)
      VALUES(default, $1, $2, $3, $4, $5, 0) RETURNING id`,
      [name, topicGroupId, openDate, closeDate, timeGiven]
    );

    const quizId = resp.rows[0].id;

    // Link questions to quiz
    for (const questionId of questionsArr) {
      let tmp = await pool.query(`
      INSERT INTO quiz_questions(quizId, questionId)
      VALUES($1, $2) RETURNING *`, [quizId, questionId]);
      
      if (tmp.rows.length) {
        let numQ = await pool.query(`SELECT numQuestions FROM quizzes WHERE id = $1`, [quizId]);
        const newNum = numQ.rows[0].numquestions + 1;

        await pool.query(`
        UPDATE quizzes SET numQuestions = $1 WHERE id = $2
        `[newNum, quizId]);
      }
    }

    response.status(200).json({success: true});
    
  } catch (e) {
    response.status(400).send(e);
  }
}

async function putQuestionById (request, response) {
  try {
    const questionId = request.params.questionId;
    const questionType = request.query.questionType;
    const questionText = request.body.questionText;
    const newMarks = request.body.marksAwarded;

    //Validate Token
    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    await pool.query(`
    UPDATE questions 
    SET questionText = $1, questionType = $2, marksAwarded = $3
    WHERE id = $4`
    , [questionText, questionType, newMarks, questionId])

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).send(e);
  }
}

// Change quiz details by id
async function putQuizById(request, response) {
  try {
    const quizId = request.params.quizId;
    const name = request.body.name;
    const openDate = request.body.openDate;
    const closeDate = request.body.closeDate;
    const timeGiven = request.body.timeGiven;

    const rmQuestions = request.query.unlinkQuestions.split(",");
    //Validate Token
    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    if (rmQuestions.length) {
      let numQ = await pool.query(`SELECT numQuestions FROM quizzes WHERE id = $1`, [quizId]);
      const newNum = numQ.rows[0].numquestions - rmQuestions.length;
      await pool.query(
        `UPDATE quizzes 
        SET numQuestions = $1
        WHERE id = $2`,
        [newNum, quizId]
      );
    }

    await pool.query(
      `UPDATE quizzes 
      SET name = $1, openDate = $2, closeDate = $3, timeGiven = $4
      WHERE id = $5`,
      [name, openDate, closeDate, timeGiven, quizId]
    );

    if (rmQuestions.length) {
      for (const questionId of rmQuestions) {
        await pool.query(`DELETE FROM quiz_questions
        WHERE quizId = $1 AND questionId = $2`, [quizId, questionId]);
      }
    }

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).send(e);
  }
}

// Delete quiz by id
async function deleteQuizById(request, response) {
  try {
    const quizId = request.params.quizId;

    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    await pool.query(`DELETE FROM quizzes WHERE id = $1`, [quizId]);

    response.status(200).json({success: true})
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get questions from question bank
async function getQuestionBankQuestions(request, response) {
  try {
    // const questionBankId = request.params.questionBankId;

    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    let resp = await pool.query(
    `SELECT * FROM questions 
    ORDER BY id`);

    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get questions from question bank
async function getFilterQuestions(request, response) {
  try {
    const topicId = request.params.filterTopic;

    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    let resp = await pool.query(
    `SELECT * FROM questions WHERE topicId = $1
    ORDER BY id`, [topicId]);

    if (resp.rows.length == 0) throw ({success: false, detail: "No results found"});

    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).json(e);
  }
}

// Get questions from start point and limited by value
async function getLimitedQuestions(request, response) {
  try {
    const startId = request.params.questionStartId;
    const limit = request.params.limit;

    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    let resp = await pool.query(`
    SELECT * FROM questions 
    WHERE id >= $1 
    ORDER BY id 
    LIMIT $2`, [startId, limit]);

    response.status(200).json(resp.rows);
  } catch(e) {
    response.status(200).send(e);
  }
}

// Get questions from start point and limited by value
async function getLimitSortQuestions(request, response) {
  try {
    const startId = request.params.questionStartId;
    const limit = request.params.limit;
    const sortTerm = request.params.sortTerm;

    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    let resp;

    // Sorting by question types (mc, sa, cb)
    if (sortTerm.length == 2) {
      resp = await pool.query(`
      SELECT * FROM questions 
      WHERE id >= $1 AND questionType::text LIKE LOWER($2)
      ORDER BY id 
      LIMIT $3`, [startId, sortTerm, limit]);
    } else { // else sorted by topic name
      let tmp = await pool.query(`
      SELECT id FROM topics
      WHERE LOWER(name) LIKE LOWER($1)`, [sortTerm]);

      const topicId = tmp.rows[0].id;

      resp = await pool.query(`
      SELECT * FROM questions 
      WHERE id >= $1 AND topicId = $2
      ORDER BY id 
      LIMIT $3`, [startId, topicId, limit]);
    }

    response.status(200).json(resp.rows)
  } catch(e) {
    response.status(200).send(e);
  }
}

// Get specific question from question bank
async function getQuestionFromQuestionBank(request, response) {
  try {
    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    const questionId = request.params.questionId;
    let resp = await pool.query(`SELECT * FROM questions WHERE id = $1`, [questionId]);

    if (resp.rows.length == 0) throw ({success: false, detail: "No results found"})

    response.status(200).json(resp.rows[0]);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Delete question from question bank
async function deleteQuestionBankQuestion(request, response) {
  try {
    const questionId = request.params.questionId;

    //Validate Token
    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    await pool.query(`DELETE FROM questions WHERE id = $1`, [questionId]);

    response.status(200).json({success: true})
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get list of student answers by student id
async function getStudentAttempts(request, response) {
  try {
    //Validate Token
    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    const quizId = request.params.quizId;

    let resp = await pool.query(
      `SELECT * fROM student_attempts WHERE quizId = $1`,
      [quizId]
    );

    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get student answer from quiz by id and zid
async function getStudentAttemptById(request, response) {
  try {
    //Validate Token
    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    const quizId = request.params.quizId;
    const studentId = request.params.studentId;

    let resp = await pool.query(
      `SELECT * fROM student_attempts 
      WHERE quizId = $1 AND studentId = $2`, [quizId, studentId]);

    response.status(200).json(resp.rows);
  } catch (e) {
    response.status(400).send(e);
  }
}

// Delete student attempt
async function deleteStudentAttemptByid(request, response) {
  try {
    //Validate Token
    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    const quizId = request.params.quizId;
    const studentId = request.params.studentId;

    await pool.query(`DELETE FROM student_attempts 
    WHERE quizId = $1 AND studentId = $2`
    , [quizId, studentId])

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).send(e);
  }
}

// Post student attempt 
async function postStudentAttempt(request, response) {
  try {
    const studentId = request.params.studentId;
    const quizId = request.params.quizId;
    const startTime = request.body.startTime;

    let answerArr;

    if (request.query.answers) {
      answerArr = request.query.answers.split(",");
    }

    let resp = await pool.query(`INSERT INTO student_attempts(id, quizId, studentId, startTime, endTime)
    VALUES(default, $1, $2, $3, current_timestamp) RETURNING id`, [quizId, studentId, startTime]);

    const attemptId = resp.rows[0].id;

    if (answerArr && answerArr.length) {
      for (const answerId of answerArr) {
        await pool.query(`INSERT INTO attempt_answers(attemptId, answerId) 
        VALUES($1, $2)`, [attemptId, answerId]);
      }
    }

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).send(e);
  }
}

// Posts student answer
async function postStudentAnswer(request, response) {
  try {
    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */

    const studentId = request.params.studentId;
    const quizId = request.params.quizId;
    const questionId = request.params.questionId;
    const answer = request.body.answer;

    await pool.query(
      `INSERT INTO student_answers(id, quizId, studentId, questionId, answer)
      VALUES(default, $1, $2, $3, $4)`,
      [quizId, studentId, questionId, answer]
    );

    response.status(200).json({success: true});
  } catch (e) {
    response.status(400).send(e);
  }
}

// Get list of student answers by student id
async function putStudentAnswer(request, response) {
  
  try {
    /* let zId = await auth.getZIdFromAuthorization(request.header("Authorization"));
    if (zId == null) {
      response.status(403).send({ error: "Invalid Token" });
      throw "Invalid Token";
    } */
    const studentId = request.params.studentId;
    const quizId = request.params.quizId;
    const questionId = request.params.questionId;
    const answer = request.body.answer;

    await pool.query(
      `UPDATE student_answers
      SET answer = $1    
      WHERE studentId = $2 AND quizid = $3 AND questionId = $4`,
      [answer, studentId, quizId, questionId]
    );

    response.status(200).json({success: true});
    
  } catch (e) {
    response.status(400).send(e);
  }
}

module.exports = {
  getQuizById,
  getAllQuizzes,
  postQuiz,
  putQuizById,
  deleteQuizById,
  putQuestionById,
  getQuestionBankQuestions,
  getLimitedQuestions,
  getQuestionFromQuestionBank,
  deleteQuestionBankQuestion,
  getFilterQuestions,
  getLimitSortQuestions,
  getStudentAttempts,
  getStudentAttemptById,
  deleteStudentAttemptByid,
  postStudentAnswer,
  putStudentAnswer,
  postStudentAttempt
};