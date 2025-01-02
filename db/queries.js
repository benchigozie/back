const pool = require("./pool");

async function getAllUsers(req, res) {
  const { rows } = await pool.query("SELECT * FROM users");
  console.log(rows);
  return rows;
}

async function insertIntoUser(email) {
  await pool.query("INSERT INTO users (username) VALUES ($1)", [username]);
}

module.exports = {
  getAllUsers,
  insertIntoUser,
};
