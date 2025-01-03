const userRouter = require('express').Router();

const { getAllUsers } = require('../controllers/userController');
const db = require('../db/queries');


userRouter.get('/all', getAllUsers);


module.exports = userRouter;