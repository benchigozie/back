const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

//importing routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');


app.use('/api/user', userRoute);
app.use(express.json());

app.listen(3000, () => {
    console.log('now listening')
})