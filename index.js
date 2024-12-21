const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// config.env
dotenv.config({path: path.join(__dirname, 'config.env')})

// init express
const app = express();

// morgan middleware
app.use(morgan('dev'));

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Listening to ${port}`);
})