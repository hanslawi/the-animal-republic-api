const Category = require("../models/category.model");
const AppError = require("../utils/appError");

exports.getAllCategories = async (req, res, next) => {
  try {
    // get all CATEGORIES
    const categories = await Category.find();

    // send JSON response containing CATEGORIES
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
    // create CATEGORY
    const newCategory = await Category.create(req.body);

    // send JSON response with newCategory
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
    // get CATEGORY by ID
    const category = await Category.findById(req.params.categoryId);

    // if CATEGORY is not found, throw AppError
    if (!category) return next(new AppError("Category not found", 404));

    res.status(200).json({ status: "SUCCESS", data: { category } });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    // update CATEGORY by ID
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // if CATEGORY with that ID is not found, throw AppError
    if (!updatedCategory) return next(new AppError("Category not found", 404));

    // send JSON response with updatedCategory
    res
      .status(200)
      .json({ status: "SUCCESS", data: { category: updatedCategory } });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    // delete CATEGORY by ID
    const category = await Category.findByIdAndDelete(req.params.categoryId);

    // if CATEGORY with that ID is not found, throw AppError
    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    // send JSON response with category
    res.status(200).json({ status: "SUCCESS", data: { category } });
  } catch (err) {
    next(err);
  }
};