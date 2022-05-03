// set up postgres connection using node-postgres
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})

/* ================================ Users ================================*/
// get user info through given detail
const getUser = (request, response) => {
  const { email, password } = request.body;
  console.log('looking for users', request.body)
  
  try {
    pool.query(
      "SELECT * FROM users WHERE email = $1 and pw = $2", 
      [email, password],
      (error, results) => {
        if (error) {
          response.status(400).json(error);
          console.log(error)
        } else if (results.rows.length === 0) {
          response.status(404).send("No user found"); 
        } else {
          response.status(200).json(results.rows[0]);
        }
    })
  } catch (error) {
    response.status(500).json(error.message);
  }
}

// get user name
const getUserName = (request, response) => {
  const id = request.params.id;
  console.log('looking for users', id)
  try {
    pool.query(
      "SELECT name, staff FROM users WHERE id=$1",
      [id],
      (error, results) => {
        if (error) {
          response.status(400).json(error);
          console.log(error)
        } else if (results.rows.length === 0) {
          response.status(404).send("No user found");
        } else {
          console.log(results.rows[0])
          response.status(200).json(results.rows[0]);
        }
      })
  } catch (error) {
    response.status(500).json(error.message);
  }
}

/* ================================ courses ================================*/
// get enrolled courses by a student id
const getCoursesByEmail = (request, response) => {
  // response.header("Access-Control-Allow-Origin", "*");
  const email = request.params.email;

  try {
    pool.query(
      'SELECT c.course_id, c.course_name, c.course_code, c.term FROM enrol e JOIN users u on u.id=e.userid JOIN courses c on e.course=c.course_id WHERE u.email = $1', 
      [email],
      (error, results) => {
      if (error) {
        response.status(400).json(error);
        console.log(error)
      } else if (results.rows.length === 0) {
        response.status(404).send("Incorrect email or no enrolled course found"); 
      } else {
        response.status(200).json(results.rows);
      }
    })
  } catch (error){
    response.status(500).json(error.message);
  }
}

// Get course object by course code
const getCourseByCode = (request, response) => {
  const code = request.params.courseCode.toUpperCase();
  console.log("Looking for ", code);

  try {
    pool.query(
      'SELECT * FROM courses WHERE course_code = $1',
      [code],
      (error, results) => {
        if (error) {
          response.status(400).json(error);
          console.log(error);
        } else if (results.rows.length === 0) {
          console.log('No such course found')
          response.status(404).send("No such course found");
        } else {
          console.log(results.rows)
          response.status(200).json(results.rows);
        }
      })
  } catch (err){
    response.status(500).json(error.message);
  }
}

const getTeachesByStaffId = (request, response) => {
  const staffId = request.params.staffId;
  console.log("Looking for courses teaching by:", staffId);

  try {
    pool.query(
      'SELECT c.course_id, c.course_name, c.course_code, c.term FROM teach t JOIN courses c on t.course=c.course_id WHERE t.userid = $1', 
      [staffId],
      (error, results) => {
        if (error) {
          response.status(400).json(error);
          console.log(error);
        } else if (results.rows.length === 0) {
          console.log('No courses found')
          response.status(404).send("No courses found");
        } else {
          console.log(results.rows)
          response.status(200).json(results.rows);
        }
      })
  } catch (error) {
    response.status(500).json(error.message);
  }
}

const getTeachesByCode = (request, response) => {
  const code = request.params.courseCode.toUpperCase();
  console.log("Looking for teaching course:", code);

  try {
    pool.query(
      'SELECT c.course_id, c.course_name, c.course_code, c.term FROM teach t JOIN users u on t.userid=u.id JOIN courses c on t.course=c.course_id WHERE c.course_code=$1',
      [code],
      (error, results) => {
        if (error) {
          response.status(400).json(error);
          console.log(error);
        } else if (results.rows.length === 0) {
          console.log('No such course found')
          response.status(404).send("No such course found");
        } else {
          console.log(results.rows)
          response.status(200).json(results.rows);
        }
      })
  } catch (error) {
    response.status(500).json(error.message);
  }
}

// get course object by course code and teaching term
const getCourseByCodeTerm = (request, response) => {
  const code = request.params.courseCode.toUpperCase();
  const term = request.params.term;
  console.log("Looking for course:", code, term);
  
  try {
    pool.query(
      'SELECT * FROM courses WHERE course_code = $1 and term = $2', 
      [code, term],
      (error, results) => {
      if (error) {
        response.status(400).json(error);
        console.log(error);
      } else if (results.rows.length === 0) {
        console.log('No such course found')
        response.status(404).send("No such course found"); 
      } else {
        console.log(results.rows[0])
        response.status(200).json(results.rows[0]);
      }
    })
  } catch (error){
    response.status(500).json(error.message);
  }
}

