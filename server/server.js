const express = require("express");
const app = express();
const http = require("http");
const { Server } = require('socket.io');


const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.json());
const cors = require('cors');
app.use(cors());

app.get("/", (req, res) => {
  res.send("server is running");
});

const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
});

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
