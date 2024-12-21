const SubCategory = require("../models/subcategory.model");
const AppError = require("../utils/appError");

exports.getAllSubcategories = async (req, res, next) => {
  try {
    let filter;

    // if endpoint /api/categories/.../subcategories
    if (req.params.categoryId) filter = { category: req.params.categoryId };

    // get all SUBCATEGORIES with filter
    const subcategories = await SubCategory.find(filter);

    // send JSON response with SUBCATEGORIES
    res.status(200).json({ status: 200, data: subcategories });
  } catch (err) {
    next(err);
  }
};

exports.createSubcategory = async (req, res, next) => {
  try {
    // create SUBCATEGORY
    const subcategory = await SubCategory.create({
      ...req.body,
      category: req.params.categoryId,
    });

    // send JSON response (200) with subcategory
    res.status(200).json({ status: "SUCCESS", data: subcategory });
  } catch (err) {
    next(err);
  }
};

exports.getSubcategory = async (req, res, next) => {
  try {
    // get SUBCATEGORY by Id
    const subcategory = await SubCategory.findById(req.params.subcategoryId);

    // if SUBCATEGORY with that ID is not found, throw AppError
    if (!subcategory) return next(new AppError("Subcategory not found", 404));

    // send JSON response with subcategory
    res.status(200).json({ status: "SUCCESS", data: subcategory });
  } catch (err) {
    next(err);
  }
};

exports.updateSubcategory = async (req, res, next) => {
  try {
    // update SUBCATEGORY by Id
    const updatedSubcategory = await SubCategory.findByIdAndUpdate(
      req.params.subcategoryId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // if SUBCATEGORY with that ID is not found, throw AppError
    if (!updatedSubcategory)
      return next(new AppError("Subcategory not found", 404));

    res
      .status(201)
      .json({ status: "SUCCESS", data: { category: updatedSubcategory } });
  } catch (err) {
    next(err);
  }
};
