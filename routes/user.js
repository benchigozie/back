const userRouter = require('express').Router();

const db = require('../db/queries');


userRouter.get('/all', async (req, res)  => {
    const users = await db.getAllUsers();
    console.log(users)

});


module.exports = userRouter;