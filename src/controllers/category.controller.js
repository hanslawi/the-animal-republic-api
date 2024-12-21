const Category = require("../models/category.model");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = Category.find();

    res.status(200).json({
      status: "SUCCESS",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};
