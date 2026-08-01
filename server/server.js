const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");

const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.json());
const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
  res.send("server is running");
});

const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const messageRoutes = require("./routes/messages.js");
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const onlineUsers = new Map(); // userId -> socketId

socket.on('user-connected', (userId) => {
  onlineUsers.set(userId, socket.id);
  io.emit('user-online', userId); // sabko batao ye user online hai
});

socket.on('disconnect', () => {
  let disconnectedUserId = null;
  
  for (const [userId, sId] of onlineUsers) {
    if (sId === socket.id) {
      disconnectedUserId = userId;
      break;
    }
  }

  if (disconnectedUserId) {
    onlineUsers.delete(disconnectedUserId);
    io.emit('user-offline', disconnectedUserId);
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("message_send", async (data) => {
    try {
      console.log("Message received:", data);
      const newMessage = await Message.create({
        sender: data.sender,
        receiver: data.receiver,
        text: data.text,
      });
      socket.broadcast.emit("reply", data);
    } catch (err) {
      console.log("Error saving message:", err.message);
    }
  });
});

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
