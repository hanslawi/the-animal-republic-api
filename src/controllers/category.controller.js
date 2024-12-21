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

exports.getCategory = async (req, res, next) => {
  try {
  } catch (err) {}
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

    if (!updatedCategory) return next(new AppError("Category not found", 404));

    res
      .status(200)
      .json({ status: "SUCCESS", data: { category: updatedCategory } });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    res.status(200).json({ status: "SUCCESS", data: { category } });
  } catch (err) {
    next(err);
  }
};
