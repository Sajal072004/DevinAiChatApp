import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';

import userRoutes from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import projectRoutes from './routes/project.routes.js'
import aiRoutes from './routes/ai.routes.js'

// Connect to your database
connect();

const app = express();

// Enable CORS
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'], 
    credentials: true, 
  })
);

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Define routes
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('Hello World app server');
});

export default app;
