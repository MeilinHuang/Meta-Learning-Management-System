const express = require("express");
const app = express();
const database =  require('./service.js');

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

app.get('/topicGroup/:topicGroupName/topic', database.getTopics);

app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000/");
});
