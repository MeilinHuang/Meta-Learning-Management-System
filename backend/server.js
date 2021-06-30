const express = require("express");
const app = express();
//const client = require('./db/database');
const database =  require('./service.js');

// Swagger API
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

app.get('/user/:userId', database.getUser);

app.put('/user/:userId', database.putUserAdmin);

app.delete('/user/:userId', database.deleteUser);

/***************************************************************
                       Topic Group Functions
***************************************************************/



app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000/");
});
