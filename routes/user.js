const userRouter = require('express').Router();

const { getAllUsers, registerUser, authenticateUser, enableUser, disableUser, deleteUser, promoteUser, demoteUser } = require('../controllers/userController');

//const { authenticateToken } = require('../middleware/authenticatemiddleware');


userRouter.get('/all', getAllUsers);
userRouter.post('/register', registerUser);
userRouter.post('/login', authenticateUser);
userRouter.put('/enable', enableUser);
userRouter.put('/disable', disableUser);
userRouter.put('/delete', deleteUser);
userRouter.put('/promote', promoteUser); 
userRouter.put('/demote', demoteUser); 

module.exports = userRouter;