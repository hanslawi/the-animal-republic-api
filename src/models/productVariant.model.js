const mongoose = require("mongoose");

const productVariantSchema = mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  attributes: { type: [{ name: String, values: String }], required: true },
  regularPrice: { type: Number, min: 0, default: 0, required: true },
  salePrice: { type: Number, min: 0, default: 0, required: true },
  SKU: String,
  stockManagement: { type: Boolean, default: false, required: true },
  // if stockManagement is true
  quantity: { type: Number, min: 0, default: 0, required: true },
  // if stockManagement is false
  stockStatus: {
    type: String,
    enum: ["In stock", "Out of stock"],
    default: "In stock",
    required: true,
  },
  imagesURL: [String],
});

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);

module.exports = ProductVariant;
