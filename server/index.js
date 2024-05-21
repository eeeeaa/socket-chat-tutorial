const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

//stands in for database
let users = [];

const app = express();
const server = createServer(app);

const PORT = 4000;
const cors = require("cors");

app.use(cors());
const io = new Server(server, {
  allowEIO3: true,
  cors: { credentials: true, origin: "http://127.0.0.1:5173" },
});

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("newUser", (data) => {
    //new user logged in
    users.push(data);
    io.emit("newUserResponse", users);
  });

  socket.on("typing", (data) => {
    //send to everyone except the sender
    socket.broadcast.emit("typingResponse", data);
  });

  socket.on("message", (data) => {
    console.log(data);
    io.emit("messageResponse", { data, from: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    //Updates the list of users when a user disconnects from the server
    //filter out socket id of logged out user
    users = users.filter((user) => user.socketID !== socket.id);

    //Sends the list of users to the client
    io.emit("newUserResponse", users);
    socket.disconnect();
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

//connect and listen with http server instead of express app
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
