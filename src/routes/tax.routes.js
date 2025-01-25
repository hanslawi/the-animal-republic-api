const express = require("express");

// import controllers
const taxController = require("../controllers/tax.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/", authController.protect, taxController.addTax);
router.get("/", taxController.getTax);

module.exports = router;
