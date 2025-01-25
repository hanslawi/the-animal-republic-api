const express = require("express");

// import controllers
const shippingController = require("../controllers/shipping.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post(
  "/countries",
  authController.protect,
  shippingController.addCountry
);
router.get("/countries", shippingController.getCountries);
router.get("/:countryCode/states", shippingController.getStatesOfCountry);
router.post(
  "/shippingclasses",
  authController.protect,
  shippingController.addShippingClass
);
router.get("/shippingclasses", shippingController.getShippingClasses);
router.post(
  "/shippingfees",
  authController.protect,
  shippingController.addShippingFee
);
router.get(
  "/:countryCode/shippingfees",
  shippingController.getShippingFeesOfCountry
);
router.post(
  "/calculateshippingfee",
  authController.protect,
  shippingController.calculateShippingFee
);

module.exports = router;