const getActiveCoursesByUserId = (request, response) => {
  const userId = request.params.userId;
  console.log('getting active courses by user id', userId)
  try {
    pool.query(
      "select course_id, course_code, course_name, term from enrol e join courses c on e.course=c.course_id where c.term='22T1' and e.userid=$1",
      [userId],
      (error, results) => {
        if (error) {
          response.status(400).json(error);
          console.log(error);
        } else if (results.rows.length === 0) {
          console.log('No courses found')
          response.status(404).send("No courses found");
        } else {
          console.log(results.rows)
          response.status(200).json(results.rows);
        }
      })
  } catch (error) {
    response.status(500).json(error.message);
  }
}

/* ================================ lectures ================================*/
// get all lectures data in a course
const getLecturesByCourse = (request, response) => {
  const course_code = request.params.courseCode.toUpperCase();
  const term = request.params.term;

  console.log('getting lecture by code and term: ', course_code, term)

  try{
    pool.query('SELECT l.id, l.course, l.week, l.title, l.video FROM courses c JOIN lectures l on c.course_id=l.course WHERE c.course_code=$1 and c.term=$2', 
    [course_code, term],
    (error, results) => {
      if (error) {
        response.status(400).json(error);
      } else if (results.rows.length === 0) {
        response.status(404).send("Incorrect course code/term or no lectures found"); 
      } else {
        response.status(200).json(results.rows);
      }
    })
  } catch(error){
    response.status(500).json(error.message);
  }
}

// get lecture data by id
const getLectureById = (request, response) => {
  const id = request.params.id;

  console.log("Getting lecture by lecture id", id);

  try {
    pool.query('SELECT * FROM lectures WHERE id=$1', 
    [id],
    (error, results) => {
      if (error) {
        response.status(400).json(error);
      } else if (results.rows.length === 0) {
        response.status(404).send("No lecture found"); 
      } else {
        response.status(200).json(results.rows[0]);
      }
    })
  } catch (error) {
    response.status(500).json(error.message);
  }
  
}

/* ================================ notes ================================*/

// get lecture node by lecture id and user id
const getNoteByLectureId = (request, response) => {
  const lecture = request.params.id;
  const userId = request.params.userId;
  console.log("Getting note from lecture", lecture, "from db.")

  try {
    pool.query('SELECT delta, last_update, is_public from notes_lecture_author WHERE user_id=$1 and lecture_id=$2', 
    [userId, lecture],
    (error, results) => {
      if (error) {
        response.status(400).json(error);
      } else if (results.rows.length === 0) {
        console.log("Ge found");
        response.status(201).send("No notes found"); 
      } else {
        console.log("Getting notes with content: ", results.rows[0])
        response.status(200).json(results.rows[0]);
      }
    })
  } catch (error) {
    response.status(500).json(error.message);
  }
}

// get lecture node by lecture id and user id
const getPublicNotesByCourseCodeTerm = (request, response) => {
  const code = request.params.courseCode;
  const term = request.params.term;

  console.log("Getting all public notes of course", code, term, "from db.")

  try {
    pool.query(
      "select c.course_id, c.course_name, c.course_code, c.term, l.id as lecture_id, l.week as lecture_week, l.title as lecture_title, n.user_id, n.user_name, n.delta, n.last_update, n.is_public from courses c join lectures l on c.course_id = l.course join notes_lecture_author n on l.id = n.lecture_id where is_public = true and course_code=$1 and term=$2",
      [code, term],
      (error, results) => {
        if (error) {
          console.log(error)
          response.status(400).json(error);
        } else {
          console.log(results.rows)
          console.log("==============Success!=============")
          response.status(200).json(results.rows);
        }
      })
  } catch (error) {
    response.status(500).json(error.message);
  }
}

// save notes into database
const postNote = (request, response) => {
  const createNewQuery = "INSERT INTO notes (author, lecture, delta, is_public) VALUES ($1, $2, $3, $4)";
  const updateQuery = "UPDATE notes SET delta=$3, last_update=NOW(), is_public=$4 WHERE author=$1 and lecture=$2";

  console.log('Posting notes: ', request.body)

  try {
    pool.query(request.body.newNote ? createNewQuery : updateQuery, 
    [request.body.user_id, request.body.lecture_id, request.body.delta, request.body.is_public],
    (error, results) => {
      if (error) {
        console.log("ERROR saving notes: ", error);
        response.status(400).json(error);
      } else {
        console.log("content saved: ", request.body.delta)
        response.status(200).send("Content saved!");
      }
    })
  } catch (error) {
    response.status(500).json(error.message);
  }
}

