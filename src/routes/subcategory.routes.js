const express = require("express");
const subcategoryController = require("../controllers/subcategory.controller");

const router = express.Router({ mergeParams: true });

router.get("/", subcategoryController.getAllSubcategories);
router.post("/", subcategoryController.createSubcategory);
router.get("/:subcategoryId", subcategoryController.getSubcategory);

module.exports = router;
