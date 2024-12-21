// import model
const Product = require("../models/product.model");

exports.getAllProducts = async (req, res, next) => {
  try {
    let filter;

    // if endpoint /api/categories/.../products
    if (req.params.categoryId) filter = { category: req.params.categoryId };

    // if endpoint /api/subcategories/.../products
    if (req.params.subcategoryId)
      filter = { subcategory: req.params.subcategoryId };

    // get all PRODUCTS
    const products = await Product.find(filter);

    res
      .status(200)
      .json({ status: "SUCCESS", results: products.length, data: products });
  } catch (err) {
    next(err);
  }
};
