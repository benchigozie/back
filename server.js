const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app); 

const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//importing routes

const userRoute = require('./routes/user');
const cardRoute = require('./routes/card');




app.use('/api/user', userRoute);
app.use('/api/card', cardRoute);
app.use(express.json());


let io;


const connectedUsers = new Map();

io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (change this in production)
    },
});

io.on("connection", (socket) => {
    console.log("New WebSocket Connection:", socket.id);

    // When a user connects, store them
    const userEmail = socket.handshake.query.userEmail;
    if (userEmail) {
        connectedUsers.set(userEmail, socket);
        console.log(`User connected: ${userEmail}`);
    }

    // Handle user disconnection
    socket.on("disconnect", () => {
        connectedUsers.forEach((value, key) => {
            if (value === socket) {
                connectedUsers.delete(key);
                console.log(`User disconnected: ${key}`);
            }
        });
    });
});


// Function to force logout a user
const forceLogoutUser = (userEmail) => {
    const userSocket = connectedUsers.get(userEmail);
    if (userSocket) {
        userSocket.emit("forceLogout"); // Send logout event to client
        userSocket.disconnect();
        connectedUsers.delete(userEmail);
        console.log(`User ${userEmail} has been logged out.`);
    }
};

module.exports = { server, io, forceLogoutUser }; 

server.listen(3000, () => {
    console.log('now listening')
})