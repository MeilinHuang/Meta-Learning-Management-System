const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");

app.use(express.json({ limit: "50mb" }));
app.use(fileUpload());
app.use("/static", express.static("public"));
app.use("/_files", express.static("public/_files"));

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
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
const assessment = require("./api/assessment");
const auth = require("./api/authentication");

/***************************************************************
                       Auth Functions
***************************************************************/

app.post("/auth/login", async (request, response) => {
  logger(request);
  await auth.login(request, response);
});

app.post("/auth/register", async (request, response) => {
  logger(request);
  await auth.register(request, response);
});

/***************************************************************
                       User Functions
***************************************************************/

app.get("/user/:userId", async (request, response) => {
  logger(request);
  await users.getUser(request, response);
});

app.put("/user/:userId", async (request, response) => {
  logger(request);
  await users.updateUser(request, response);
});

app.delete("/user/:userId", async (request, response) => {
  logger(request);
  await users.deleteUser(request, response);
});

app.put("/user/:userId", async (request, response) => {
  logger(request);
  await users.putAccessedTopic(request, response);
});

app.post("/user/:userId/:topicGroupId/admin", async (request, response) => {
  logger(request);
  await users.postAdmin(request, response);
});

app.delete("/user/:userId/:topicGroupId/admin", async (request, response) => {
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

app.post("/user/:userId/calendar", async (request, response) => {
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
                       Assessment Functions
***************************************************************/

app.get("/topicGroup/:topicGroupId/quizzes", async (request, response) => {
  logger(request);
  await assessment.getAllQuizzes(request, response);
});

app.get(
  "/topicGroup/:topicGroupId/quizzes/:quizId",
  async (request, response) => {
    logger(request);
    await assessment.getQuizById(request, response);
  }
);

app.post("/topicGroup/:topicGroupId/quizzes", async (request, response) => {
  logger(request);
  await assessment.postQuiz(request, response);
});

app.put(
  "/topicGroup/:topicGroupId/quizzes/:quizId",
  async (request, response) => {
    logger(request);
    await assessment.putQuizById(request, response);
  }
);

app.delete(
  "/topicGroup/:topicGroupId/quizzes/:quizId",
  async (request, response) => {
    logger(request);
    await assessment.deleteQuizById(request, response);
  }
);

app.put(
  "/topicGroup/:topicGroupId/quizzes/:quizId/questions/:questionId",
  async (request, response) => {
    logger(request);
    await assessment.putQuestionById(request, response);
  }
);

app.get("/questionBank/questions", async (request, response) => {
  logger(request);
  await assessment.getQuestionBankQuestions(request, response);
});

app.get("/questionBank/questions/:questionId", async (request, response) => {
  logger(request);
  await assessment.getQuestionFromQuestionBank(request, response);
});

app.delete("/questionBank/questions/:questionId", async (request, response) => {
  logger(request);
  await assessment.deleteQuestionBankQuestion(request, response);
});

app.get(
  "/questionBank/questions/start/:questionStartId/limit/:limit",
  async (request, response) => {
    logger(request);
    await assessment.getLimitedQuestions(request, response);
  }
);

app.get(
  "/questionBank/questions/start/:questionStartId/limit/:limit/sortBy/:sortTerm",
  async (request, response) => {
    logger(request);
    await assessment.getLimitSortQuestions(request, response);
  }
);

app.get(
  "/questionBank/questions/filter/:filterTopic",
  async (request, response) => {
    logger(request);
    await assessment.getFilterQuestions(request, response);
  }
);

app.get(
  "/topicGroup/:topicGroupId/quizzes/:quizId/studentAttempt",
  async (request, response) => {
    logger(request);
    await assessment.getStudentAttempts(request, response);
  }
);

app.get(
  "/topicGroup/:topicGroupId/quizzes/:quizId/studentAttempt/:studentId",
  async (request, response) => {
    logger(request);
    await assessment.getStudentAttemptById(request, response);
  }
);

app.post(
  "/topicGroup/:topicGroupId/quizzes/:quizId/studentAttempt/:studentId",
  async (request, response) => {
    logger(request);
    await assessment.postStudentAttempt(request, response);
  }
);

app.delete(
  "/topicGroup/:topicGroupId/quizzes/:quizId/studentAttempt/:studentId",
  async (request, response) => {
    logger(request);
    await assessment.deleteStudentAttemptByid(request, response);
  }
);

app.post(
  "/topicGroup/:topicGroupId/quizzes/:quizId/:questionId/:studentId",
  async (request, response) => {
    logger(request);
    await assessment.postStudentAnswer(request, response);
  }
);

app.put(
  "/topicGroup/:topicGroupId/quizzes/:quizId/:questionId/:studentId",
  async (request, response) => {
    logger(request);
    await assessment.putStudentAnswer(request, response);
  }
);

app.post("/topicGroup/quizzes/question/answer", async (request, response) => {
  logger(request);
  await assessment.postQuestionAnswer(request, response);
});

app.put(
  "/topicGroup/quizzes/question/answer/:answerId",
  async (request, response) => {
    logger(request);
    await assessment.putQuestionAnswer(request, response);
  }
);

app.delete(
  "/topicGroup/quizzes/question/answer/:answerId",
  async (request, response) => {
    logger(request);
    await assessment.deleteQuestionAnswer(request, response);
  }
);

app.post("/questionBank/question", async (request, response) => {
  logger(request);
  await assessment.postQuestion(request, response);
});

app.put(
  "/questionBank/question/edit/:questionId",
  async (request, response) => {
    logger(request);
    await assessment.putQuestion(request, response);
  }
);

app.delete(
  "/questionBank/question/delete/:questionId",
  async (request, response) => {
    logger(request);
    await assessment.deleteQuestion(request, response);
  }
);

/***************************************************************
                       Lecture and Tutorial Functions
***************************************************************/

app.post("/:target/file/:targetId", async (request, response) => {
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

app.get(
  "/:topicGroupName/:type/search/:searchTerm",
  async (request, response) => {
    logger(request);
    await lectureTutorial.getSearchFile(request, response);
  }
);

app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000/\n");
});
