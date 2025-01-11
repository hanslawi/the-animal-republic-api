// import libraries
const express = require("express");

// import controllers
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.get("/:orderId", orderController.getOrder);

module.exports = router;
