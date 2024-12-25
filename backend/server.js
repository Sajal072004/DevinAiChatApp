import http from 'http'
import app from './app.js'
import {Server} from 'socket.io';

import 'dotenv/config.js';


const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server);
io.on('connection', socket => {
  socket.on('event', data => { /* … */ });
  socket.on('disconnect', () => { /* … */ });
});



server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});