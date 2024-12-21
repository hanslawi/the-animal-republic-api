// import model
const Product = require("../models/product.model");

exports.getAllProducts = async (req, res, next) => {
  try {
    // get all PRODUCTS
    const products = await Product.find();

    res
      .status(200)
      .json({ status: "SUCCESS", results: products.length, data: products });
  } catch (err) {
    next(err);
  }
};

