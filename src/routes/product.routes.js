// import library
const express = require("express");

// import controller
const productController = require("../controllers/product.controller");

// import routes
const productVariantRouter = require("./productVariant.routes");

const router = express.Router({ mergeParams: true });

router.get("/", productController.getAllProducts);
router.post("/", productController.createProduct);
router.get("/:productId", productController.getProduct);
router.patch("/:productId", productController.updateProduct);
router.delete("/:productId", productController.deleteProduct);

// nested route
router.use("/:productId/productvariants", productVariantRouter);

module.exports = router;
