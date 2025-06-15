const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerEmailAddress: {
    type: String,
  },
  customerCountry: {
    type: String,
  },
  customerFirstName: {
    type: String,
  },
  customerLastName: {
    type: String,
  },
  customerAddressLine1: {
    type: String,
  },
  customerAddressLine2: {
    type: String,
  },
  customerCity: {
    type: String,
  },
  customerState: {
    type: String,
  },
  customerZipCode: {
    type: String,
  },
  customerPhone: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  items: {
    type: [
      {
        product: { type: mongoose.Schema.ObjectId, ref: "Product" },
        productVariant: {
          type: mongoose.Schema.ObjectId,
          ref: "ProductVariant",
        },

        quantity: { type: Number },
      },
    ],
  },
  itemsSubtotal: { type: Number },
  shippingAmount: {
    type: Number,
  },
  vatAmount: {
    type: Number,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending payment", "Processing", "Completed"],
    default: "Pending payment",
  },
  referral: { type: mongoose.Schema.ObjectId, ref: "Referral" },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
