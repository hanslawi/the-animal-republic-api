// import libraries
const express = require("express");

// import controllers
const categoryController = require("../controllers/category.controller");

const categoryRouter = express.Router();

categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.post("/", categoryController.createCategory);
categoryRouter.get("/:categoryId", categoryController.getCategory);
categoryRouter.patch("/:categoryId", categoryController.updateCategory);
categoryRouter.delete("/:categoryId", categoryController.deleteCategory);

categoryRouter.get('/:categoryId/subcategories', categoryController.getAllSubcategories);
categoryRouter.post('/:categoryId/subcategories', categoryController.createSubcategory);
// categoryRouter.get('/:id/subcategories/:id')

module.exports = categoryRouter;
