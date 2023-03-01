const pool = require('../db/database');
var fs = require('fs');

/***************************************************************
                       Topic File Progress Functions
***************************************************************/

// Get details for topic file
async function getTopicFileById (request, response) {
  try {
    const fileId = request.params.fileId;

    const fileExist = await pool.query(
      `SELECT EXISTS(SELECT * FROM topic_files 
      WHERE id = $1)`, [fileId]);

    if (fileExist.rows[0].exists == false) throw (`Failed: Topic File with id '${fileId}' does not exist`);

    let resp = await pool.query(`SELECT * FROM topic_files WHERE id = $1`, [fileId]);

    response.status(200).json(resp.rows[0]);
  } catch (e) { 
    response.status(400).send(e);
  }
}

// Put topic file details
async function putTopicFileDueDate (request, response) {
  try {
    const fileId = request.params.fileId;
    const newDate = request.body.newDate;

    const fileExist = await pool.query(
      `SELECT EXISTS(SELECT * FROM topic_files 
      WHERE id = $1)`, [fileId]);

    if (fileExist.rows[0].exists == false) throw (`Failed: Topic File with id '${fileId}' does not exist`);

    await pool.query(`UPDATE topic_files SET due_date = $1 WHERE id = $2`, [newDate, fileId])

    response.status(200).json({success: true, fileId: fileId, newDate: newDate});
  } catch (e) {
    response.status(400).send(e);
  }
}

module.exports = {
  getTopicFileById,
  putTopicFileDueDate
};