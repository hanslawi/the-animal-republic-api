// import libraries
const express = require("express");

// import controllers
const orderController = require("../controllers/order.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.get("/:orderId", orderController.getOrder);
router.get("/", orderController.getOrders);
router.delete("/:orderId", authController.protect, orderController.deleteOrder);
router.patch("/:orderId", authController.protect, orderController.updateOrder);

module.exports = router;
