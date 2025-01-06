// import library
const express = require("express");

// import controller
const uiController = require("../controllers/ui.controller");

const router = express.Router();

router.get("/home", uiController.getHomeData);
router.get("/catalog/:categorySlug", uiController.getCatalogDataOfCategory);
router.get("/catalog/:categorySlug/:subcategorySlug", uiController.getCatalogDataOfSubcategory);
router.get("/searchnavigation", uiController.getSearchNavigationData);

module.exports = router;
