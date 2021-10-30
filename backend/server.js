const express = require("express");
var cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(fileUpload());
app.use("/static", express.static("public"));
app.use("/_files", express.static("public/_files"));

const dateFormatter = (date) => {
  const d = new Date(date);
  return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} ${d.getDay()}/${
    d.getMonth() + 1
  }/${d.getFullYear()}`;
};

const logger = (request) => {
  const now = Date.now();
  console.log(`${request.method} - ${request.url} - ${dateFormatter(now)}`);
};

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
  logger(request);
  await database.login(request, response);
});

app.post("/auth/register", async (request, response) => {
  logger(request);
  await database.register(request, response);
});

/***************************************************************
                       User Functions
***************************************************************/

app.get("/user/:userId", async (request, response) => {
  logger(request);
  await users.getUser(request, response);
});

app.delete("/user/:userId", async (request, response) => {
  logger(request);
  await users.deleteUser(request, response);
});

app.put("/user/:userId", async (request, response) => {
  logger(request);
  await users.putAccessedTopic(request, response);
});

app.post("/user/:userId/:topicGroupId", async (request, response) => {
  logger(request);
  await users.postAdmin(request, response);
});

app.delete("/user/:userId/:topicGroupId", async (request, response) => {
  logger(request);
  await users.deleteAdmin(request, response);
});

app.put("/user/:userId/progress", async (request, response) => {
  logger(request);
  await users.putUserProgress(request, response);
});

app.get("/user/:userId/calendar", async (request, response) => {
  logger(request);
  await users.getUserCalendar(request, response);
});

app.get("/user/calendar/:calendarId", async (request, response) => {
  logger(request);
  await users.getCalendarById(request, response);
});

app.delete("/user/calendar/:calendarId", async (request, response) => {
  logger(request);
  await users.deleteCalendarById(request, response);
});

app.put("/user/:userId/calendar", async (request, response) => {
  logger(request);
  await users.postCalendar(request, response);
});

app.put("/user/calendar/:calendarId", async (request, response) => {
  logger(request);
  await users.putCalendarById(request, response);
});

app.get("/user/:userId/progress/:topicId", async (request, response) => {
  logger(request);
  await users.getUserContentProgress(request, response);
});

app.put("/user/:userId/progress/:topicId", async (request, response) => {
  logger(request);
  await users.putUserContentProgress(request, response);
});

/***************************************************************
                       Topic Group Functions
***************************************************************/

app.get("/topicGroup", async (request, response) => {
  logger(request);
  await database.getAllTopicGroups(request, response);
});

app.get("/topicGroup/all", async (request, response) => {
  logger(request);
  await database.getAllTopics(request, response);
});

app.get("/topicGroup/:topicGroupName", async (request, response) => {
  logger(request);
  await database.getTopicGroup(request, response);
});

app.put(
  "/topicGroup/:topicGroupName/searchable/:searchable",
  async (request, response) => {
    logger(request);
    await database.setSearchable(request, response);
  }
);

app.get("/topicGroup/:topicGroupName/topic", async (request, response) => {
  logger(request);
  await database.getTopics(request, response);
});

app.get(
  "/topicGroup/:topicGroupName/topic/:topicName/topic",
  async (request, response) => {
    logger(request);
    await database.getTopicFile(request, response);
  }
);

app.get(
  "/topicGroup/:topicGroupName/topic/:topicName/prerequisite",
  async (request, response) => {
    logger(request);
    await database.getTopicPreReqs(request, response);
  }
);

// Modify to include topicGroupName and topicName for filtering correctness
app.post(
  "/topicGroup/:topicGroupName/topic/:topicName/prerequisite",
  async (request, response) => {
    logger(request);
    await database.postPreReq(request.body, response);
  }
);

// Modify to include topicGroupName and topicName for filtering correctness
app.delete(
  "/topicGroup/:topicGroupName/topic/:topicName/prerequisite",
  async (request, response) => {
    logger(request);
    await database.deletePreReq(request.body, response);
  }
);

// Tags for topic group
app.post(
  "/topicGroup/:topicGroupName/topic/:topicName/tag",
  async (request, response) => {
    logger(request);
    await database.putTopicTag(request, response);
  }
);

app.delete(
  "/topicGroup/:topicGroupName/topic/:topicName/tag",
  async (request, response) => {
    logger(request);
    await database.deleteTopicTag(request, response);
  }
);

app.post("/topicGroup/:topicGroupName", async (request, response) => {
  logger(request);
  await database.postTopicGroup(request, response);
});

app.put("/topicGroup/:topicGroupName", async (request, response) => {
  logger(request);
  await database.putTopicGroup(request, response);
});

app.delete("/topicGroup/:topicGroupName", async (request, response) => {
  logger(request);
  await database.deleteTopicGroup(request, response);
});

app.post(
  "/topicGroup/:topicGroupName/topic/:topicName",
  async (request, response) => {
    logger(request);
    await database.postTopic(request, response);
  }
);

app.put(
  "/topicGroup/:topicGroupName/topic/:topicName",
  async (request, response) => {
    logger(request);
    await database.putTopic(request, response);
  }
);

app.delete(
  "/topicGroup/:topicGroupName/topic/:topicName",
  async (request, response) => {
    logger(request);
    await database.deleteTopic(request, response);
  }
);

app.get("/topic/:fileId", async (request, response) => {
  logger(request);
  await topics.getTopicFileById(request, response);
});

app.put("/topic/:fileId", async (request, response) => {
  logger(request);
  await topics.putTopicFileDueDate(request, response);
});

/***************************************************************
                    Enrollment Functions
***************************************************************/

app.post("/enroll/code/:topicGroupName", async (request, response) => {
  logger(request);
  await database.generateCode(request, response);
});

app.put("/enroll/code/:inviteCode/:userId", async (request, response) => {
  logger(request);
  await database.enrollUserWithCode(request, response);
});

// Gets all codes for a topic group
app.get("/enroll/codes/:topicGroupName", async (request, response) => {
  logger(request);
  await database.getCourseCodes(request, response);
});

// Gets a specific code
app.get("/enroll/code/:inviteCode", async (request, response) => {
  logger(request);
  await database.getCourseCode(request, response);
});
// Gets a specific code
app.delete("/enroll/code/:inviteCode", async (request, response) => {
  logger(request);
  await database.deleteCourseCode(request, response);
});

app.get("/enrollments/:topicGroupName", async (request, response) => {
  logger(request);
  await database.getEnrollments(request, response);
});

app.put("/enroll/:topicGroupName/:zId", async (request, response) => {
  logger(request);
  await database.enrollUser(request, response);
});

app.put("/unenroll/:topicGroupName/:userId", async (request, response) => {
  logger(request);
  await database.unenrollUser(request, response);
});

/***************************************************************
                       Forum Functions
***************************************************************/

app.get("/:topicGroup/forum", async (request, response) => {
  logger(request);
  await forums.getAllForumPosts(request, response);
});

app.get("/:topicGroup/forum/pinned", async (request, response) => {
  logger(request);
  await forums.getAllPinnedPosts(request, response);
});

app.get(
  "/:topicGroup/forum/search/:forumSearchTerm",
  async (request, response) => {
    logger(request);
    await forums.getSearchPosts(request, response);
  }
);

app.get("/:topicGroup/forum/filter", async (request, response) => {
  logger(request);
  await forums.getFilterPosts(request, response);
});

app.post("/:topicGroup/forum/post", async (request, response) => {
  logger(request);
  await forums.postForum(request, response);
});

app.get("/:topicGroup/forum/post/:postId", async (request, response) => {
  logger(request);
  await forums.getPostById(request, response);
});

app.put("/:topicGroup/forum/post/:postId", async (request, response) => {
  logger(request);
  await forums.putPost(request, response);
});

app.delete("/:topicGroup/forum/post/:postId", async (request, response) => {
  logger(request);
  await forums.deletePost(request, response);
});

app.put(
  "/:topicGroup/forum/post/:postId/reply/:replyId",
  async (request, response) => {
    logger(request);
    await forums.putPostReply(request, response);
  }
);

app.post("/:topicGroup/forum/post/:postId/reply", async (request, response) => {
  logger(request);
  await forums.postReply(request, response);
});

app.delete(
  "/:topicGroup/forum/post/:postId/reply/:replyId",
  async (request, response) => {
    logger(request);
    await forums.deletePostReply(request, response);
  }
);

app.post(
  "/:topicGroup/forum/post/:postId/comment",
  async (request, response) => {
    logger(request);
    await forums.postComment(request, response);
  }
);

app.put(
  "/:topicGroup/forum/post/:postId/comment/:commentId",
  async (request, response) => {
    logger(request);
    await forums.putComment(request, response);
  }
);

app.delete(
  "/:topicGroup/forum/post/:postId/comment/:commentId",
  async (request, response) => {
    logger(request);
    await forums.deleteComment(request, response);
  }
);

app.put(
  "/:topicGroup/forum/post/:postId/comment/:commentId/endorse/:isEndorsed",
  async (request, response) => {
    logger(request);
    await forums.putCommentEndorse(request, response);
  }
);

app.put(
  "/:topicGroup/forum/post/pin/:postId/:isPinned",
  async (request, response) => {
    logger(request);
    await forums.putPostPin(request, response);
  }
);

app.get("/:topicGroup/forum/tags/:tagId", async (request, response) => {
  logger(request);
  await forums.getTag(request, response);
});

app.put("/:topicGroup/forum/tags/:tagId", async (request, response) => {
  logger(request);
  await forums.putTag(request, response);
});

app.put("/:topicGroup/forum/tags", async (request, response) => {
  logger(request);
  await forums.getAllTags(request, response);
});

app.post("/:topicGroup/forum/tags", async (request, response) => {
  logger(request);
  await forums.postTag(request, response);
});

app.delete("/:topicGroup/forum/tags/:tagId", async (request, response) => {
  logger(request);
  await forums.deleteTag(request, response);
});

app.put(
  "/:topicGroup/forum/post/endorse/:postId/:isEndorsed",
  async (request, response) => {
    logger(request);
    await forums.putPostEndorse(request, response);
  }
);

app.put("/:topicGroup/forum/post/like/:postId", async (request, response) => {
  logger(request);
  await forums.putPostLike(request, response);
});

app.get("/:topicGroup/forum/post/like/:postId", async (request, response) => {
  logger(request);
  await forums.getPostLikes(request, response);
});

app.put("/:topicGroup/forum/post/unlike/:postId", async (request, response) => {
  logger(request);
  await forums.putPostUnlike(request, response);
});

/***************************************************************
                       Course Pages Functions
***************************************************************/

app.get("/:topicGroup/announcement", async (request, response) => {
  logger(request);
  await database.getAnnouncements(request, response);
});

app.post("/:topicGroup/announcement/new", async (request, response) => {
  logger(request);
  await database.postAnnouncement(request, response);
});

app.get(
  "/:topicGroup/announcement/:announcementId",
  async (request, response) => {
    logger(request);
    await database.getAnnouncementById(request, response);
  }
);

app.put(
  "/:topicGroup/announcement/:announcementId",
  async (request, response) => {
    logger(request);
    await database.putAnnouncement(request, response);
  }
);

app.delete(
  "/:topicGroup/announcement/:announcementId",
  async (request, response) => {
    logger(request);
    await database.deleteAnnouncement(request, response);
  }
);

app.post(
  "/:topicGroup/announcement/:announcementId/comment",
  async (request, response) => {
    logger(request);
    await database.postAnnouncementComment(request, response);
  }
);

app.put(
  "/:topicGroup/announcement/:announcementId/comment/:commentId",
  async (request, response) => {
    logger(request);
    await database.putAnnouncementComment(request, response);
  }
);

app.delete(
  "/:topicGroup/announcement/:announcementId/comment/:commentId",
  async (request, response) => {
    logger(request);
    await database.deleteAnnouncementComment(request, response);
  }
);

app.get(
  "/:topicGroup/announcement/search/:announcementSearchTerm",
  async (request, response) => {
    logger(request);
    await database.getSearchAnnouncements(request, response);
  }
);

/***************************************************************
                       Gamification Functions
***************************************************************/

app.get("/questions", async (request, response) => {
  logger(request);
  await database.getQuestions(request, response);
});

app.post("/questions/new", async (request, response) => {
  logger(request);
  await database.postQuestion(request, response);
});

app.get("/questions/:questionId", async (request, response) => {
  logger(request);
  await database.getLevelFromQuestion(request, response);
});

app.put("/questions/:questionId", async (request, response) => {
  logger(request);
  await database.putQuestion(request, response);
});

app.delete("/questions/:questionId", async (request, response) => {
  logger(request);
  await database.deleteQuestion(request, response);
});

app.get("/levels", async (request, response) => {
  logger(request);
  await database.getAllLevels(request, response);
});

app.get("/levels/:levelId", async (request, response) => {
  logger(request);
  await database.getLevelById(request, response);
});

app.put("/levels/:levelId", async (request, response) => {
  logger(request);
  await database.putLevel(request, response);
});

app.delete("/levels/:levelId", async (request, response) => {
  logger(request);
  await database.deleteLevel(request, response);
});

app.post("/levels/new", async (request, response) => {
  logger(request);
  await database.postLevel(request, response);
});

app.get("/:level/questions", async (request, response) => {
  logger(request);
  await database.getLevelQuestions(request, response);
});

// Delete entire level or just remove level from topic group??
app.delete("/:topicGroup/remove-level/:level", async (request, response) => {
  logger(request);
  await database.removeTGLevel(request, response);
});

app.post("/topicGroup/:topicGroupId/newLevel", async (request, response) => {
  logger(request);
  await database.postTGLevel(request, response);
});

app.get("/topicGroup/:topicGroupId/levels", async (request, response) => {
  logger(request);
  await database.getTGLevels(request, response);
});

/***************************************************************
                       Assessment Functions
***************************************************************/

app.post("/quiz", async (request, response) => {
  logger(request);
  await database.postQuiz(request, response);
});

/* app.post('/quiz_question', async(request, response) => {
  await database.postQuizQuestion(request, response);
}) */

app.get("/quiz/:quizId", async (request, response) => {
  logger(request);
  await database.getQuizQuestions(request, response);
});

app.put("/quiz/:quizId", async (request, response) => {
  logger(request);
  await database.putQuizById(request, response);
});

app.delete("/quiz/:quizId", async (request, response) => {
  logger(request);
  await database.deleteQuizById(request, response);
});

app.get("/quiz/:quizId/question/:questionId", async (request, response) => {
  logger(request);
  await database.getQuestionFromQuiz(request, response);
});

app.put("/quiz/:quizId/question/:questionId", async (request, response) => {
  logger(request);
  await database.putQuestionFromQuiz(request, response);
});

app.get("/questionBank/:questionBankId", async (request, response) => {
  logger(request);
  await database.getQuestionBankQuestions(request, response);
});

app.put("/questionBank/:questionBankId", async (request, response) => {
  logger(request);
  await database.putQuestionBank(request, response);
});

app.delete("/questionBank/:questionBankId", async (request, response) => {
  logger(request);
  await database.deleteQuestionBank(request, response);
});

app.get("/questionBank", async (request, response) => {
  logger(request);
  await database.getAllQuestionBankQuestions(request, response);
});

app.get("/questionBank/question/:questionId", async (request, response) => {
  logger(request);
  await database.getQuestionFromQuestionBank(request, response);
});

app.post("/poll", async (request, response) => {
  logger(request);
  await database.postPoll(request, response);
});

app.get("/poll/:pollId", async (request, response) => {
  logger(request);
  await database.getPoll(request, response);
});

app.put("/poll/:pollId", async (request, response) => {
  logger(request);
  await database.putPoll(request, response);
});

app.delete("/poll/:pollId", async (request, response) => {
  logger(request);
  await database.deletePoll(request, response);
});

app.get(
  "/quiz/studentAnswers/student/:studentId",
  async (request, response) => {
    logger(request);
    await database.getStudentAnswer(request, response);
  }
);

app.post("/student_answer", async (request, response) => {
  logger(request);
  await database.postStudentAnswer(request, response);
});

app.post("/quiz_question_answer", async (request, response) => {
  logger(request);
  await database.postQuestionAnswer(request, response);
});

app.post(
  "/questionBank/:questionBankId/question",
  async (request, response) => {
    logger(request);
    await database.postQuizQuestion(request, response);
  }
);

app.delete(
  "/questionBank/:questionBankId/question/:questionId",
  async (request, response) => {
    logger(request);
    await database.deleteQuestionBankQuestion(request, response);
  }
);

app.delete("/question/:questionId/delete", async (request, response) => {
  logger(request);
  await database.deleteAssessmentQuestion(request, response);
});

app.put(
  "/quiz/:quizId/question/:questionId/answer/:quizQuestionAnswerId",
  async (request, response) => {
    logger(request);
    await database.putQuestionAnswer(request, response);
  }
);

app.get(
  "/quiz/results/question/:questionId/answerCount",
  async (request, response) => {
    logger(request);
    await database.getStudentAnswerCount(request, response);
  }
);

/***************************************************************
                       Lecture and Tutorial Functions
***************************************************************/

app.post("/file/:targetId", async (request, response) => {
  logger(request);
  await lectureTutorial.postLectureTutorialFile(request, response);
});

app.delete("/file/:targetId", async (request, response) => {
  logger(request);
  await lectureTutorial.deleteLectureTutorialFile(request, response);
});

app.get("/:topicGroupName", async (request, response) => {
  logger(request);
  await lectureTutorial.getWeeks(request, response);
});

app.get("/:topicGroupName/lectures", async (request, response) => {
  logger(request);
  await lectureTutorial.getAllLectures(request, response);
});

app.get("/:topicGroupName/lecture/:lectureId", async (request, response) => {
  logger(request);
  await lectureTutorial.getLectureById(request, response);
});

app.put("/:topicGroupName/lecture/:lectureId", async (request, response) => {
  logger(request);
  await lectureTutorial.putLecture(request, response);
});

app.delete("/:topicGroupName/lecture/:lectureId", async (request, response) => {
  logger(request);
  await lectureTutorial.deleteLecture(request, response);
});

app.post("/:topicGroupName/lecture", async (request, response) => {
  logger(request);
  await lectureTutorial.postLecture(request, response);
});

app.get("/:topicGroupName/tutorials", async (request, response) => {
  logger(request);
  await lectureTutorial.getAllTutorials(request, response);
});

app.get("/:topicGroupName/tutorial/:tutorialId", async (request, response) => {
  logger(request);
  await lectureTutorial.getTutorialById(request, response);
});

app.put("/:topicGroupName/tutorial/:tutorialId", async (request, response) => {
  logger(request);
  await lectureTutorial.putTutorial(request, response);
});

app.delete(
  "/:topicGroupName/tutorial/:tutorialId",
  async (request, response) => {
    logger(request);
    await lectureTutorial.deleteTutorial(request, response);
  }
);

app.post("/:topicGroupName/tutorial", async (request, response) => {
  logger(request);
  await lectureTutorial.postTutorial(request, response);
});

app.get("/:topicGroupName/lectures/search/", async (request, response) => {
  logger(request);
  await lectureTutorial.getSearchFile(request, response);
});

app.get("/:topicGroupName/tutorials/search/", async (request, response) => {
  logger(request);
  await lectureTutorial.getSearchFile(request, response);
});

app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000/\n");
});
