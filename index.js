const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//New imports
const http = require("http").Server(app);
const cors = require("cors");

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "https://board.lignin.today",
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
