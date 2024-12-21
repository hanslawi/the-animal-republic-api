// import library
const express = require("express");

// import controller
const subcategoryController = require("../controllers/subcategory.controller");

// import router
const productRouter = require("./product.routes");

const router = express.Router({ mergeParams: true });

router.get("/", subcategoryController.getAllSubcategories);
router.post("/", subcategoryController.createSubcategory);
router.get("/:subcategoryId", subcategoryController.getSubcategory);
router.patch("/:subcategoryId", subcategoryController.updateSubcategory);
router.delete("/:subcategoryId", subcategoryController.deleteSubcategory);

// nested routes
router.use("/:subcategoryId/products", productRouter);

module.exports = router;
