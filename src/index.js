import dotenv from 'dotenv';
import express from 'express';
dotenv.config({
    path: './.env',
});

//const  PORT = process.env.PORT || 5000; process.env is an object that contains the env variables from env file

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
