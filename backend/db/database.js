const Pool = require("pg").Pool;

const pool = new Pool({
  host: "backend.edwudw.com",
  port: 5432,
  user: "metalms",
  password: "metalms",
  database: "metalms",
  idleTimeoutMillis: 100,
  connectionTimeoutMillis: 1000,
});

// const pool = new Pool({
//   host: "db.metalms.tech",
//   port: 50000,
//   user: "service",
//   password: "metalms",
//   database: "metalms",
//   idleTimeoutMillis: 100,
//   connectionTimeoutMillis: 1000,
// });

module.exports = pool;
