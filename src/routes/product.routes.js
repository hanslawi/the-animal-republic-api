// import library
const express = require("express");

// import controller
const productController = require("../controllers/product.controller");
const authController = require("../controllers/auth.controller");

// import routes
const productVariantRouter = require("./productVariant.routes");

const router = express.Router({ mergeParams: true });

router.get("/", productController.getAllProducts);
router.post("/", authController.protect, productController.createProduct);
router.get("/:productId", productController.getProduct);
router.patch(
  "/:productId",
  authController.protect,
  productController.updateProduct
);
router.delete(
  "/:productId",
  authController.protect,
  productController.deleteProduct
);

// generate variants
router.post(
  "/:productId/generateproductvariants",
  authController.protect,
  productController.generateProductVariants
);

// nested route
router.use("/:productId/productvariants", productVariantRouter);

module.exports = router;
