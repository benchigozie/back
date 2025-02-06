

const getAllUsersQuery = "SELECT * FROM users;";
const addNewUserQuery = `INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5);`
const getAllCardsQuery = "SELECT * FROM cards";
const getAllNotificationsQuery = "SELECT * FROM notifications;";



module.exports = {
  getAllUsersQuery,
  getAllCardsQuery,
  getAllNotificationsQuery
  //insertIntoUser,
};
