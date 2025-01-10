const mongoose = require("mongoose");

const taxSchema = new mongoose.Schema({
  percentage: {
    type: Number,
    required: true,
  },
});

const Tax = mongoose.model("Tax", taxSchema);

module.exports = Tax;
