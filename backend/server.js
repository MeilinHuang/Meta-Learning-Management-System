const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");

app.use(express.json({ limit: "50mb" }));
app.use(fileUpload());
app.use("/static", express.static("public"));
app.use("/_files", express.static("public/_files"));

const cors = require("cors");
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

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
const assessment = require("./api/assessment")
const auth = require("./api/authentication")

/***************************************************************
                       Auth Functions
***************************************************************/

app.post("/auth/login", async (request, response) => {
  console.log("POST /auth/login");
  await auth.login(request, response);
});

app.post("/auth/register", async (request, response) => {
  console.log("POST /auth/register");
  await auth.register(request, response);
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

app.post("/user/:userId/:topicGroupId/admin", async (request, response) => {
  console.log(
    `POST /user/${request.params.userId}/${request.params.topicGroupId}/admin`
  );
  await users.postAdmin(request, response);
});

app.delete("/user/:userId/:topicGroupId/admin", async (request, response) => {
  console.log(
    `DELETE /user/${request.params.userId}/${request.params.topicGroupId}/admin`
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

app.post("/user/:userId/calendar", async (request, response) => {
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
                       Assessment Functions
***************************************************************/

app.get("/topicGroup/:topicGroupId/quizzes", async (request, response) => {
  console.log(`GET /topicGroup/${request.params.topicGroupId}/quizzes`);
  await assessment.getAllQuizzes(request, response);
});

app.get("/topicGroup/:topicGroupId/quizzes/:quizId", async (request, response) => {
  console.log(`GET /topicGroup/${request.params.topicGroupId}/quizzes/${request.params.quizId}`);
  await assessment.getQuizById(request, response);
});

app.post("/topicGroup/:topicGroupId/quizzes", async (request, response) => {
  console.log(`POST /topicGroup/${request.params.topicGroupId}/quizzes`);
  await assessment.postQuiz(request, response);
});

app.put("/topicGroup/:topicGroupId/quizzes/:quizId", async (request, response) => {
  console.log(`PUT /topicGroup/${request.params.topicGroupId}/quizzes/${request.params.quizId}`);
  await assessment.putQuizById(request, response);
});

app.delete("/topicGroup/:topicGroupId/quizzes/:quizId", async (request, response) => {
  console.log(`DELETE /topicGroup/${request.params.topicGroupId}/quizzes/${request.params.quizId}`);
  await assessment.deleteQuizById(request, response);
});

app.put("/topicGroup/:topicGroupId/quizzes/:quizId/questions/:questionId", async (request, response) => {
  console.log(`PUT /topicGroup/${request.params.topicGroupId}/quizzes/${request.params.quizId}/questions/${request.params.questionId}`);
  await assessment.putQuestionById(request, response);
});

app.get("/questionBank/questions", async (request, response) => {
  console.log(`GET /questionBank/questions`);
  await assessment.getQuestionBankQuestions(request, response);
});

app.get("/questionBank/questions/:questionId", async (request, response) => {
  console.log(`GET /questionBank/questions/${request.params.questionId}`);
  await assessment.getQuestionFromQuestionBank(request, response);
});

app.delete("/questionBank/questions/:questionId", async (request, response) => {
  console.log(`DELETE /questionBank/questions/${request.params.questionId}`);
  await assessment.deleteQuestionBankQuestion(request, response);
});

app.get("/questionBank/questions/start/:questionStartId/limit/:limit", async (request, response) => {
  console.log(`GET /questionBank/questions/start/${request.params.questionStartId}/limit/${request.params.limit}`);
  await assessment.getLimitedQuestions(request, response);
});

app.get("/questionBank/questions/start/:questionStartId/limit/:limit/sortBy/:sortTerm", async (request, response) => {
  console.log(`GET /questionBank/questions/start/${request.params.questionStartId}/limit/${request.params.limit}/sortBy/${request.params.sortTerm}`);
  await assessment.getLimitSortQuestions(request, response);
});

app.get("/questionBank/questions/filter/:filterTopic", async (request, response) => {
  console.log(`GET /questionBank/questions/filter/${request.params.filterTopic}`);
  await assessment.getFilterQuestions(request, response);
});

app.get("/topicGroup/:topicGroupId/quizzes/:quizId/studentAttempt", async (request, response) => {
  console.log(`GET /topicGroup/${request.params.topicGroupId}/quizzes/${request.params.quizId}/studentAttempt`);
  await assessment.getStudentAttempts(request, response);
});

app.get("/topicGroup/:topicGroupId/quizzes/:quizId/studentAttempt/:studentId", async (request, response) => {
  console.log(`GET /topicGroup/${request.params.topicGroupId}/quizzes/${request.params.quizId}/studentAttempt/${request.params.studentId}`);
  await assessment.getStudentAttemptById(request, response);
});

app.post("/topicGroup/:topicGroupId/quizzes/:quizId/studentAttempt/:studentId", async (request, response) => {
  console.log(`POST /topicGroup/${request.params.topicGroupId}/quizzes/${request.params.quizId}/studentAttempt/${request.params.studentId}`);
  await assessment.postStudentAttempt(request, response);
});

app.delete("/topicGroup/:topicGroupId/quizzes/:quizId/studentAttempt/:studentId", async (request, response) => {
  console.log(`DELETE /topicGroup/${request.params.topicGroupId}/quizzes/${request.params.quizId}/studentAttempt/${request.params.studentId}`);
  await assessment.deleteStudentAttemptByid(request, response);
});

app.post("/topicGroup/:topicGroupId/quizzes/:quizId/:questionId/:studentId", async (request, response) => {
  console.log(`POST /topicGroup/${request.params.topicGroupId}/quizzes/${request.params.quizId}/${request.params.questionId}/${request.params.studentId}`);
  await assessment.postStudentAnswer(request, response);
});

app.put("/topicGroup/:topicGroupId/quizzes/:quizId/:questionId/:studentId", async (request, response) => {
  console.log(`PUT /topicGroup/${request.params.topicGroupId}/quizzes/${request.params.quizId}/${request.params.questionId}/${request.params.studentId}`);
  await assessment.putStudentAnswer(request, response);
});

app.post("/topicGroup/quizzes/question/answer", async (request, response) => {
  console.log(`POST /topicGroup/quizzes/question/answer`);
  await assessment.postQuestionAnswer(request, response);
});

app.put("/topicGroup/quizzes/question/answer/:answerId", async (request, response) => {
  console.log(`PUT /topicGroup/quizzes/question/answer/${request.params.answerId}`);
  await assessment.putQuestionAnswer(request, response);
});

app.delete("/topicGroup/quizzes/question/answer/:answerId", async (request, response) => {
  console.log(`DELETE /topicGroup/quizzes/question/answer/${request.params.answerId}`);
  await assessment.deleteQuestionAnswer(request, response);
});

app.post("/questionBank/question", async (request, response) => {
  console.log(`POST /questionBank/question/new`);
  await assessment.postQuestion(request, response);
});

app.put("/questionBank/question/edit/:questionId", async (request, response) => {
  console.log(`PUT /questionBank/question/edit/${request.params.questionId}`);
  await assessment.putQuestion(request, response);
});

app.delete("/questionBank/question/delete/:questionId", async (request, response) => {
  console.log(`DELETE /questionBank/question/delete/${request.params.questionId}`);
  await assessment.deleteQuestion(request, response);
});

/***************************************************************
                       Lecture and Tutorial Functions
***************************************************************/

app.post("/:target/file/:targetId", async (request, response) => {
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
    console.log(`DELETE ${request.params.topicGroupName}/tutorial/${request.params.tutorialId}`);
    await lectureTutorial.deleteTutorial(request, response);
  }
);

app.post("/:topicGroupName/tutorial", async (request, response) => {
  console.log(`POST ${request.params.topicGroupName}/tutorial`);
  await lectureTutorial.postTutorial(request, response);
});

app.get("/:topicGroupName/:type/search/:searchTerm", async (request, response) => {
  console.log(`GET /${request.params.topicGroupName}/${request.params.type}/search/${request.params.searchTerm}`);
  await lectureTutorial.getSearchFile(request, response);
}) *

app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000/\n");
});
