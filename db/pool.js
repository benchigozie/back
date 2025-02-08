const { Pool } = require("pg");

const dotenv = require("dotenv");
const path = require("path");


if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.local" });
}

/*console.log(process.env.NODE_ENV);
const envFile = process.env.NODE_ENV === "production" ? "env.production" : "env.local";
console.log(envFile);

const envPath = path.resolve(__dirname, `../${envFile}`);

console.log("Loading environment from:", envPath);
// Load environment variables
dotenv.config({ path: path.resolve(__dirname, `../${envFile}`) });

// Debugging: Check if variables are loaded
*/

const newPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  pool_mode: process.env.NODE_ENV === "production" ? "transaction" : null,
});


module.exports = newPool;