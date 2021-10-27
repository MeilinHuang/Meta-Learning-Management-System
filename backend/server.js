const express = require("express");
var cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(fileUpload());
app.use("/static", express.static("public"));
app.use("/_files", express.static("public/_files"));

/***************************************************************
                       Open API / Swagger
***************************************************************/

const swaggerUi = require("swagger-ui-express");
const openApiDocument = require("./docs/openApi");

// Redirect to swagger
app.get("/", (req, res) => res.redirect("/docs"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

/***************************************************************
                       API Routes
***************************************************************/

const database = require("./service.js");
const lectureTutorial = require("./api/lecturesTutorials");
const users = require("./api/user");
const topics = require("./api/topics");
const forums = require("./api/forums");

/***************************************************************
                       Auth Functions
***************************************************************/

app.post("/auth/login", async (request, response) => {
  console.log("POST /auth/login");
  await database.login(request, response);
});

app.post("/auth/register", async (request, response) => {
  console.log("POST /auth/register");
  await database.register(request, response);
});

/***************************************************************
                       User Functions
***************************************************************/

app.get("/user/:userId", async (request, response) => {
  console.log(`GET /user/${request.params.userId}`);
  await users.getUser(request, response);
});

app.delete("/user/:userId", async (request, response) => {
  console.log(`DELETE /user/${request.params.userId}`);
  await users.deleteUser(request, response);
});

app.put("/user/:userId", async (request, response) => {
  console.log(`PUT /user/${request.params.userId}`);
  await users.putAccessedTopic(request, response);
});

app.post("/user/:userId/:topicGroupId", async (request, response) => {
  console.log(
    `POST /user/${request.params.userId}/${request.params.topicGroupId}`
  );
  await users.postAdmin(request, response);
});

app.delete("/user/:userId/:topicGroupId", async (request, response) => {
  console.log(
    `DELETE /user/${request.params.userId}/${request.params.topicGroupId}`
  );
  await users.deleteAdmin(request, response);
});

app.put("/user/:userId/progress", async (request, response) => {
  console.log(`PUT /user/${request.params.userId}/progress`);
  await users.putUserProgress(request, response);
});

app.get("/user/:userId/calendar", async (request, response) => {
  console.log(`GET /user/${request.params.userId}/calendar`);
  await users.getUserCalendar(request, response);
});

app.get("/user/calendar/:calendarId", async (request, response) => {
  console.log(`GET /user/calendar/${request.params.calendarId}`);
  await users.getCalendarById(request, response);
});

app.delete("/user/calendar/:calendarId", async (request, response) => {
  console.log(`DELETE /user/calendar/${request.params.calendarId}`);
  await users.deleteCalendarById(request, response);
});

app.put("/user/:userId/calendar", async (request, response) => {
  console.log(`POST /user/${request.params.userId}/calendar`);
  await users.postCalendar(request, response);
});

app.put("/user/calendar/:calendarId", async (request, response) => {
  console.log(`PUT /user/calendar/${request.params.calendarId}`);
  await users.putCalendarById(request, response);
});

app.get("/user/:userId/progress/:topicId", async (request, response) => {
  console.log(
    `GET /user/${request.params.userId}/progress/${request.params.topicId}`
  );
  await users.getUserContentProgress(request, response);
});

app.put("/user/:userId/progress/:topicId", async (request, response) => {
  console.log(
    `PUT /user/${request.params.userId}/progress/${request.params.topicId}`
  );
  await users.putUserContentProgress(request, response);
});

/***************************************************************
                       Topic Group Functions
***************************************************************/

app.get("/topicGroup", async (request, response) => {
  console.log(`GET /topicGroup`);
  await database.getAllTopicGroups(request, response);
});


app.get("/topicGroup/all", async (request, response) => {
  await database.getAllTopics(request, response);
});

app.get("/topicGroup/:topicGroupName", async (request, response) => {
  console.log(`GET /topicGroup/${request.params.topicGroupName}`);
  await database.getTopicGroup(request, response);
});

app.put("/topicGroup/:topicGroupName/searchable/:searchable", async (request, response) => {
  console.log(`PUT /topicGroup/${request.params.topicGroupName}/searchable/${request.params.searchable}`);
  await database.setSearchable(request, response);
});


app.get("/topicGroup/:topicGroupName/topic", async (request, response) => {
  console.log(`GET /topicGroup/${request.params.topicGroupName}/topic`);
  await database.getTopics(request, response);
});

app.get(
  "/topicGroup/:topicGroupName/topic/:topicName/topic",
  async (request, response) => {
    console.log(
      `GET /topicGroup/${request.params.topicGroupName}/topic/${request.params.topicName}/topic`
    );
    await database.getTopicFile(request, response);
  }
);

app.get(
  "/topicGroup/:topicGroupName/topic/:topicName/prerequisite",
  async (request, response) => {
    console.log(
      `GET /topicGroup/${request.params.topicGroupName}/topic/${request.params.topicName}/prerequisite`
    );
    await database.getTopicPreReqs(request, response);
  }
);

// Modify to include topicGroupName and topicName for filtering correctness
app.post(
  "/topicGroup/:topicGroupName/topic/:topicName/prerequisite",
  async (request, response) => {
    console.log(
      `POST /topicGroup/${request.params.topicGroupName}/topic/${request.params.topicName}/prerequisite`
    );
    await database.postPreReq(request.body, response);
  }
);

// Modify to include topicGroupName and topicName for filtering correctness
app.delete(
  "/topicGroup/:topicGroupName/topic/:topicName/prerequisite",
  async (request, response) => {
    console.log(
      `DELETE /topicGroup/${request.params.topicGroupName}/topic/${request.params.topicName}/prerequisite`
    );
    await database.deletePreReq(request.body, response);
  }
);

// Tags for topic group
app.post(
  "/topicGroup/:topicGroupName/topic/:topicName/tag",
  async (request, response) => {
    console.log(
      `POST /topicGroup/${request.params.topicGroupName}/topic/${request.params.topicName}/tag`
    );
    await database.putTopicTag(request, response);
  }
);

app.delete(
  "/topicGroup/:topicGroupName/topic/:topicName/tag",
  async (request, response) => {
    console.log(
      `POST /topicGroup/${request.params.topicGroupName}/topic/${request.params.topicName}/tag`
    );
    await database.deleteTopicTag(request, response);
  }
);

app.post("/topicGroup/:topicGroupName", async (request, response) => {
  console.log(`POST /topicGroup/${request.params.topicGroupName}`);
  await database.postTopicGroup(request, response);
});

app.put("/topicGroup/:topicGroupName", async (request, response) => {
  console.log(`PUT /topicGroup/${request.params.topicGroupName}`);
  await database.putTopicGroup(request, response);
});

app.delete("/topicGroup/:topicGroupName", async (request, response) => {
  console.log(`DELETE /topicGroup/${request.params.topicGroupName}`);
  await database.deleteTopicGroup(request, response);
});

app.post(
  "/topicGroup/:topicGroupName/topic/:topicName",
  async (request, response) => {
    console.log(
      `POST /topicGroup/${request.params.topicGroupName}/topic/${request.params.topicName}`
    );
    await database.postTopic(request, response);
  }
);

app.put(
  "/topicGroup/:topicGroupName/topic/:topicName",
  async (request, response) => {
    console.log(
      `PUT /topicGroup/${request.params.topicGroupName}/topic/${request.params.topicName}`
    );
    await database.putTopic(request, response);
  }
);

app.delete(
  "/topicGroup/:topicGroupName/topic/:topicName",
  async (request, response) => {
    console.log(
      `DELETE /topicGroup/${request.params.topicGroupName}/topic/${request.params.topicName}`
    );
    await database.deleteTopic(request, response);
  }
);

app.get("/topic/:fileId", async (request, response) => {
  await topics.getTopicFileById(request, response);
});

app.put("/topic/:fileId", async (request, response) => {
  await topics.putTopicFileDueDate(request, response);
});

/***************************************************************
                    Enrollment Functions
***************************************************************/

app.post("/enroll/code/:topicGroupName", async (request, response) => {
  console.log(`POST /enroll/code/${request.params.topicGroupName}`);
  await database.generateCode(request, response);
});

// app.put("/enroll/code/:inviteCode");

// Gets all codes for a topic group
app.get("/enroll/codes/:topicGroupName", async (request, response) => {
  console.log(`GET /enroll/codes/${request.params.topicGroupName}`);
  await database.getCourseCodes(request, response);
});

// Gets a specific code
app.get("/enroll/code/:inviteCode", async (request, response) => {
  console.log(`GET /enroll/code/${request.params.inviteCode}`);
  await database.getCourseCode(request, response);
});
// Gets a specific code
app.delete("/enroll/code/:inviteCode", async (request, response) => {
  console.log(`DELETE /enroll/code/${request.params.inviteCode}`);
  await database.deleteCourseCode(request, response);
});

app.get("/enrollments/:topicGroupName", async (request, response) => {
  console.log(`GET /enrollments/${request.params.topicGroupName}`);
  await database.getEnrollments(request, response);
});

app.put("/enroll/:topicGroupName/:zId", async (request, response) => {
  console.log(`PUT /enroll/${request.params.topicGroupName}/${request.params.zId}`);
  await database.enrollUser(request, response);
});

app.put("/unenroll/:topicGroupName/:userId", async (request, response) => {
  console.log(`PUT /unenroll/${request.params.topicGroupName}/${request.params.userId}`);
  await database.unenrollUser(request, response);
});

/***************************************************************
                       Forum Functions
***************************************************************/

app.get("/:topicGroup/forum", async (request, response) => {
  console.log(`GET /${request.params.topicGroup}/forum`);
  await forums.getAllForumPosts(request, response);
});

app.get("/:topicGroup/forum/pinned", async (request, response) => {
  console.log(`GET /${request.params.topicGroup}/forum/pinned`);
  await forums.getAllPinnedPosts(request, response);
});

app.get(
  "/:topicGroup/forum/search/:forumSearchTerm",
  async (request, response) => {
    console.log(
      `GET /${request.params.topicGroup}/forum/search/${request.params.forumSearchTerm}`
    );
    await forums.getSearchPosts(request, response);
  }
);

app.get("/:topicGroup/forum/filter", async (request, response) => {
  console.log(
    `GET /${request.params.topicGroup}/forum/${request.query.forumFilterTerms}`
  );
  await forums.getFilterPosts(request, response);
});

app.post("/:topicGroup/forum/post", async (request, response) => {
  console.log(`POST /${request.params.topicGroup}/forum/post`);
  await forums.postForum(request, response);
});

app.get("/:topicGroup/forum/post/:postId", async (request, response) => {
  console.log(
    `GET /${request.params.topicGroup}/forum/post/${request.params.postId}`
  );
  await forums.getPostById(request, response);
});

app.put("/:topicGroup/forum/post/:postId", async (request, response) => {
  console.log(
    `PUT /${request.params.topicGroup}/forum/post/${request.params.postId}`
  );
  await forums.putPost(request, response);
});

app.delete("/:topicGroup/forum/post/:postId", async (request, response) => {
  console.log(
    `DELETE /${request.params.topicGroup}/forum/post/${request.params.postId}`
  );
  await forums.deletePost(request, response);
});

app.put(
  "/:topicGroup/forum/post/:postId/reply/:replyId",
  async (request, response) => {
    console.log(
      `PUT /${request.params.topicGroup}/forum/post/${request.params.postId}/reply/${request.params.replyId}`
    );
    await forums.putPostReply(request, response);
  }
);

app.post("/:topicGroup/forum/post/:postId/reply", async (request, response) => {
  console.log(
    `POST /${request.params.topicGroup}/forum/post/${request.params.postId}/reply`
  );
  await forums.postReply(request, response);
});

app.delete(
  "/:topicGroup/forum/post/:postId/reply/:replyId",
  async (request, response) => {
    console.log(
      `DELETE /${request.params.topicGroup}/forum/post/${request.params.postId}/reply/${request.params.replyId}`
    );
    await forums.deletePostReply(request, response);
  }
);

app.post(
  "/:topicGroup/forum/post/:postId/comment",
  async (request, response) => {
    console.log(
      `POST /${request.params.topicGroup}/forum/post/${request.params.postId}/comment`
    );
    await forums.postComment(request, response);
  }
);

app.put(
  "/:topicGroup/forum/post/:postId/comment/:commentId",
  async (request, response) => {
    console.log(
      `PUT /${request.params.topicGroup}/forum/post/${request.params.postId}/comment/${request.params.commentId}`
    );
    await forums.putComment(request, response);
  }
);

app.delete(
  "/:topicGroup/forum/post/:postId/comment/:commentId",
  async (request, response) => {
    console.log(
      `DELETE /${request.params.topicGroup}/forum/post/${request.params.postId}/comment/${request.params.commentId}`
    );
    await forums.deleteComment(request, response);
  }
);

app.put(
  "/:topicGroup/forum/post/:postId/comment/:commentId/endorse/:isEndorsed",
  async (request, response) => {
    console.log(
      `PUT /${request.params.topicGroup}/forum/post/${request.params.postId}/comment/${request.params.commentId}/endorse/${request.params.isEndorsed}`
    );
    await forums.putCommentEndorse(request, response);
  }
);

app.put(
  "/:topicGroup/forum/post/pin/:postId/:isPinned",
  async (request, response) => {
    console.log(
      `PUT /${request.params.topicGroup}/forum/post/pin/${request.params.postId}/${request.params.isPinned}`
    );
    await forums.putPostPin(request, response);
  }
);

app.get("/:topicGroup/forum/tags/:tagId", async (request, response) => {
  console.log(
    `GET /${request.params.topicGroup}/forum/tags/${request.params.tagId}`
  );
  await forums.getTag(request, response);
});

app.put("/:topicGroup/forum/tags/:tagId", async (request, response) => {
  console.log(
    `PUT /${request.params.topicGroup}/forum/tags/${request.params.tagId}`
  );
  await forums.putTag(request, response);
});

app.put("/:topicGroup/forum/tags", async (request, response) => {
  console.log(`PUT /${request.params.topicGroup}/forum/tags`);
  await forums.getAllTags(request, response);
});

app.post("/:topicGroup/forum/tags", async (request, response) => {
  console.log(`POST /${request.params.topicGroup}/forum/tags`);
  await forums.postTag(request, response);
});

app.delete("/:topicGroup/forum/tags/:tagId", async (request, response) => {
  console.log(
    `DELETE /${request.params.topicGroup}/forum/tags/${request.params.tagId}`
  );
  await forums.deleteTag(request, response);
});

app.put(
  "/:topicGroup/forum/post/endorse/:postId/:isEndorsed",
  async (request, response) => {
    console.log(
      `PUT /${request.params.topicGroup}/forum/post/endorse/${request.params.postId}/${request.params.isEndorsed}`
    );
    await forums.putPostEndorse(request, response);
  }
);

app.put("/:topicGroup/forum/post/like/:postId", async (request, response) => {
  console.log(
    `PUT /${request.params.topicGroup}/forum/post/like/${request.params.postId}`
  );
  await forums.putPostLike(request, response);
});

app.get("/:topicGroup/forum/post/like/:postId", async (request, response) => {
  console.log(
    `GET /${request.params.topicGroup}/forum/post/like/${request.params.postId}`
  );
  await forums.getPostLikes(request, response);
});

app.put("/:topicGroup/forum/post/unlike/:postId", async (request, response) => {
  console.log(
    `PUT /${request.params.topicGroup}/forum/post/unlike/${request.params.postId}`
  );
  await forums.putPostUnlike(request, response);
});

/***************************************************************
                       Course Pages Functions
***************************************************************/

app.get("/:topicGroup/announcement", async (request, response) => {
  console.log(`GET /${request.params.topicGroup}/announcement`);
  await database.getAnnouncements(request, response);
});

app.post("/:topicGroup/announcement/new", async (request, response) => {
  console.log(`POST /${request.params.topicGroup}/announcement/new`);
  await database.postAnnouncement(request, response);
});

app.get(
  "/:topicGroup/announcement/:announcementId",
  async (request, response) => {
    console.log(
      `GET /${request.params.topicGroup}/announcement/${request.params.announcementId}`
    );
    await database.getAnnouncementById(request, response);
  }
);

app.put(
  "/:topicGroup/announcement/:announcementId",
  async (request, response) => {
    console.log(
      `PUT /${request.params.topicGroup}/announcement/${request.params.announcementId}`
    );
    await database.putAnnouncement(request, response);
  }
);

app.delete(
  "/:topicGroup/announcement/:announcementId",
  async (request, response) => {
    console.log(
      `DELETE /${request.params.topicGroup}/announcement/${request.params.announcementId}`
    );
    await database.deleteAnnouncement(request, response);
  }
);

app.post(
  "/:topicGroup/announcement/:announcementId/comment",
  async (request, response) => {
    console.log(
      `POST /${request.params.topicGroup}/announcement/${request.params.announcementId}/comment`
    );
    await database.postAnnouncementComment(request, response);
  }
);

app.put(
  "/:topicGroup/announcement/:announcementId/comment/:commentId",
  async (request, response) => {
    console.log(
      `PUT /${request.params.topicGroup}/announcement/${request.params.announcementId}/comment/${request.params.commentId}`
    );
    await database.putAnnouncementComment(request, response);
  }
);

app.delete(
  "/:topicGroup/announcement/:announcementId/comment/:commentId",
  async (request, response) => {
    console.log(
      `DELETE /${request.params.topicGroup}/announcement/${request.params.announcementId}/comment/${request.params.commentId}`
    );
    await database.deleteAnnouncementComment(request, response);
  }
);

app.get(
  "/:topicGroup/announcement/search/:announcementSearchTerm",
  async (request, response) => {
    console.log(
      `GET /${request.params.topicGroup}/announcement/search/${request.params.announcementSearchTerm}/`
    );
    await database.getSearchAnnouncements(request, response);
  }
);

/***************************************************************
                       Gamification Functions
***************************************************************/

app.get("/questions", async (request, response) => {
  console.log(`GET /questions`);
  await database.getQuestions(request, response);
});

app.post("/questions/new", async (request, response) => {
  console.log(`POST /questions/new`);
  await database.postQuestion(request, response);
});

app.get("/questions/:questionId", async (request, response) => {
  console.log(`GET /questions/${request.params.questionId}`);
  await database.getLevelFromQuestion(request, response);
});

app.put("/questions/:questionId", async (request, response) => {
  console.log(`PUT /questions/${request.params.questionId}`);
  await database.putQuestion(request, response);
});

app.delete("/questions/:questionId", async (request, response) => {
  console.log(`DELETE /questions/${request.params.questionId}`);
  await database.deleteQuestion(request, response);
});

app.get("/levels", async (request, response) => {
  console.log(`GET /levels`);
  await database.getAllLevels(request, response);
});

app.get("/levels/:levelId", async (request, response) => {
  console.log(`GET /levels/${request.params.levelId}`);
  await database.getLevelById(request, response);
});

app.put("/levels/:levelId", async (request, response) => {
  console.log(`PUT /levels/${request.params.levelId}`);
  await database.putLevel(request, response);
});

app.delete("/levels/:levelId", async (request, response) => {
  console.log(`DELETE /levels/${request.params.levelId}`);
  await database.deleteLevel(request, response);
});

app.post("/levels/new", async (request, response) => {
  console.log(`POST /levels/new`);
  await database.postLevel(request, response);
});

app.get("/:level/questions", async (request, response) => {
  console.log(`GET /${request.params.levelId}/questions`);
  await database.getLevelQuestions(request, response);
});

// Delete entire level or just remove level from topic group??
app.delete("/:topicGroup/remove-level/:level", async (request, response) => {
  console.log(
    `DELETE /${request.params.topicGroup}/remove-level/${request.params.level}`
  );
  await database.removeTGLevel(request, response);
});

app.post("/topicGroup/:topicGroupId/newLevel", async (request, response) => {
  console.log(`POST /topicGroup/${request.params.topicGroup}/newLevel`);
  await database.postTGLevel(request, response);
});

app.get("/topicGroup/:topicGroupId/levels", async (request, response) => {
  console.log(`POST /topicGroup/${request.params.topicGroup}/levels`);
  await database.getTGLevels(request, response);
});

/***************************************************************
                       Assessment Functions
***************************************************************/

app.post("/quiz", async (request, response) => {
  console.log(`POST /quiz`);
  await database.postQuiz(request, response);
});

/* app.post('/quiz_question', async(request, response) => {
  await database.postQuizQuestion(request, response);
}) */

app.get("/quiz/:quizId", async (request, response) => {
  console.log(`GET /quiz/${request.params.quizId}`);
  await database.getQuizQuestions(request, response);
});

app.put("/quiz/:quizId", async (request, response) => {
  console.log(`PUT /quiz/${request.params.quizId}`);
  await database.putQuizById(request, response);
});

app.delete("/quiz/:quizId", async (request, response) => {
  console.log(`DELETE /quiz/${request.params.quizId}`);
  await database.deleteQuizById(request, response);
});

app.get("/quiz/:quizId/question/:questionId", async (request, response) => {
  console.log(
    `GET /quiz/${request.params.quizId}/question/${request.params.questionId}`
  );
  await database.getQuestionFromQuiz(request, response);
});

app.put("/quiz/:quizId/question/:questionId", async (request, response) => {
  console.log(
    `PUT /quiz/${request.params.quizId}/question/${request.params.questionId}`
  );
  await database.putQuestionFromQuiz(request, response);
});

app.get("/questionBank/:questionBankId", async (request, response) => {
  console.log(`GET /questionBank/${request.params.questionBankId}`);
  await database.getQuestionBankQuestions(request, response);
});

app.put("/questionBank/:questionBankId", async (request, response) => {
  console.log(`PUT /questionBank/${request.params.questionBankId}`);
  await database.putQuestionBank(request, response);
});

app.delete("/questionBank/:questionBankId", async (request, response) => {
  console.log(`DELETE /questionBank/${request.params.questionBankId}`);
  await database.deleteQuestionBank(request, response);
});

app.get("/questionBank", async (request, response) => {
  console.log(`GET /questionBank`);
  await database.getAllQuestionBankQuestions(request, response);
});

app.get("/questionBank/question/:questionId", async (request, response) => {
  console.log(`GET /questionBank/question/${request.params.questionId}`);
  await database.getQuestionFromQuestionBank(request, response);
});

app.post("/poll", async (request, response) => {
  console.log(`POST /poll`);
  await database.postPoll(request, response);
});

app.get("/poll/:pollId", async (request, response) => {
  console.log(`GET /poll/${request.params.pollId}`);
  await database.getPoll(request, response);
});

app.put("/poll/:pollId", async (request, response) => {
  console.log(`PUT /poll/${request.params.pollId}`);
  await database.putPoll(request, response);
});

app.delete("/poll/:pollId", async (request, response) => {
  console.log(`DELETE /poll/${request.params.pollId}`);
  await database.deletePoll(request, response);
});

app.get(
  "/quiz/studentAnswers/student/:studentId",
  async (request, response) => {
    console.log(`GET /quiz/studentAnswers/student/${request.params.studentId}`);
    await database.getStudentAnswer(request, response);
  }
);

app.post("/student_answer", async (request, response) => {
  console.log(`POST /student_answer`);
  await database.postStudentAnswer(request, response);
});

app.post("/quiz_question_answer", async (request, response) => {
  console.log(`POST /quiz_question_answer`);
  await database.postQuestionAnswer(request, response);
});

app.post(
  "/questionBank/:questionBankId/question",
  async (request, response) => {
    console.log(`POST /questionBank/${request.params.questionBankId}/question`);
    await database.postQuizQuestion(request, response);
  }
);

app.delete(
  "/questionBank/:questionBankId/question/:questionId",
  async (request, response) => {
    console.log(
      `DELETE /questionBank/${request.params.questionBankId}/question/${request.params.questionId}`
    );
    await database.deleteQuestionBankQuestion(request, response);
  }
);

app.delete("/question/:questionId/delete", async (request, response) => {
  console.log(`DELETE /question/${request.params.questionId}/delete`);
  await database.deleteAssessmentQuestion(request, response);
});

app.put(
  "/quiz/:quizId/question/:questionId/answer/:quizQuestionAnswerId",
  async (request, response) => {
    console.log(
      `PUT /quiz/${request.params.quizId}/question/${request.params.questionId}/answer/${request.params.quizQuestionAnswerId}`
    );
    await database.putQuestionAnswer(request, response);
  }
);

app.get(
  "/quiz/results/question/:questionId/answerCount",
  async (request, response) => {
    console.log(
      `GET /quiz/results/question/${request.params.questionId}/answerCount`
    );
    await database.getStudentAnswerCount(request, response);
  }
);

/***************************************************************
                       Lecture and Tutorial Functions
***************************************************************/

app.post("/file/:targetId", async (request, response) => {
  console.log(`POST /file/${request.params.targetId}`);
  await lectureTutorial.postLectureTutorialFile(request, response);
});

app.delete("/file/:targetId", async (request, response) => {
  console.log(`DELETE /file/${request.params.targetId}`);
  await lectureTutorial.deleteLectureTutorialFile(request, response);
});

app.get("/:topicGroupName", async (request, response) => {
  console.log(`GET ${request.params.topicGroupName}`);
  await lectureTutorial.getWeeks(request, response);
});

app.get("/:topicGroupName/lectures", async (request, response) => {
  console.log(`GET ${request.params.topicGroupName}/lectures`);
  await lectureTutorial.getAllLectures(request, response);
});

app.get("/:topicGroupName/lecture/:lectureId", async (request, response) => {
  console.log(
    `GET ${request.params.topicGroupName}/lectures/${request.params.lectureId}`
  );
  await lectureTutorial.getLectureById(request, response);
});

app.put("/:topicGroupName/lecture/:lectureId", async (request, response) => {
  console.log(
    `PUT ${request.params.topicGroupName}/lectures/${request.params.lectureId}`
  );
  await lectureTutorial.putLecture(request, response);
});

app.delete("/:topicGroupName/lecture/:lectureId", async (request, response) => {
  console.log(
    `DELETE ${request.params.topicGroupName}/lectures/${request.params.lectureId}`
  );
  await lectureTutorial.deleteLecture(request, response);
});

app.post("/:topicGroupName/lecture", async (request, response) => {
  console.log(`POST ${request.params.topicGroupName}/lecture`);
  await lectureTutorial.postLecture(request, response);
});

app.get("/:topicGroupName/tutorials", async (request, response) => {
  console.log(`GET ${request.params.topicGroupName}/tutorials`);
  await lectureTutorial.getAllTutorials(request, response);
});

app.get("/:topicGroupName/tutorial/:tutorialId", async (request, response) => {
  console.log(
    `GET ${request.params.topicGroupName}/tutorial/${request.params.tutorialId}`
  );
  await lectureTutorial.getTutorialById(request, response);
});

app.put("/:topicGroupName/tutorial/:tutorialId", async (request, response) => {
  console.log(
    `PUT ${request.params.topicGroupName}/tutorial/${request.params.tutorialId}`
  );
  await lectureTutorial.putTutorial(request, response);
});

app.delete(
  "/:topicGroupName/tutorial/:tutorialId",
  async (request, response) => {
    console.log(
      `DELETE ${request.params.topicGroupName}/tutorial/${request.params.tutorialId}`
    );
    await lectureTutorial.deleteTutorial(request, response);
  }
);

app.post("/:topicGroupName/tutorial", async (request, response) => {
  console.log(`POST ${request.params.topicGroupName}/tutorial`);
  await lectureTutorial.postTutorial(request, response);
});

app.get("/:topicGroupName/lectures/search/", async (request, response) => {
  console.log(`GET /${request.params.topicGroup}/lectures/search/${request.params.searchTerm}`);
  await lectureTutorial.getSearchFile(request, response);
})

app.get("/:topicGroupName/tutorials/search/", async (request, response) => {
  console.log(`GET /${request.params.topicGroup}/tutorials/search/${request.params.searchTerm}`);
  await lectureTutorial.getSearchFile(request, response);
})

app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000/\n");
});
