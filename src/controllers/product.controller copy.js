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
    const products = await Product.find(filter).limit(12).sort('field -dateCreated');

    res
      .status(200)
      .json({ status: "SUCCESS", results: products.length, data: products });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    if (Array.isArray(req.body)) {
      // const productsBody = req.body;

      // await productsBody.map(async (productBody) => {
      //   const product = await Product.create(productBody);
      // });

      // // create PRODUCT
      // const product = await Product.create(req.body);
      // // send JSON response with product
      // res.status(201).json({
      //   status: "SUCCESS",
      //   data: product,
      // });

      // T-Shirt
      const tshirtProductBody = req.body[0];
      const tshirtProduct = await Product.create(tshirtProductBody);
      console.log("T-Shirt created: ", tshirtProduct._id.toString());
      const _tshirtProduct = await Product.findById(
        tshirtProduct._id.toString()
      ).populate("category");
      // generate t-shirt PRODUCT VARIANTS
      const tshirtProductVariants =
        await _tshirtProduct._generateProductVariants();
      console.log("T-Shirt variants created: ", tshirtProductVariants.length);

      // Hoodie
      const hoodieProductBody = req.body[1];
      const hoodieProduct = await Product.create(hoodieProductBody);
      console.log("Hoodie created: ", hoodieProduct._id.toString());
      const _hoodieProduct = await Product.findById(
        hoodieProduct._id.toString()
      ).populate("category");
      // generate hoodie PRODUCT VARIANTS
      const hoodieProductVariants =
        await _hoodieProduct._generateProductVariants();
      console.log("Hoodie variants created: ", hoodieProductVariants.length);

      // Sweatshirt
      const sweatshirtProductBody = req.body[2];
      const sweatshirtProduct = await Product.create(sweatshirtProductBody);
      console.log("Sweatshirt created: ", sweatshirtProduct._id.toString());
      const _sweatshirtProduct = await Product.findById(
        sweatshirtProduct._id.toString()
      ).populate("category");
      // generate hoodie PRODUCT VARIANTS
      const sweatshirtProductVariants =
        await _sweatshirtProduct._generateProductVariants();
      console.log(
        "Sweatshirt variants created: ",
        sweatshirtProductVariants.length
      );

      // send JSON response with product
      res.status(201).json({
        status: "SUCCESS",
        data: {
          tshirt: tshirtProduct,
          tshirtVariants: tshirtProductVariants,
          hoodie: hoodieProduct,
          hoodieVariants: hoodieProductVariants,
          sweatshirt: sweatshirtProduct,
          sweatshirtVariants: sweatshirtProductVariants,
        },
      });
    } else {
      // create PRODUCT
      const product = await Product.create(req.body);

      // send JSON response with product
      res.status(201).json({
        status: "SUCCESS",
        data: product,
      });
    }
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
    const product = await Product.findById(req.params.productId).populate(
      "category"
    );

    // check if PRODUCT is found
    if (!product) return next(new AppError("Product not found", 404));

    // generate PRODUCT VARIANTS
    const productVariants = await product._generateProductVariants();

    // send JSON response with added PRODUCT VARIANTS
    res.status(200).json({
      status: "SUCCESS",
      results: productVariants.length,
      data: { productvariants: productVariants },
    });
  } catch (err) {
    next(err);
  }
};
