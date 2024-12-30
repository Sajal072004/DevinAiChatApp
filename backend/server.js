import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import "dotenv/config.js";
import jwt from 'jsonwebtoken'
import mongoose from "mongoose";
import projectModel from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";

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

io.use(async(socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];
      const projectId = socket.handshake.query.projectId;

      if(!mongoose.Types.ObjectId.isValid(projectId)){
        return next(new Error('Invalid projectId'));
      }

      socket.project = await projectModel.findById(projectId);

      


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

    socket.roomId = socket.project._id.toString();

    console.log("🔗 New client connected:", socket.id);
    console.log(socket.project._id.toString());

    socket.join(socket.roomId);

    socket.on('project-message', async data => {

      console.log("message sent" ,  data);
      const message = data.message;

      const aiIsPresentInMessage = message.includes('@jarvis');

      const jarvis = {'email': "Jarvis AI"};

      if(aiIsPresentInMessage) {

        const prompt = message.replace('@ai', '');
        const result =  JSON.parse(await generateResult(prompt));

        socket.broadcast.to(socket.roomId).emit('project-message' , data);

        io.to(socket.roomId).emit('project-message' , {
            message: result,
            sender: {
              _id: 'ai',
              email: 'Jarvis'
            }
        })
        
        return;
      }


      console.log("the room id is ", socket.roomId );
      socket.broadcast.to(socket.roomId).emit('project-message' , data);
    })

    socket.on('disconnect', () => {
      console.log('user disconnected');
      socket.leave(socket.roomId);
    });
    
  });

} catch (error) {
  console.log("error connection ", error);
}

// Start the server
serverApp.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
