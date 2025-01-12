// import libraries
const express = require("express");

// import controllers
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.get("/:orderId", orderController.getOrder);
router.get("/", orderController.getOrders);
router.delete("/:orderId", orderController.deleteOrder);
router.patch("/:orderId", orderController.updateOrder);

module.exports = router;
