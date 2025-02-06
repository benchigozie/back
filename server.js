const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//importing routes

const userRoute = require('./routes/user');
const cardRoute = require('./routes/card');
const notificationsRoute = require('./routes/notifications');



app.use('/api/user', userRoute);
app.use('/api/card', cardRoute);
app.use('/api/notification', notificationsRoute);
app.use(express.json());
app.use(bodyParser.json())

app.listen(3000, () => {
    console.log('now listening')
})