const express = require("express");
const subcategoryController = require("../controllers/subcategory.controller");

const router = express.Router({ mergeParms: true });

router.get("/", subcategoryController.getAllSubcategories);

module.exports = router;
