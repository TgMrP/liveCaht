require("dotenv").config();

const http = require("http");
const express = require("express");
const sio = require("socket.io");

/** Security */
const helmet = require("./middleware/helmet");
const cors = require("./middleware/cors");

/** Logs */
const morgan = require("morgan");

/** DB CONNECT */
// const dbConnect = require("./config/db");

/** Session */
// const session = require("./middleware/session")(dbConnect);

/** Config */
const config = require("./config");
// const passport = require("./config/passport");

const app = express();
const server = http.Server(app);
const io = sio(server, {
  cors: {
    origin: "http://192.168.1.113:3000",
  },
});

/** Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet);
app.use(cors);
// app.use(session);
// app.use(passport.initialize());
// app.use(passport.session());

const messages = [];
const users = [];

io.use((socket, next) => {
  session(socket.request, socket.request.res, next);
});

const updateConnections = () => {
  io.emit("connections", io.engine.clientsCount);
};

io.on("connection", (socket) => {
  console.log(`A user connected with ID: ${socket.id}`);
  updateConnections();
  socket.on("disconnect", () => {
    updateConnections();
    console.log(`A user disconnected with ${socket.id}`);
  });

  socket.on("chat-message", async (message) => {
    const data = {
      message: message.message,
      user_id: socket.id,
      name: message.user,
    };
    messages.push(data);
    socket.broadcast.emit("chat-message", message);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  socket.on("stopTyping", () => {
    socket.broadcast.emit("stopTyping");
  });

  socket.on("joined", async (name) => {
    let messageData = null;
    const data = {
      name,
      user_id: socket.id,
    };
    users.push(data);
    socket.broadcast.emit("joined", messageData);
  });

  socket.on("leave", (data) => {
    socket.broadcast.emit("leave", data);
  });
});

app.all("/", (req, res) => res.json({ hello: "world" }));

server.listen(config.server.port, config.server.host);
console.log("listen on port " + config.server.port);
