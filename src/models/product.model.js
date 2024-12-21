const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: mongoose.SchemaTypes.Mixed,
  imagesURL: [String],
  backgroundImageURL: String,
  tags: [String],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
