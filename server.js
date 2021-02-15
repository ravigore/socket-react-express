const express = require("express");
const path = require("path");
var cors = require("cors");

const bodyParser = require("body-parser");
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = require("http").createServer(app);
const io = require("socket.io")(server);
let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => PushRaceData(socket), 4000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const PushRaceData = (socket) => {
  getHorsesData();
  socket.emit("start", horseStart);
  setTimeout(() => {
    socket.emit("finish", horseFinish);
  }, 5000);
};
server.listen(port, () => console.log(`Listening on port ${port}`));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

let horseStart = [];
let horseFinish = [];
const getHorsesData = () => {
  horseStart = [];
  horseFinish = [];
  for (let i = 0; i < 6; i++) {
    let horseid = Math.floor(Math.random() * 999);
    let horseFinishTime = Math.floor(Math.random() * 9999);
    horseStart.push({
      event: "start",
      id: horseid,
      name: "Horse" + i,
    });
    horseFinish.push({
      event: "finish",
      id: horseid,
      name: "Horse" + i,
      time: horseFinishTime,
    });
  }
  return "";
};
