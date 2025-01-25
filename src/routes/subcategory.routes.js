// import library
const express = require("express");

// import controller
const subcategoryController = require("../controllers/subcategory.controller");
const authController = require("../controllers/auth.controller");

// import router
const productRouter = require("./product.routes");

const router = express.Router({ mergeParams: true });

router.get("/", subcategoryController.getAllSubcategories);
router.post(
  "/",
  authController.protect,
  subcategoryController.createSubcategory
);
router.get("/:subcategoryId", subcategoryController.getSubcategory);
router.patch(
  "/:subcategoryId",
  authController.protect,
  subcategoryController.updateSubcategory
);
router.delete(
  "/:subcategoryId",
  authController.protect,
  subcategoryController.deleteSubcategory
);

// nested routes
router.use("/:subcategoryId/products", productRouter);

module.exports = router;
