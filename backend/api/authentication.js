const jwt = require("jsonwebtoken");
const pool = require("../db/database");
var fs = require("fs");

const JWT_SECRET = "metalms";

/***************************************************************
                       Auth Functions
***************************************************************/

async function getZIdFromAuthorization(auth) {
  try {
    const token = auth.replace("Bearer ", "");
    const zId = jwt.verify(token, JWT_SECRET).zid;

    resp = await pool.query(
      `SELECT zId, email, password FROM users
      where zId = '${zId}'`
    );
    if (resp.rows.length === 0) {
      throw "Invalid Token";
    }

    return zId;
  } catch (e) {
    console.error(e);
  }
}

async function login(request, response) {
  let email = request.body.email;
  let password = request.body.password;
  try {
    resp = await pool.query(
      `SELECT id, zId, email, password, staff FROM users
      where email = '${email}'`
    );
    //If no matching email
    if (resp.rows.length != 1) {
      response.status(400).send("Incorrect Login Details");
      throw "Incorrect Login Details";
    }
    //If password incorrect
    if (password !== resp.rows[0].password) {
      response.status(400).send("Incorrect Login Details");
      throw "Incorrect Login Details";
    }

    //Do login
    let zid = resp.rows[0].zid;
    let token = jwt.sign({ zid }, JWT_SECRET, { algorithm: "HS256" });

    let staff = resp.rows[0].staff;
    let id = resp.rows[0].id;
    response.status(200).send({ token: token, staff: staff, id: id });
  } catch (e) {
    console.error(e);
  }
}

async function register(request, response) {
  let name = request.body.name;
  let email = request.body.email;
  let zid = request.body.zid;
  let password = request.body.password;
  let staffBool = request.body.staff;

  try {
    resp = await pool.query(
      `SELECT zId, email, password FROM users
      where email = '${email}'`
    );
    //If an existing email
    if (resp.rows.length > 0) {
      response.status(400).send("An account already exists with this email");
      throw "an account already exists with this email";
    }

    resp = await pool.query(
      `SELECT zId, email, password FROM users
      where zId = '${zid}'`
    );
    //If an existing zid
    if (resp.rows.length > 0) {
      response.status(400).send("An account already exists with this zId");
      throw "an account already exists with this zId";
    }

    let staff = staffBool === "1" ? true : false;

    resp = await pool.query(
      `INSERT INTO users VALUES(default, $1, $2, $3, $4, $5)`,
      [name, email, password, zid, staff]
    );

    resp = await pool.query(
      `SELECT id, zId, email, password, staff FROM users
      where email = '${email}'`
    );

    const id = resp.rows[0].id;

    //Do login
    let token = jwt.sign({ zid }, JWT_SECRET, { algorithm: "HS256" });
    response.status(200).send({ token: token, staff: staff, id: id });
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  login,
  register,
  getZIdFromAuthorization
}