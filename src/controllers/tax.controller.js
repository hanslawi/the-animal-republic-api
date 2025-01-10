const Tax = require("../models/tax.model");

exports.addTax = async (req, res, next) => {
  try {
    const tax = await Tax.create(req.body);

    res.status(201).json({ status: "SUCCESS", data: { tax } });
  } catch (error) {
    next(error);
  }
};

exports.getTax = async (req, res, next) => {
  try {
    const tax = await Tax.findOne({});

    res.status(200).json({ status: "SUCCESS", data: { tax } });
  } catch (error) {
    next(error);
  }
};
