const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// config.env
dotenv.config({path: path.join(__dirname, 'config.env')})

// init express
const app = express();

// connect to MongoDB
const db = process.env.MONGODB_LOCAL_CONNECTION;
mongoose.connect(db).then(() => {
    console.log(`Connected to ${db}`);
})

// morgan middleware
app.use(morgan('dev'));

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Listening to ${port}`);
})