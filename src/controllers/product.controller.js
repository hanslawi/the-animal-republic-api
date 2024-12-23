// import library
const AppError = require("../utils/appError");

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

exports.createProduct = async (req, res, next) => {
  try {
    // create PRODUCT
    const product = await Product.create(req.body);

    // send JSON response with product
    res.status(201).json({
      status: "SUCCESS",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    // get PRODUCT by ID
    const product = await Product.findById(req.params.productId);

    // if PRODUCT with that ID is not found, throw AppError
    if (!product) return next(new AppError("Product not found", 404));

    // send JSON response with product
    res.status(200).json({
      status: "SUCCESS",
      data: product,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    // find PRODUCT by ID and update
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // if PRODUCT is not found, throw AppError to next middleware
    if (!updatedProduct) return next(new AppError("Product not found", 404));

    // send JSON response with updated PRODUCT
    res
      .status(200)
      .json({ status: "SUCCESS", data: { product: updatedProduct } });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    // find PRODUCT by ID and delete it
    const product = await Product.findByIdAndDelete(req.params.productId);

    // if PRODUCT is not found, throw AppError to next middleware
    if (!product) return next(new AppError("Product not found", 404));

    // send JSON response with deleted PRODUCT
    res.status(200).json({ status: "SUCCESS", data: product });
  } catch (err) {
    next(err);
  }
};

exports.generateProductVariants = async (req, res, next) => {
  try {
    // get PRODUCT by ID
    const product = await Product.findById(req.params.productId).populate('subcategory');

    // check if PRODUCT is found
    if (!product) return next(new AppError("Product not found", 404));

    // generate PRODUCT VARIANTS
    const productVariants = await product._generateProductVariants();

    // send JSON response with added PRODUCT VARIANTS
    res
      .status(200)
      .json({
        status: "SUCCESS",
        results: productVariants.length,
        data: { productvariants: productVariants },
      });
  } catch (err) {
    next(err);
  }
};
