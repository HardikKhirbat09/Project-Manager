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
const corsOptions = {
    origin: function(origin, callback) {
        const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


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

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }

    // Handle MongoDB validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(', ');
    }

    res.status(statusCode).json({
        statusCode,
        message,
        data: null
    });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1); 
});
