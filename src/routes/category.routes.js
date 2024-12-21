// import libraries
const express = require("express");

// import router
const subcategoryRouter = require("./subcategory.routes");
const productRouter = require("./product.routes");

// import controllers
const categoryController = require("../controllers/category.controller");

const router = express.Router();

router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.createCategory);
router.get("/:categoryId", categoryController.getCategory);
router.patch("/:categoryId", categoryController.updateCategory);
router.delete("/:categoryId", categoryController.deleteCategory);

// nested routes
router.use("/:categoryId/subcategories", subcategoryRouter);
router.use("/:categoryId/products", productRouter);

module.exports = router;
