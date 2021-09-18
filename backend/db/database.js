
const Pool = require('pg').Pool;

const pool = new Pool({
  host: "db.metalms.tech",
  port: 5432,
  user: "service",
  password: "metalms",
  database: "metalms",
  idleTimeoutMillis: 100,
  connectionTimeoutMillis: 1000,
})

module.exports = pool;