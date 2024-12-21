// import library
const express = require("express");

// import controller
const productVariantController = require("../controllers/productVariantController");

const router = express.Router();

router.get("/", productVariantController.getAllProductVariants);
router.post('/', productVariantController.createProductVariant);

module.exports = router;
