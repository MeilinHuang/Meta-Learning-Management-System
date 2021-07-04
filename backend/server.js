const express = require("express");
const app = express();
const database =  require('./service.js');

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

app.put('/forum/post/:postId/reply/:replyId', async(request, response) => {
  await database.putPostReply(request, response);
});

app.post('/forum/post/:postId/reply', async(request, response) => {
  await database.postReply(request, response);
});

app.post('/forum/post/:postId/comment', async(request, response) => {
  await database.postComment(request, response);
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

/***************************************************************
                       Course Pages Functions
***************************************************************/

app.get('/:topicGroup/announcement', async(request, response) => {
  await database.getAnnouncements(request, response);
})

app.post('/:topicGroup/announcement/new', async(request, response) => {
  await database.postAnnouncement(request, response);
})

app.post('/:topicGroup/announcement/comment', async(request, response) => {
  await database.postAnnouncementComment(request, response);
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

app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000/\n");
});
