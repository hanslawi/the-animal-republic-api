const Country = require("../models/country.model");
const AppError = require("../utils/appError");

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
    const countries = await Country.find({}).select("name code");

    res.status(200).json({
      status: "SUCCESS",
      results: countries.length,
      data: { countries },
    });
  } catch (err) {
    next(err);
  }
};

exports.getStatesOfCountry = async (req, res, next) => {
  try {
    const country = await Country.findOne({
      code: req.params.countryCode,
    }).select("states");

    if (!country) return next(new AppError("Country not found", 404));

    const { states } = country;

    res.status(200).json({
      status: "SUCCESS",
      results: states.length,
      data: { states: states },
    });
  } catch (err) {
    next(err);
  }
};
