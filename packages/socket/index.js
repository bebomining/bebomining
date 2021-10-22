const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const isDev = process.env.NODE_ENV !== "production";

const certBasePath = path.join(__dirname, "cert");

const options = isDev
  ? {}
  : {
      key: fs.readFileSync(`${certBasePath}/private.key`),
      cert: fs.readFileSync(`${certBasePath}/www.bebomining.com.crt`),
      ca: fs.readFileSync(`${certBasePath}/www.bebomining.com.ca-bundle`)
    };

const server = isDev
  ? require("http").createServer(options, app)
  : require("https").createServer(options, app);

const PORT = process.env.PORT || 8000;
const origin =
  process.env.NODE_ENV === "production" ? "https://bebomining.github.io" : "*";
const credentials = process.env.NODE_ENV === "production" ? true : false;

console.log("origin => ", origin);

const io = require("socket.io")(server, {
  cors: {
    origin,
    methods: ["GET", "POST"],
    credentials
  }
});

app.get("/ping", (req, res) => {
  res.send("<h1>Hello BeBo</h1>");
});

const rooms = {};
const users = {};
io.on("connection", socket => {
  console.log("a user connected ", socket.id);
  users[socket.id] = socket;

  socket.on("join-room", ({ roomId }) => {
    console.log("join-room =>", roomId, " - ", socket.id);
    if (rooms[roomId] !== undefined) {
      socket.join(roomId);
      socket.to(roomId).emit("offer-request", { asker: socket.id, roomId });
    } else {
      socket.emit("join-room-error", { roomId });
    }
  });

  socket.on("offer", ({ roomId, offer, to }) => {
    console.log("offer =>", roomId, " - ", to);
    socket.to(to).emit("offer-received", { sender: socket.id, roomId, offer });
  });

  socket.on("answer", ({ roomId, answer, to }) => {
    console.log("answer =>", roomId, " - ", to);
    socket.to(to).emit("answer", { sender: socket.id, roomId, answer });
  });

  socket.on("create-room", ({ roomId }) => {
    rooms[roomId] = roomId;
    console.log("create-room =>", roomId, " - ", rooms);
    socket.join(roomId);
  });

  socket.on("leave-room", ({ roomId }) => {
    delete rooms[roomId];
    socket.leave(roomId);
  });

  socket.on("candidate", ({ candidate, roomId }) => {
    console.log("Emit candidate ", roomId, socket.id);
    socket.to(roomId).emit("candidate", { candidate, to: socket.id });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    console.log(Object.keys(users).length, io.sockets.adapter.rooms);
  });
});

server.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});

/* HTTP SERVER */

const webserver = express();
const httpWebServer = require("http").createServer(options, webserver);
const PORT_WEBSERVER = 80;

webserver.use("/.well-known", express.static(path.join(__dirname, "public")));

webserver.get("/ping", (req, res) => {
  res.send("<h1>Hello BeBo</h1>");
});
httpWebServer.listen(PORT_WEBSERVER, () => {
  console.log(`listening on *: ${PORT_WEBSERVER}`);
});
