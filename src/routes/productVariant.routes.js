// import library
const express = require("express");

// import controller
const productVariantController = require("../controllers/productVariantController");
const authController = require("../controllers/auth.controller");

const router = express.Router({ mergeParams: true });

router.get("/", productVariantController.getAllProductVariants);
router.post(
  "/",
  authController.protect,
  productVariantController.createProductVariant
);
router.get("/:productVariantId", productVariantController.getProductVariant);
router.patch(
  "/:productVariantId",
  authController.protect,
  productVariantController.updateProductVariant
);
router.delete(
  "/:productVariantId",
  authController.protect,
  productVariantController.deleteProductVariant
);

module.exports = router;
