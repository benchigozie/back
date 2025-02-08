const { query } = require("express");
const pool = require("../db/pool");

const queries = require("../db/queries")

const getAllCards = (req, res) => {
    console.log("cards")
    pool.query(queries.getAllCardsQuery, (error, results) => {
        //if (error) throw error;

        const activeCards = results.rows
            .filter(card => card.status === 'active') // Filter active cards
            .map(card => card.uid)
            ;
        res.status(200).json(activeCards);
    });
};

const getUsersCards = (req, res) => {
    //console.log(req.query);
    pool.query("SELECT * FROM cards WHERE email = $1;",[req.body.email], (error, results) => {
        //if (error) throw error;

        const usersCards = results.rows
        res.status(200).json(usersCards);
    });
    console.log("mycards");
};


const registerCard = async (req, res) => {

    try {
        await pool.query(`INSERT INTO cards (name, uid, email, status) VALUES ($1, $2, $3, $4);`, [req.body.name, req.body.uid, req.body.email, "active"]);
        res.status(200).json({ success: "successfully registered Card" });
    } catch (error) {
        res.status(500).json({ error: "unable to add Card to the database" });
    };

};



const enableCard = async (req, res) => {

    try {
        await pool.query("UPDATE cards SET status = 'active' WHERE email = $1 AND name = $2;", [req.body.email, req.body.name])
    } finally {
        res.status(200).json({ message: 'success' })
    }
    console.log("enable card");

};

const disableCard = async (req, res) => {

    try {
        await pool.query("UPDATE cards SET status = 'inactive' WHERE email = $1 AND name = $2;", [req.body.email, req.body.name])
    } finally {
        res.status(200).json({ message: 'success' })
    }

};

const deleteCard = async (req, res) => {

    try {
        await pool.query("DELETE FROM cards WHERE email = $1 AND name = $2;", [req.body.email, req.body.name])
    } finally {

        res.status(200).json({ message: 'success' })
    }
};


module.exports = {
    getAllCards,
    getUsersCards,
    registerCard,
    enableCard,
    disableCard,
    deleteCard,

}

