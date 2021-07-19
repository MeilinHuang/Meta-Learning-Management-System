const express = require("express");
var cors = require('cors');
const app = express();
const database =  require('./service.js');
app.use(cors());
// Body parsing
app.use(express.json());

/***************************************************************
                       Swagger API
***************************************************************/

const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

// Redirect to swagger
app.get('/', (req, res) => res.redirect('/docs'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/***************************************************************
                       Auth Functions
***************************************************************/

app.post('/auth/login');

app.post('/auth/logout');

/***************************************************************
                       User Functions
***************************************************************/

app.get('/user/:userId', async(request, response) => {
  await database.getUser(request, response);
});

app.delete('/user/:userId', database.deleteUser);

app.post('/user/:userId/:topicGroupId', database.postAdmin);

app.delete('/user/:userId/:topicGroupId', database.deleteAdmin);

/***************************************************************
                       Topic Group Functions
***************************************************************/


app.get('/topicGroup', async(request, response) => {
  await database.getAllTopicGroups(request, response);
});

app.get('/topicGroup/:topicGroupName/topic', async(request, response) => {
  await database.getTopics(request, response);
});

app.get('/topicGroup/:topicGroupName/topic/:topicName/prerequisite', async(request, response) => {
  await database.getTopicPreReqs(request, response);
});

// Modify to include topicGroupName and topicName for filtering correctness
app.post('/topicGroup/:topicGroupName/topic/:topicName/prerequisite', async(request, response) => {
  await database.postPreReq(request.body, response);
});

// Modify to include topicGroupName and topicName for filtering correctness
app.delete('/topicGroup/:topicGroupName/topic/:topicName/prerequisite', async(request, response) => {
  await database.deletePreReq(request.body, response);
});

app.post('/topicGroup/:topicGroupName', async(request, response) => {
  await database.postTopicGroup(request, response);
});

app.delete('/topicGroup/:topicGroupName', async(request, response) => {
  await database.deleteTopicGroup(request, response);
});

app.post('/topicGroup/:topicGroupName/topic/:topicName', async(request, response) => {
  await database.postTopic(request, response);
})

/***************************************************************
                       Forum Functions
***************************************************************/

app.get('/forum', async(request, response) => {
  await database.getAllForumPosts(request, response);
});

app.get('/forum/pinned', async(request, response) => {
  await database.getAllPinnedPosts(request, response);
});

app.get('/forum/search/:forumSearchTerm', async(request, response) => {
  await database.getSearchPosts(request, response);
});

app.get('/forum/:forumFilterTerm', async(request, response) => {
  await database.getFilterPosts(request, response);
});

app.post('/forum/post', async(request, response) => {
  await database.postForum(request, response);
});

app.get('/forum/post/:postId', async(request, response) => {
  await database.getPostById(request, response);
});

app.put('/forum/post/:postId', async(request, response) => {
  await database.putPost(request, response);
});

app.delete('/forum/post/:postId', async(request, response) => {
  await database.deletePost(request, response);
});

app.put('/forum/post/:postId/reply/:replyId', async(request, response) => {
  await database.putPostReply(request, response);
});

app.post('/forum/post/:postId/reply', async(request, response) => {
  await database.postReply(request, response);
});

app.delete('/forum/post/:postId/reply/:replyId', async(request, response) => {
  await database.deletePostReply(request, response);
});

app.post('/forum/post/:postId/comment', async(request, response) => {
  await database.postComment(request, response);
});

app.put('/forum/post/:postId/comment/:commentId', async(request, response) => {
  await database.putComment(request, response);
});

app.delete('/forum/post/:postId/comment/:commentId', async(request, response) => {
  await database.deleteComment(request, response);
});

app.put('/forum/post/pin/:postId/:isPinned', async(request, response) => {
  await database.putPostPin(request, response);
});

app.put('/forum/tags', async(request, response) => {
  await database.getAllTags(request, response);
});

app.post('/forum/tags', async(request, response) => {
  await database.postTag(request, response);
});

app.delete('/forum/tags/:tagId', async(request, response) => {
  await database.deleteTag(request, response);
});

app.put('/forum/post/endorse/:postId/:isEndorsed', async(request, response) => {
  await database.putPostEndorse(request, response);
});

app.put('/forum/post/like/:postId', async(request, response) => {
  await database.putPostLike(request, response);
});

app.put('/forum/post/unlike/:postId', async(request, response) => {
  await database.putPostUnlike(request, response);
});


/***************************************************************
                       Course Pages Functions
***************************************************************/

app.get('/:topicGroup/announcement', async(request, response) => {
  await database.getAnnouncements(request, response);
})

app.post('/:topicGroup/announcement/new', async(request, response) => {
  await database.postAnnouncement(request, response);
})

app.get('/:topicGroup/announcement/:announcementId', async(request, response) => {
  await database.getAnnouncementById(request, response);
})

app.put('/:topicGroup/announcement/:announcementId', async(request, response) => {
  await database.putAnnouncement(request, response);
})

app.delete('/:topicGroup/announcement/:announcementId', async(request, response) => {
  await database.deleteAnnouncement(request, response);
})

app.post('/:topicGroup/announcement/:announcementId/comment', async(request, response) => {
  await database.postAnnouncementComment(request, response);
})

app.put('/:topicGroup/announcement/:announcementId/comment/:commentId', async(request, response) => {
  await database.putAnnouncementComment(request, response);
})

app.delete('/:topicGroup/announcement/:announcementId/comment/:commentId', async(request, response) => {
  await database.deleteAnnouncementComment(request, response);
})

/***************************************************************
                       Gamification Functions
***************************************************************/

app.get('/questions', async(request, response) => {
  await database.getQuestions(request, response);
})

app.post('/questions/new', async(request, response) => {
  await database.postQuestion(request, response);
})

app.get('/questions/:questionId', async(request, response) => {
  await database.getLevelFromQuestion(request, response);
})

app.put('/questions/:questionId', async(request, response) => {
  await database.putQuestion(request, response);
})

app.delete('/questions/:questionId', async(request, response) => {
  await database.deleteQuestion(request, response);
})

app.get('/levels', async(request, response) => {
  await database.getAllLevels(request, response);
})

app.get('/levels/:levelId', async(request, response) => {
  await database.getLevelById(request, response);
})

app.put('/levels/:levelId', async(request, response) => {
  await database.putLevel(request, response);
})

app.delete('/levels/:levelId', async(request, response) => {
  await database.deleteLevel(request, response);
})

app.post('/levels/new', async(request, response) => {
  await database.postLevel(request, response);
})

app.get('/:level/questions', async(request, response) => {
  await database.getLevelQuestions(request, response);
})

// Delete entire level or just remove level from topic group??
app.delete('/:topicGroup/remove-level/:level', async(request, response) => {
  await database.removeTGLevel(request, response);
})

app.post('/topicGroup/:topicGroupId/newLevel', async(request, response) => {
  await database.postTGLevel(request, response);
})

app.get('/topicGroup/:topicGroupId/levels', async(request, response) => {
  await database.getTGLevels(request, response);
})

/***************************************************************
                       Assessnebt Functions
***************************************************************/

app.post('/quiz', async(request, response) => {
  await database.postQuiz(request, response);
})

/* app.post('/quiz_question', async(request, response) => {
  await database.postQuizQuestion(request, response);
}) */

app.get('/quiz/:quizId', async(request, response) => {
  await database.getQuizQuestions(request, response);
})

app.put('/quiz/:quizId', async(request, response) => {
  await database.putQuizById(request, response);
})

app.delete('/quiz/:quizId', async(request, response) => {
  await database.deleteQuizById(request, response);
})

app.get('/quiz/:quizId/question/:questionId', async(request, response) => {
  await database.getQuestionFromQuiz(request, response);
})

app.put('/quiz/:quizId/question/:questionId', async(request, response) => {
  await database.putQuestionFromQuiz(request, response);
})

app.get('/questionBank/:questionBankId', async(request, response) => {
  await database.getQuestionBankQuestions(request, response);
})

app.put('/questionBank/:questionBankId', async(request, response) => {
  await database.putQuestionBank(request, response);
})

app.delete('/questionBank/:questionBankId', async(request, response) => {
  await database.deleteQuestionBank(request, response);
})

app.get('/questionBank', async(request, response) => {
  await database.getAllQuestionBankQuestions(request, response);
})

app.get('/questionBank/question/:questionId', async(request, response) => {
  await database.getQuestionFromQuestionBank(request, response);
})

app.post('/poll', async(request, response) => {
  await database.postPoll(request, response);
})

app.get('/poll/:pollId', async(request, response) => {
  await database.getPoll(request, response);
})

app.put('/poll/:pollId', async(request, response) => {
  await database.putPoll(request, response);
})

app.delete('/poll/:pollId', async(request, response) => {
  await database.deletePoll(request, response);
})

app.get('/quiz/studentAnswers/student/:studentId', async(request, response) => {
  await database.getStudentAnswer(request, response);
})

app.post('/student_answer', async(request, response) => {
  await database.postStudentAnswer(request, response);
})

app.post('/quiz_question_answer', async(request, response) => {
  await database.postQuestionAnswer(request, response);
})

app.post('/questionBank/:questionBankId/question', async(request, response) => {
  await database.postQuizQuestion(request, response);
})

app.delete('/questionBank/:questionBankId/question/:questionId', async(request, response) => {
  await database.deleteQuestionBankQuestion(request, response);
})

app.delete('/question/:questionId/delete', async(request, response) => {
  await database.deleteAssessmentQuestion(request, response);
})

app.put('/quiz/:quizId/question/:questionId/answer/:quizQuestionAnswerId', async(request, response) => {
  await database.putQuestionAnswer(request, response);
})

app.get('/quiz/results/question/:questionId/answerCount', async(request, response) => {
  await database.getStudentAnswerCount(request, response);
})

app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000/\n");
});
