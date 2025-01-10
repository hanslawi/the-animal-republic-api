const express = require("express");
const countryController = require("../controllers/country.controller");

const router = express.Router();

router.post("/countries", countryController.addCountry);
router.get("/countries", countryController.getCountries);

module.exports = router;
