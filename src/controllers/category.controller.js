const Category = require("../models/category.model");

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
    const { name } = req.body;
    const newCategory = await Category.create({ name });

    res.status(201).json({
      status: "SUCCESS",
      data: { category: newCategory },
    });
  } catch (err) {
    next(err);
  }
};
