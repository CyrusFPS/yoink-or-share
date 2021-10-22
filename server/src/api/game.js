const express = require('express');
const app = express();
const morgan = require('morgan');
const http = require('http');
const passport = require('passport');
const cookieSession = require('cookie-session');
const server = http.createServer(app);
const { Server } = require('socket.io');
const Room = require('../models/room');
const port = process.env.SOCKETPORT;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(cookieSession({ // Setup cookiesession on our app
  maxAge: 24 * 60 * 60 * 1000, // One day in MS
  keys: [process.env.COOKIE_KEY] // Cookie key found in .env file
})));

io.use(wrap(passport.initialize())); // Use passport and it's session functionality
io.use(wrap(passport.session()));

io.on('connect', (socket) => {
  let currentRoom = {}

  console.log(`New connection: ${socket.id}`);

  socket.on('room_join', async (room) => {
    currentRoom = room;
    socket.join(room._id);
    const correctRoom = await Room.findByIdAndUpdate(room._id, room);
    currentRoom = correctRoom._doc;
    io.to(currentRoom._id).emit("user_join", currentRoom);
  });

  socket.on("whitelist_change", async (room) => {
    currentRoom = room;
    const correctRoom = await Room.findByIdAndUpdate(room._id, room);
    currentRoom = correctRoom._doc;

    io.to(currentRoom._id).emit("whitelist_change", currentRoom);
  });

  socket.on('disconnect', async () => {
    const user = socket.request.user;

    const newUsers = currentRoom.users.filter(rUser => rUser !== `${user.username}#${user.discriminator}`);
    const newRoom = { ...currentRoom, users: newUsers };

    console.log(newRoom);

    const correctRoom = await Room.findByIdAndUpdate(currentRoom._id, newRoom);
    currentRoom = correctRoom._doc;

    io.to(currentRoom._id).emit("user_leave", currentRoom);

    console.log(`Client disconnect: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server listening on port ${port}`);
});

// const http = require('http');
// const WebSocketServer = require('websocket').server;
// const port = process.env.SOCKETPORT;
// const Room = require('../models/room');

// const server = http.createServer();
// server.listen(port, () => {
//   console.log(`WebSocket server listening on port ${port}`);
// });

// const wsServer = new WebSocketServer({
//   httpServer: server
// });

// wsServer.on('request', (request) => {
//   const connection = request.accept(null, request.origin);
//   let user = {};
//   let room = {};

//   connection.on('message', async (message) => {
//     const req = JSON.parse(message.utf8Data);

//     if (req.purpose === "open") {
//       room = req.data.room;
//       user = req.data.user;

//       room = await Room.findById(room._id);

//       if (!room.users.includes(`${user.username}#${user.discriminator}`)) {
//         room.users = [...room.users, `${user.username}#${user.discriminator}`];
      
//         const result = await Room.findByIdAndUpdate(room._id, room);
//       }
//     }

//     if (req.purpose === "whitelist_update") {
//       room = req.data.room;
//       user = req.data.user;

//       const oldRoom = await Room.findById(room._id);

//       if (oldRoom.owner === `${user.username}#${user.discriminator}`) {
//         const newRoom = await Room.findByIdAndUpdate(room._id, { whitelist: room.whitelist });

//         connection.sendUTF(JSON.stringify({ purpose: "whitelist_update", data: { user, room } }));
//       } else {
//         connection.sendUTF(JSON.stringify({ purpose: "whitelist_update", data: {} }));
//       }
//     }

//     if (req.purpose === "users_update") {
//       room = req.data.room;
//       user = req.data.user;

//       const oldRoom = await Room.findById(room._id);

//       room = await Room.findByIdAndUpdate(room._id, { users: [...oldRoom.users, `${user.username}#${user.discriminator}`] });

//       connection.sendUTF(JSON.stringify({ purpose: "users_update", data: { user, room } }));
//     }
//   });

//   connection.on('close', async (reasonCode, description) => {
//     if (user && room) {
//       const newUsers = room.users.filter((rUser) => rUser !== `${user.username}#${user.discriminator}`);
//       room.users = newUsers;

//       const newRoom = await Room.findByIdAndUpdate(room._id, room);

//       console.log(result);

//       connection.sendUTF(JSON.stringify({ purpose: "users_update", data: { user } }))
//     }

//     console.log("Client has disconnected");
//   });
// });