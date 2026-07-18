const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const Message = require('./models/Message');


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


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message_send', async (data) => {
    console.log('Message received:', data);

    const newMessage = await Message.create({
      sender: data.sender,
      receiver: data.receiver,
      text: data.text
    });

    socket.broadcast.emit('reply', data);
  });
});


server.listen(PORT, () => console.log(`server running on port ${PORT}`));
