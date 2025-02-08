const { Pool } = require("pg");

const dotenv = require("dotenv");



if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.local" });
}


const newPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  pool_mode: process.env.NODE_ENV === "production" ? "transaction" : null,
});


module.exports = newPool;