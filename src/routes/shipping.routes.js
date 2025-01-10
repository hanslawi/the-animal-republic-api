const express = require("express");
const shippingController = require("../controllers/shipping.controller");

const router = express.Router();

router.post("/countries", shippingController.addCountry);
router.get("/countries", shippingController.getCountries);
router.get("/:countryCode/states", shippingController.getStatesOfCountry);

module.exports = router;
