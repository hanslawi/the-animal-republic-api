// import libraries
const express = require("express");

// import controllers
const categoryController = require("../controllers/category.controller");

const categoryRouter = express.Router();

categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.post("/", categoryController.createCategory);
categoryRouter.get("/:id", categoryController.getCategory);
categoryRouter.patch("/:id", categoryController.updateCategory);
categoryRouter.delete("/:id", categoryController.deleteCategory);

categoryRouter.get('/:id/subcategories', categoryController.getAllSubcategories);

module.exports = categoryRouter;
