// import library
const express = require("express");

// import controller
const paymentController = require("../controllers/payment.controller");

const router = express.Router();

// STRIPE

router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook
);

// parse incoming json body
router.use(express.json());

router.post(
  "/stripe/create-checkout-session",
  paymentController.stripeCreateCheckoutSession
);

module.exports = router;
