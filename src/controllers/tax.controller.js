// import library
const AppError = require("../utils/appError");

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

exports.updateProduct = async (req, res, next) => {
  try {
    // find TAX by ID and update
    const updatedTax = await Tax.findByIdAndUpdate(req.params.taxId, req.body, {
      new: true,
      runValidators: true,
    });

    // if TAX is not found, throw AppError to next middleware
    if (!updatedTax) return next(new AppError("Tax not found", 404));

    // send JSON response with updated TAX
    res.status(200).json({ status: "SUCCESS", data: { tax: updatedTax } });
  } catch (err) {
    next(err);
  }
};
