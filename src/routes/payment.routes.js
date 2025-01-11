// import library
const express = require("express");

// import controller
const paymentController = require("../controllers/payment.controller");

const router = express.Router();

// STRIPE
router.post(
  "/stripe/create-checkout-session",
  paymentController.stripeCreateCheckoutSession
);

module.exports = router;