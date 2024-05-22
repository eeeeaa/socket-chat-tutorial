const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

//stands in for database
let users = [];

let rooms = [
  { id: `0665`, name: "test1", messages: [] },
  { id: `1442`, name: "test2", messages: [] },
];

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

  socket.on("get rooms", () => {
    io.emit("getRoomsResponse", rooms);
  });

  socket.on("join room", (data) => {
    socket.join(data.roomid);
  });

  socket.on("message", (data) => {
    console.log(data);
    for (const room of rooms) {
      if (room.id === data.roomid) {
        room.messages.push(data);
      }
    }
    io.to(data.roomid).emit("messageResponse", rooms);
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
