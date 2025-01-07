const pool = require("../db/pool");

const queries = require("../db/queries")

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const getAllUsers = (req, res) => {
    pool.query(queries.getAllUsersQuery, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
};


const registerUser = async (req, res) => {



    try {
        const existingUsers = await pool.query("SELECT * FROM users WHERE email = $1", [req.body.email]);

        if (existingUsers.rows.length > 0) {
            res.status(409).json({ error: "user already exists" });
        }
        else {

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            try {
                pool.query(`INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5);`, [req.body.name, req.body.email, hashedPassword, "staff", "active"]);
                res.status(200).json({ success: "successfully registered user" });
            } catch (error) {
                res.status(500).json({ error: "unable to add user to the database" });
            }

        }

    } catch (error) {
        res.status(500).json({ error: "unable to complete registration" });
    }

};

const authenticateUser = async (req, res) => {
    const existingUsers = await pool.query("SELECT * FROM users WHERE email = $1", [req.body.email]);
    if (existingUsers.rows.length < 1) {
        console.log('not found user');
        return res.status(400).json({ error: 'user not found' })
    }
    //const validPass = await bcrypt.compare(req.body.password, existingUsers.rows[0].password);
    //console.log(validPass)
    {
        {
            try {
                if (await bcrypt.compare(req.body.password, existingUsers.rows[0].password)) {


                    const usersName = existingUsers.rows[0].name
                    const userEmail = existingUsers.rows[0].email
                    const userRole = existingUsers.rows[0].role
                    const userStatus = existingUsers.rows[0].status
                    const user = {
                        name: usersName,
                        email: userEmail,
                        role: userRole,
                        status: userStatus,
                    };
                    console.log(user);
                    console.log('user verified')
    
                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                    res.json({
                        user,
                        accessToken
                    });
                    console.log('responded');
                    console.log(accessToken)
    
    
                }
                else {
                    console.log('wrong password')
                    res.status(401).json({ error: 'invalid password, check credentials' });
                }
            } catch (error) {
                res.status(500).json({ error: "server error" });
            }
            

            
        }
    }






};

module.exports = {
    getAllUsers,
    registerUser,
    authenticateUser,
}

