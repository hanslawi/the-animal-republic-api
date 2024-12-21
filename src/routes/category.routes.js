// import libraries
const express = require("express");

// import controllers
const categoryController = require("../controllers/category.controller");

const categoryRouter = express.Router();

categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.post('/', categoryController.createCategory);
categoryRouter.patch('/:id', categoryController.updateCategory)

module.exports = categoryRouter;
