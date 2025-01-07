const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//importing routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');


app.use('/api/user', userRoute);
app.use(express.json());
app.use(bodyParser.json())

app.listen(3000, () => {
    console.log('now listening')
})