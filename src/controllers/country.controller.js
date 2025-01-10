const Country = require("../models/country.model");

exports.addCountry = async (req, res, next) => {
  try {
    const country = await Country.create(req.body);

    res.status(200).json({ status: "SUCCESS", data: { country } });
  } catch (err) {
    next(err);
  }
};

exports.getCountries = async (req, res, next) => {
  try {
    const countries = await Country.find({});

    res
      .status(200)
      .json({
        status: "SUCCESS",
        results: countries.length,
        data: { countries },
      });
  } catch (err) {
    next(err);
  }
};
