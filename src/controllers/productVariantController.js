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
