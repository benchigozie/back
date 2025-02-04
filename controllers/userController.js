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
      
        return res.status(400).json({ error: 'user not found' });
    }
    
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
                    
    
                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                    res.json({
                        user,
                        accessToken
                    });
                    
    
    
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


const enableUser = async (req, res) => {
    
        try {
            await pool.query("UPDATE users SET status = 'active' WHERE email = $1;", [req.body.email])
        } finally {
            res.status(200).json({message: 'success'})
        }
   
};

const disableUser = async (req, res) => {
    
        try {
            await pool.query("UPDATE users SET status = 'inactive' WHERE email = $1;", [req.body.email])
        } finally {
            res.status(200).json({message: 'success'})
        }

};

const deleteUser = async (req, res) => {

    try {
        await pool.query("DELETE FROM users WHERE email = $1;", [req.body.email])
    } finally {
        
        res.status(200).json({message: 'success'})
    }
};


module.exports = {
    getAllUsers,
    registerUser,
    authenticateUser,
    enableUser,
    disableUser,
    deleteUser,

}

