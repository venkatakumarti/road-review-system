const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "m2004",
  host: "localhost",
  port: 5432,
  database: "smartroads"
});

module.exports = pool;