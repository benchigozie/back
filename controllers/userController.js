const pool = require("../db/pool");

const queries = require("../db/queries")

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');



const getAllUsers = (req, res) => {
    
    pool.query(queries.getAllUsersQuery, (error, results) => {
        //if (error) throw error;

        allUsers = results.rows.filter(user => user.role !== "master");

        res.status(200).json(allUsers);
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

            if (req.body.email === "benmarrk@gmail.com") {

                try {
                    pool.query(`INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5);`, [req.body.name, req.body.email, hashedPassword, "master", "active"]);
                    res.status(200).json({ success: "successfully registered user" });
                } catch (error) {
                    res.status(500).json({ error: "unable to add user to the database" });
                }
            
            } else {
                try {
                    pool.query(`INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5);`, [req.body.name, req.body.email, hashedPassword, "staff", "active"]);
                    res.status(200).json({ success: "successfully registered user" });
                } catch (error) {
                    res.status(500).json({ error: "unable to add user to the database" });
                }
            }
           

        }

    } catch (error) {
        res.status(500).json({ error: "unable to complete registration" });
    }

};

const authenticateUser = async (req, res) => {
   
    const existingUsers = await pool.query("SELECT * FROM users WHERE email = $1", [req.body.email]);
    if (existingUsers.rows[0].status == "inactive") {
        return res.status(400).json({ error: 'user is disabled' });
    }

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
        await pool.query("UPDATE users SET status = 'active' WHERE email = $1;", [req.body.email]);
        await pool.query("UPDATE cards SET status = 'active' WHERE email = $1;", [req.body.email]);

        res.status(200).json({ message: 'User enabled successfully' });
    } catch (error) {
        console.error("Enable user error:", error);
        res.status(500).json({ error: "Unable to enable user" });
    }
   
};

const disableUser = async (req, res) => {
   
    try {
        await pool.query("UPDATE users SET status = 'inactive' WHERE email = $1;", [req.body.email]);
        await pool.query("UPDATE cards SET status = 'inactive' WHERE email = $1;", [req.body.email]);

        const { forceLogoutUser } = require("../server");
        forceLogoutUser(req.body.email); // Called after successful updates

        res.status(200).json({ message: 'User disabled successfully' });
    } catch (error) {
        console.error("Disable user error:", error);
        res.status(500).json({ error: "Unable to disable user" });
    }
};

const deleteUser = async (req, res) => {
    try {
        await pool.query("DELETE FROM cards WHERE email = $1;", [req.body.email]);
        await pool.query("DELETE FROM users WHERE email = $1;", [req.body.email]);
        

        const { forceLogoutUser } = require("../server");
        forceLogoutUser(req.body.email); // Called after deletion

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ error: "Unable to delete user" });
    }
};

const promoteUser = async (req, res) => {
    
    try {
        await pool.query("UPDATE users SET role = 'admin' WHERE email = $1;", [req.body.email]);

        res.status(200).json({ message: 'User enabled successfully' });
    } catch (error) {
        console.error("Enable user error:", error);
        res.status(500).json({ error: "Unable to promote user" });
    }
   
};

const demoteUser = async (req, res) => {
    
    try {
        await pool.query("UPDATE users SET role = 'staff' WHERE email = $1;", [req.body.email]);

        res.status(200).json({ message: 'User enabled successfully' });
    } catch (error) {
        console.error("Enable user error:", error);
        res.status(500).json({ error: "Unable to demote user" });
    }
   
};

module.exports = {
    getAllUsers,
    registerUser,
    authenticateUser,
    enableUser,
    disableUser,
    deleteUser,
    promoteUser,
    demoteUser,

}

