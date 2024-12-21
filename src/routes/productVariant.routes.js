// import library
const express = require("express");

// import controller
const productVariantController = require("../controllers/productVariantController");

const router = express.Router({ mergeParams: true });

router.get("/", productVariantController.getAllProductVariants);
router.post("/", productVariantController.createProductVariant);
router.get('/:productVariantId', productVariantController.getProductVariant);

module.exports = router;
