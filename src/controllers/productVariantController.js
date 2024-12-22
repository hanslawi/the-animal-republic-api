// import util
const AppError = require("../utils/appError");

// import model
const ProductVariant = require("../models/productVariant.model");

exports.getAllProductVariants = async (req, res, next) => {
  try {
    let filter;

    // if endpoint /api/products/.../productvariants
    if (req.params.productId) filter = { product: req.params.productId };

    // get all PRODUCT VARIANTS
    const productVariants = await ProductVariant.find(filter);

    // send JSON response with PRODUCT VARIANTS
    res.status(200).json({ status: "SUCCESS", data: productVariants });
  } catch (err) {
    next(err);
  }
};

exports.createProductVariant = async (req, res, next) => {
  try {
    // create PRODUCT VARIANT
    const productVariant = await ProductVariant.create(req.body);

    // send JSON response with added PRODUCT VARIANT
    res
      .status(201)
      .json({ status: "SUCCESS", data: { productvariant: productVariant } });
  } catch (err) {
    next(err);
  }
};

exports.getProductVariant = async (req, res, next) => {
  try {
    // get PRODUCT VARIANT by ID
    const productVariant = await ProductVariant.findById(
      req.params.productVariantId
    );

    // if PRODUCT VARIANT is not found, throw AppError to next middleware
    if (!productVariant)
      return next(new AppError("Product variant not found", 404));

    // send JSON response with PRODUCT VARIANT
    res.status(200).json({
      status: "SUCCESS",
      data: { productvariant: productVariant },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProductVariant = async (req, res, next) => {
  try {
    // get PRODUCT VARIANT by ID and update
    const updatedProductVariant = await ProductVariant.findByIdAndUpdate(
      req.params.productVariantId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // if PRODUCT VARIANT is not found, throw AppError to next middleware
    if (!updatedProductVariant)
      return next(new AppError("Product variant not found", 404));

    // send JSON response with updated PRODUCT VARIANT
    res
      .status(201)
      .json({
        status: "SUCCESS",
        data: { productvariant: updatedProductVariant },
      });
  } catch (err) {
    next(err);
  }
};
