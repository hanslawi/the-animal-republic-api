// import libraries
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");

// config.env
dotenv.config({ path: path.join(__dirname, "config.env") });

// import app
const app = require("./app");

// connect to MongoDB
const db = process.env.MONGODB_ATLAS_CONNECTION;
mongoose.connect(db).then(() => {
  console.log(`Connected to ${db}`);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening to ${port}`);
});
