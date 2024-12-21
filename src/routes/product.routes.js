// import library
const express = require("express");

// import controller
const productController = require("../controllers/product.controller");

const router = express.Router();

router.get("/", productController.getAllProducts);

module.exports = router;
