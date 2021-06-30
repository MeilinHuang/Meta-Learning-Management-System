
const pool = require('./db/database');

// TODO : ADD AUTH AND JWTOKEN

/***************************************************************
                       User Functions
***************************************************************/

const getUser = (request, response) => {
  const id = parseInt(request.params.userId)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) { throw error }
    response.status(200).json(results.rows);
  })
}

const putUserAdmin = (request, response) => {
  const id = parseInt(request.params.id);
  const { isAdmin } = request.body;

  pool.query(
    'UPDATE users SET isAdmin = $1 WHERE id = $2',
    [isAdmin, id],
    (error, results) => {
      if (error) { throw error }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) { throw error }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUser,
  putUserAdmin,
  deleteUser
};