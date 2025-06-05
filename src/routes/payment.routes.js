// import library
const express = require("express");

// import controller
const paymentController = require("../controllers/payment.controller");

const router = express.Router();

// parse incoming json body
router.use(express.json());

// PAYPAL

// createOrder route
router.post("/paypal/orders", async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } =
      await paymentController.createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

// captureOrder route
router.post("/paypal/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } =
      await paymentController.captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

// PayPal webhook

router.post("/paypal/webhook", paymentController.paypalWebhook);

// STRIPE

router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  paymentController.stripeWebhook
);

router.post(
  "/stripe/create-checkout-session",
  paymentController.stripeCreateCheckoutSession
);

module.exports = router;
