const express = require("express");
const shippingController = require("../controllers/shipping.controller");

const router = express.Router();

router.post("/countries", shippingController.addCountry);
router.get("/countries", shippingController.getCountries);
router.get("/:countryCode/states", shippingController.getStatesOfCountry);
router.post("/shippingclasses", shippingController.addShippingClass);
router.get("/shippingclasses", shippingController.getShippingClasses);
router.post("/shippingfees", shippingController.addShippingFee);
router.get(
  "/:countryCode/shippingfees",
  shippingController.getShippingFeesOfCountry
);
router.post("/shippingfees", shippingController.calculateShippingFee);

module.exports = router;
