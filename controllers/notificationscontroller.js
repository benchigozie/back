const { query } = require("express");
const pool = require("../db/pool");

const queries = require("../db/queries")

const getAllNotifications = (req, res) => {
    console.log("all notifications");

    pool.query(queries.getAllNotificationsQuery, (error, results) => {
        console.log(results.rows);

        if (error) throw error;

        const notifications = results.rows;
        console.log(notifications);
        res.status(200).json(notifications);
    });
};




const storeNotifications = async (req, res) => {
    console.log("store notification");
    console.log(req.body);
    try {
        await pool.query(`INSERT INTO notifications (name, type, time) VALUES ($1, $2, $3);`, [req.body.name, req.body.type, req.body.time]);
        res.status(200).json({ success: "successfully registered Card" });
    } catch (error) {
        res.status(500).json({ error: "unable to store notification" });
    };
    
};





module.exports = {
    getAllNotifications,
    storeNotifications,
}

