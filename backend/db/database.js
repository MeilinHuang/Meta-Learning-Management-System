
const Pool = require('pg').Pool;

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "metalms",
  database: "metalms",
  idleTimeoutMillis: 100,
  connectionTimeoutMillis: 1000,
})

module.exports = pool;