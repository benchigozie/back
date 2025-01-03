

const getAllUsersQuery = "SELECT * FROM users";
  
//async function insertIntoUser(email) {
//  await pool.query("INSERT INTO users (username) VALUES ($1)", [username]);
//}

module.exports = {
  getAllUsersQuery,
  //insertIntoUser,
};
