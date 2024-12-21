const Category = require("../models/category.model");
const AppError = require("../utils/appError");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      status: "SUCCESS",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body);

    res.status(201).json({
      status: "SUCCESS",
      data: { category: newCategory },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res
      .status(200)
      .json({ status: "SUCCESS", data: { category: updatedCategory } });
  } catch (err) {
    next(err);
  }
};