// get all notes to a specific course and user
const getNotesByCourseId = (request, response) => {
  const courseId = request.params.courseId;
  const userId = request.params.userId;

  console.log("Getting all notes of course", courseId, "from db.")

  try {
    pool.query(`
    select n.user_id, l.course as course_id, l.id as lecture_id, l.week, l.title, n.delta, n.last_update, n.is_public
from 
(
	select *
	from notes_lecture_author
	where user_id=$2
) n right join 
( 
 	select * FROM lectures
 	where course=$1
) l on n.lecture_id=l.id`, 
    [courseId, userId],
    (error, results) => {
      if (error) {
        console.log(error)
        response.status(400).json(error);
      } else {
        response.status(200).json(results.rows);
      }
    })
  } catch (error) {
    response.status(500).json(error.message);
  }
}

// get nodes by user id and keyword
const getNotesByKeyword = (request, response) => {
  const userId = request.params.userId;
  const keyword = request.params.keyword;
  const query = `SELECT c.course_id, c.course_name as course_name, c.course_code, c.term, l.id as lecture_id, l.week as lecture_week, l.title as lecture_title, l.video as lecture_video, n.id as notes_id, n.delta, n.is_public FROM notes n LEFT JOIN lectures l on n.lecture=l.id LEFT JOIN courses c on l.course=c.course_id WHERE author=${userId} and delta like '%"concept":"${keyword}"%' or delta like '%/concept/${keyword}%'`

  console.log("getting all notes with keyword ", keyword, ' with user ', userId);

  try {
    pool.query(query, 
    (error, results) => {
      if (error) {
        console.log(error)
        response.status(400).json(error);
      } else {
        console.log(results.rows)
        response.status(200).json(results.rows);
      }
    })
  } catch (error) {
    response.status(500).json(error.message);
  }
}

// get all notes by user id 
const getNotesByUser = (request, response) => {
  const userId = request.params.userId;
  const query = `SELECT c.course_id, c.course_name as course_name, c.course_code, c.term, l.id as lecture_id, l.week as lecture_week, l.title as lecture_title, n.id as notes_id, n.delta, n.last_update, n.is_public FROM notes n LEFT JOIN lectures l on n.lecture=l.id LEFT JOIN courses c on l.course=c.course_id WHERE author=${userId}`;
  
  console.log("getting all notes by user ", userId);

  try {
    pool.query(query, 
    (error, results) => {
      if (error) {
        console.log(error)
        response.status(400).json(error);
      } else {
        console.log(results.rows)
        response.status(200).json(results.rows);
      }
    })
  } catch (error) {
    response.status(500).json(error.message);s
  }
}


const getPublicNotesByCourseId = (request, response) => {
  const courseIds = request.params.courseIds;
  const courseList = courseIds.split(',');
  let query = "select c.course_id, c.course_name, c.course_code, c.term, l.id as lecture_id, l.week as lecture_week, l.title as lecture_title, n.user_id, n.user_name, n.delta, n.last_update, n.is_public from courses c join lectures l on c.course_id = l.course join notes_lecture_author n on l.id = n.lecture_id where is_public = true"
  if (courseList.length > 0){
    query += ' and ('
    courseList.forEach((course, idx) => {
      query += `course_id = ${course}`
      // if note the last course
      idx !== courseList.length - 1 
        ? query += ' or ' 
        : query += ')'
    });
  }
  console.log("Getting all public notes of course", courseIds, "from db.")
  try {
    pool.query(query,
      (error, results) => {
        if (error) {
          console.log(error)
          response.status(400).json(error);
        } else {
          console.log(results.rows)
          console.log("==============Success!=============")
          response.status(200).json(results.rows);
        }
      })
  } catch (error) {
    response.status(500).json(error.message);
  }
}

// get all public notes by user id 
const getPublicNotesByUser = (request, response) => {
  const userId = request.params.userId;
  const query = `SELECT c.course_id, c.course_name as course_name, c.course_code, c.term, l.id as lecture_id, l.week as lecture_week, l.title as lecture_title, n.id as notes_id, n.delta, n.last_update, n.is_public FROM notes n LEFT JOIN lectures l on n.lecture=l.id LEFT JOIN courses c on l.course=c.course_id WHERE author=${userId} and is_public=true`;

  console.log("getting all public notes by user ", userId);

  try {
    pool.query(query,
      (error, results) => {
        if (error) {
          console.log(error)
          response.status(400).json(error);
        } else {
          console.log(results.rows)
          response.status(200).json(results.rows);
        }
      })
  } catch (error) {
    response.status(500).json(error.message); s
  }
}

module.exports = {
  getUser,
  getUserName,
  getCoursesByEmail,
  getTeachesByStaffId,
  getCourseByCode,
  getTeachesByCode,
  getCourseByCodeTerm,
  getActiveCoursesByUserId,
  getLecturesByCourse,
  getLectureById,
  getNoteByLectureId,
  postNote,
  getNotesByCourseId,
  getNotesByKeyword,
  getNotesByUser,
  getPublicNotesByCourseId,
  getPublicNotesByCourseCodeTerm,
  getPublicNotesByUser,

}