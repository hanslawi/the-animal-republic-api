const mongoose = require("mongoose");

const shippingFeeSchema = new mongoose.Schema({
  firstItem: {
    type: Number,
    required: true,
  },
  additionalItem: {
    type: Number,
    required: true,
  },
  shippingClass: { type: mongoose.Schema.ObjectId, ref: "ShippingClass" },
  country: { type: mongoose.Schema.ObjectId, ref: "Country" },
});

const ShippingFee = mongoose.model("ShippingFee", shippingFeeSchema);

module.exports = ShippingFee;
