import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import "dotenv/config.js";
import jwt from 'jsonwebtoken'

const PORT = process.env.PORT || 3000;
console.log("port ", PORT);
const serverApp = http.createServer(app);
console.log("serverApp ");

const io = new Server(serverApp, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  },
});

io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token,  process.env.JWT_SECRET);

    if(!decoded) {
      return new(new Error('Authentication Error'));
    }

    socket.user = decoded;
    next();

  } 
  
  catch (error) {
    next(error);
  }
});

try {
  io.on("connection", (socket) => {
    console.log("🔗 New client connected:", socket.id);

    // Listen for a custom event
    socket.on("event", (data) => {
      console.log("📩 Received event:", data);
      socket.emit("response", { message: "Event received!" });
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log(`❌ Client disconnected: ${socket.id}, Reason: ${reason}`);
    });
  });
} catch (error) {
  console.log("error connection ", error);
}

// Start the server
serverApp.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
