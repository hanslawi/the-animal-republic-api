const mongoose = require("mongoose");

const productVariantSchema = mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  attributes: { type: [{ name: String, value: String }], required: true },
  regularPrice: { type: Number, min: 0 },
  salePrice: { type: Number, min: 0 },
  SKU: String,
  images: [{ type: { altText: String, fileURL: String } }],
});

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);

module.exports = ProductVariant;
