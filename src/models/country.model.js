const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  states: {
    type: [
      {
        name: String,
        code: String,
      },
    ],
  },
});

const Country = mongoose.model("Country", countrySchema);

module.exports = Country;
