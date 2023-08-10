const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//New imports
const http = require("http").Server(app);
const cors = require("cors");
const { log } = require("console");

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketIO.on("connect", (socket) => {
  // 접속한 클라이언트
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("moved", (data) => {
    console.log(data);
    socketIO.emit("point", data);
  });

  socket.on("title-changes", (data) => {
    console.log(data);
    socketIO.emit("data", data);
  });

  socket.on("image-changes", (data) => {
    // console.log("🗓️", data);
    socketIO.emit("images", data);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });

  // 유저 상태

  socket.on("status-in", (data) => {
    console.log("🚨🚨 들어온 status", data);
    socketIO.emit("status-in-data", data);
  });

  socket.on("status-out", (data) => {
    console.log("🎋🎋 나간 status", data);
    socketIO.emit("status-out-data", data);
  });
});

app.use(cors());

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
