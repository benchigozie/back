const userRouter = require('express').Router();

const { getAllUsers, registerUser, authenticateUser } = require('../controllers/userController');
const db = require('../db/queries');
const { authenticateToken } = require('../middleware/authenticatemiddleware');


userRouter.get('/all', getAllUsers);
userRouter.post('/register', registerUser);
userRouter.post('/login', authenticateUser);

module.exports = userRouter;