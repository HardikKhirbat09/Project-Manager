import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/index.js';

dotenv.config({
    path: './.env',
});

//const  PORT = process.env.PORT || 5000; process.env is an object that contains the env variables from env file

const app = express();
//basic configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
//cors configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1); 
});
