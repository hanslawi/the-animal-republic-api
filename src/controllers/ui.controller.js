// import library
const AppError = require("../utils/appError");

// import model
const Category = require("../models/category.model");
const SubCategory = require("../models/subcategory.model");
const Product = require("../models/product.model");
const ProductVariant = require("../models/productVariant.model");

exports.getSearchNavigationData = async (req, res, next) => {
  try {
    // get CATEGORIES
    const categories = await Category.find()
      .select("id name slug bannerColor bannerImagesFileName")
      .sort({ _id: 1 });

    // init searchNavigationData object
    const searchNavigationData = {};

    // init searchNavigationData.categories Array
    searchNavigationData.categories = [];

    // iterate CATEGORIES
    categories.map(async (category) => {
      searchNavigationData.categories = [
        ...searchNavigationData.categories,
        {
          id: category.id,
          name: category.name,
          slug: category.slug,
          bannerColor: category.bannerColor,
          bannerImagesFileName: category.bannerImagesFileName,
        },
      ];

      return 1;
    });

    await Promise.all(
      searchNavigationData.categories.map(async (category, index) => {
        // get SUBCATEGORIES of current CATEGORY
        const subcategories = await SubCategory.find({
          category: category.id,
        })
          .select("name slug bannerColor bannerImageFileName")
          .sort({ _id: 1 });

        // get featured PROUDCTS of current CATEGORY
        const featuredProducts = await Product.find({
          category: category.id,
          featured: true,
        }).select(
          "attributes name slug regularPrice images themeColor videoFilename"
        );

        searchNavigationData.categories[index] = {
          ...searchNavigationData.categories[index],
          subcategories: subcategories,
          featuredProducts: featuredProducts,
        };

        return 1;
      })
    );

    // send JSON response with searchNavigationData
    res.json({ data: searchNavigationData });
  } catch (err) {
    next(err);
  }
};

exports.getHomeData = async (req, res, next) => {
  try {
    // get CATEGORIES and PRODUCTS ref in swiperSliders
    const categories = await Category.find()
      .populate("swiperSliders.product")
      .select("swiperSliders id name slug bannerColor bannerImagesFileName")
      .sort({ _id: 1 });
    // init homeData object
    const homeData = {};

    // init homeData.main.categories and homeData.search.categories Array
    homeData.categories = [];

    // iterate CATEGORIES
    categories.map(async (category) => {
      homeData.categories = [
        ...homeData.categories,
        {
          id: category.id,
          name: category.name,
          slug: category.slug,
          sliders: category.swiperSliders.map((slide) => {
            const slideData = {
              productName: slide.product.name,
              productPrice: slide.product.regularPrice,
              productSlug: slide.product.slug,
              slideImageFilename: slide.product.swiperSliderImageFilename,
            };
            return slideData;
          }),
        },
      ];

      return 1;
    });

    // send JSON response with homeData
    res.json({ data: homeData });
  } catch (err) {
    next(err);
  }
};

exports.getCatalogDataOfCategory = async (req, res, next) => {
  try {
    const { categorySlug } = req.params;
    const page = req.query.page || 1;
    const limit = 16;

    // get CATEGORY by route param categorySlug
    const category = await Category.findOne({ slug: categorySlug }).select(
      "id name slug bannerColor bannerImagesFileName"
    );

    // if CATEGORY with that slug is not found, throw AppError
    if (!category) return next(new AppError("Category not found.", 404));

    // get total number of products of category
    const productsCount = await Product.countDocuments({
      category: category.id,
    });

    // get total no of pages
    const pages = Math.ceil(productsCount / limit);

    // get products of category
    const products = await Product.find({ category: category.id })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort("field -dateCreated");

    // init catalogData object
    const catalogData = {};

    const subcategories = await SubCategory.find({
      category: category.id,
    })
      .select("name slug bannerColor bannerImageFileName")
      .sort({ _id: 1 });

    catalogData.category = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      bannerImagesFileName: category.bannerImagesFileName,
      bannerColor: category.bannerColor,
      subcategories: subcategories,
      products: products,
      totalPages: pages,
    };

    // send JSON response with catalogData
    res.json({ data: catalogData });
  } catch (err) {
    next(err);
  }
};

