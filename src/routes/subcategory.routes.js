const express = require("express");
const subcategoryController = require("../controllers/subcategory.controller");

const router = express.Router({ mergeParams: true });

router.get("/", subcategoryController.getAllSubcategories);
router.post("/", subcategoryController.createSubcategory);
router.get("/:subcategoryId", subcategoryController.getSubcategory);
router.patch("/:subcategoryId", subcategoryController.updateSubcategory);
router.delete("/:subcategoryId", subcategoryController.deleteSubcategory);

module.exports = router;
