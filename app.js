// import libraries
const express = require("express");
const morgan = require("morgan");

// import router
const categoryRouter = require("./src/routes/category.routes");

// init express
const app = express();

// parse incoming json body
app.use(express.json());

// morgan middleware
app.use(morgan("dev"));

// routers
app.use("/api/categories", categoryRouter);

// error-handling middleware
app.use((err, req, res, next) => {

  if (err.status)
    res.status(err.status).json({ status: "ERROR", message: err.message });
  else res.status(500).json({ status: "ERROR", message: err.message });
});

module.exports = app;
