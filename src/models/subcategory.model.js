const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  slug: String
});

const SubCategory = mongoose.model("SubCategory", subcategorySchema);

module.exports = SubCategory;