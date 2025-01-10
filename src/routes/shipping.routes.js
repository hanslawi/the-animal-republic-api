const express = require("express");
const shippingController = require("../controllers/shipping.controller");

const router = express.Router();

router.post("/countries", shippingController.addCountry);
router.get("/countries", shippingController.getCountries);
router.get("/:countryCode/states", shippingController.getStatesOfCountry);
router.post("/shippingclasses", shippingController.addShippingClass);
router.get("/shippingclasses", shippingController.getShippingClasses);

module.exports = router;