exports.getCatalogDataOfSubcategory = async (req, res, next) => {
  try {
    const { categorySlug, subcategorySlug } = req.params;
    const page = req.query.page || 1;
    const limit = 16;

    // get CATEGORY by route param categorySlug
    const category = await Category.findOne({ slug: categorySlug }).select(
      "id name slug bannerColor bannerImagesFileName"
    );

    // if CATEGORY with that slug is not found, throw AppError
    if (!category) return next(new AppError("Category not found.", 404));

    // get SUBCATEGORY by category id and route param subcategorySlug
    const subcategory = await SubCategory.findOne({
      category: category.id,
      slug: subcategorySlug,
    });

    // if SUBCATEGORY with that slug and category id is not found, throw AppError
    if (!subcategory) return next(new AppError("Subcategory not found.", 404));

    // get total number of products of subcategory
    const productsCount = await Product.countDocuments({
      category: category.id,
      subcategory: subcategory.id,
    });

    // get total no of pages
    const pages = Math.ceil(productsCount / limit);

    // get products of category
    const products = await Product.find({
      category: category.id,
      subcategory: subcategory.id,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort("field -dateCreated");

    // init catalogData object
    const catalogData = {};

    const subcategories = await SubCategory.find({
      category: category.id,
    })
      .select("name slug bannerColor bannerImageFileName")
      .sort({ _id: 1 });

    catalogData.category = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      bannerImagesFileName: category.bannerImagesFileName,
      bannerColor: category.bannerColor,
      subcategories: subcategories,
      subcategory: subcategory,
      products: products,
      totalPages: pages,
    };

    // send JSON response with catalogData
    res.json({ data: catalogData });
  } catch (err) {
    next(err);
  }
};

exports.getProductData = async (req, res, next) => {
  try {
    const { productSlug } = req.params;

    // get product by product slug
    const product = await Product.findOne({ slug: productSlug })
      .populate("category")
      .populate("subcategory");

    if (!product) return next(new AppError("Product not found", 404));

    // get product variants by product id
    const productVariants = await ProductVariant.find({ product: product.id });

    const collection = await Product.find({
      "collections.0": product.collections[0],
    });

    const randomProducts = await Product.aggregate([
      { $match: { subcategory: product.subcategory._id } },
    ]).sample(2);

    const recommendedProducts = [...collection, ...randomProducts];

    const productData = {};

    productData.product = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      regularPrice: product.regularPrice,
      attributes: product.attributes,
      images: product.images,
      category: {
        name: product.category.name,
        slug: product.category.slug,
        productDescription: product.category.productDescription,
        productDetails: product.category.productDetails,
        productSizeChart: product.category.productSizeChart,
      },
      subcategory: {
        name: product.subcategory.name,
        slug: product.subcategory.slug,
      },
      productVariants: productVariants,
      themeColor: product.themeColor,
      recommendation: recommendedProducts,
      mainImageIndex: product.mainImageIndex,
    };

    res.status(200).json({ data: productData });
  } catch (err) {
    next(err);
  }
};

exports.getCartData = async (req, res, next) => {
  try {
    // get items from req.body
    const { items } = req.body;

    const cartData = {};
    cartData.items = [];

    // get product and product variant of item
    await Promise.all(
      items.map(async (item) => {
        const product = await Product.findOne({ _id: item.id }).select(
          "_id name slug themeColor"
        );
        const productVariant = await ProductVariant.findOne({
          _id: item.productVariant._id,
        }).select("product attributes regularPrice images");

        cartData.items = [
          ...cartData.items,
          {
            id: item.id,
            name: product.name,
            slug: product.slug,
            productVariant: {
              _id: item.productVariant._id,
              product: productVariant.product,
              attributes: productVariant.attributes,
              regularPrice: productVariant.regularPrice,
              images: productVariant.images,
            },
            quantity: item.quantity,
            themeColor: product.themeColor,
          },
        ];

        return 1;
      })
    );

    res.status(200).json({ status: "SUCCESS", data: cartData });
  } catch (err) {
    next(err);
  }
};
