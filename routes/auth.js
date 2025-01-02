const authRouter = require('express').Router();


authRouter.post('/login', (req, res)  => {
    res.send('logged in');
})


module.exports = authRouter;