// import libraries
const express = require('express');
const morgan = require("morgan");

// import router
const categoryRouter = require('./src/routes/category.routes');

// init express
const app = express();

// morgan middleware
app.use(morgan("dev"));

// routers
app.use('/api/categories', categoryRouter);

module.exports = app;