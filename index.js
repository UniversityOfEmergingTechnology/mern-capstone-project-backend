const express = require('express')
const cors = require('cors')
const socket =  require('socket.io')
require('dotenv').config()


const app = express()

// middleware
app.use(cors())
app.use(express.json())

// connecting with the database
const connect = require('./config/database')
connect()

const userRoutes = require('./routes/userRoutes')
app.use('/api/auth' , userRoutes)

const messageRoutes = require('./routes/messageRoutes')
app.use('/api/messages' , messageRoutes)

const server = app.listen(process.env.PORT , () => {
    console.log(`Server started succesfully on 4000`)
})

const io = socket(server, {
    cors: {
      origin: "https://mern-capstone-project-frontend.vercel.app/",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });