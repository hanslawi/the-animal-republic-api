const mongoose = require("mongoose");

const productVariantSchema = mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  attributes: { type: [{ name: String, values: String }], required: true },
  regularPrice: { type: Number, min: 0, required: true },
  salePrice: { type: Number, min: 0, default: 0},
  SKU: { type: String, required: true },
  stockManagement: { type: Boolean, default: false},
  // if stockManagement is true
  quantity: { type: Number, min: 0, default: 0},
  // if stockManagement is false
  stockStatus: {
    type: String,
    enum: ["In stock", "Out of stock"],
    default: "In stock"
  },
  imagesURL: [String],
});

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);

module.exports = ProductVariant;
