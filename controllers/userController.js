const pool = require("../db/pool");
const queries = require('../db/queries');


const getAllUsers = (req, res) => {
    pool.query(queries.getAllUsersQuery, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};



module.exports = {
    getAllUsers,
}

