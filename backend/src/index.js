import dotenv from 'dotenv';
import express, { json } from 'express';
import cors from 'cors';
import { connectDB } from './db/index.js';
import cookieParser from 'cookie-parser';

dotenv.config({
    path: './.env',
});

//const  PORT = process.env.PORT || 5000; process.env is an object that contains the env variables from env file

const app = express();
//basic configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(cookieParser());
//cors configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


import healthCheckRoutes from './routes/healthcheck.routes.js';
app.use('/api/v1/healthcheck', healthCheckRoutes);
import authRoutes from './routes/auth.routes.js';
app.use('/api/v1/auth', authRoutes);

import projectRoutes from './routes/project.routes.js';
app.use('/api/v1/projects', projectRoutes);

import taskRoutes from './routes/tasks.routes.js';
app.use('/api/v1/tasks', taskRoutes);

import notesRoutes from './routes/notes.routes.js';
app.use('/api/v1/notes', notesRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1); 
});
