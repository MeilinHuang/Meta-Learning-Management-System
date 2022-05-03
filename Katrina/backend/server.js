// set up express app
const express = require('express');
const app = express();
const port = 3001;
const hostname = 'localhost';
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: '50mb'}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// connect db
const db = require('./queries');

app.get('/', (req, res) => {
  res.json({info: 'hello world'})
})


/* ================================ Users ================================*/
app.post('/user/auth', db.getUser);                              // get user info through given detail
app.get('/user/name/:id', db.getUserName);

/* ================================ courses ================================*/
app.get('/courses/all/:email', db.getCoursesByEmail);                   // get enrolled courses by a student id
app.get('/courses/teach/course/:courseCode', db.getTeachesByCode);
app.get('/courses/teach/:staffId', db.getTeachesByStaffId);
app.get('/courses/in-progress/:userId', db.getActiveCoursesByUserId); 
app.get('/courses/:courseCode', db.getCourseByCode);
app.get('/courses/:courseCode/:term', db.getCourseByCodeTerm); 

/* ================================ lectures ================================*/
app.get('/lectures/:courseCode/:term', db.getLecturesByCourse);  // get all lectures data in a course
app.get('/lecture/:id', db.getLectureById);                     // get lecture data by id

/* ================================ notes ================================*/
app.get('/notes/public/:courseCode/:term', db.getPublicNotesByCourseCodeTerm);
app.get('/notes/public/:courseIds', db.getPublicNotesByCourseId);
app.get('/notes/course/:userId/:courseId', db.getNotesByCourseId);    // get notes to a specific course
app.get('/notes/keyword/:userId/:keyword', db.getNotesByKeyword);   // get notes by a keyword
app.get('/notes/:userId/:id', db.getNoteByLectureId);                 // get lecture notes to a course
app.get('/notes-user/:userId', db.getNotesByUser);                   // get notes by a user 
app.get('/notes-user/public/:userId', db.getPublicNotesByUser);     // get all public notes of a user
app.post('/notes', db.postNote);                                    // save notes into db

app.listen(port,'0.0.0.0', () => {
    console.log(`Meta-LMS db listening at http://${hostname}:${port}`);
})