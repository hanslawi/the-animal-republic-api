// import library
const AppError = require("../utils/appError");

// import model
const Category = require("../models/category.model");
const SubCategory = require("../models/subcategory.model");
const Product = require("../models/product.model");

exports.getSearchNavigationData = async (req, res, next) => {
  try {
    // get CATEGORIES
    const categories = await Category.find().select(
      "id name slug bannerColor bannerImagesFileName"
    );

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
        }).select("name slug bannerColor bannerImageFileName");

        // get featured PROUDCTS of current CATEGORY
        const featuredProducts = await Product.find({
          category: category.id,
        }).select("attributes name slug regularPrice images");

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
      .select("swiperSliders id name slug bannerColor bannerImagesFileName");

    // init homeData object
    const homeData = {};

    // init homeData.main and homeData.search object
    homeData.main = {};
    homeData.search = {};

    // init homeData.main.categories and homeData.search.categories Array
    homeData.main.categories = [];
    homeData.search.categories = [];

    // iterate CATEGORIES
    categories.map(async (category) => {
      homeData.main.categories = [
        ...homeData.main.categories,
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

      homeData.search.categories = [
        ...homeData.search.categories,
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
      homeData.search.categories.map(async (category, index) => {
        // get SUBCATEGORIES of current CATEGORY
        const subcategories = await SubCategory.find({
          category: category.id,
        }).select("name slug bannerColor bannerImageFileName");

        // get featured PROUDCTS of current CATEGORY
        const featuredProducts = await Product.find({
          category: category.id,
        }).select("attributes name slug regularPrice images");

        homeData.search.categories[index] = {
          ...homeData.search.categories[index],
          subcategories: subcategories,
          featuredProducts: featuredProducts,
        };

        return 1;
      })
    );

    // send JSON response with homeData
    res.json({ data: homeData });
  } catch (err) {
    next(err);
  }
};

exports.getCatalogData = async (req, res, next) => {
  try {
    const { categorySlug } = req.params;

    // get CATEGORY by route param categorySlug
    const category = await Category.findOne({ slug: categorySlug });

    // if CATEGORY with that slug is not found, throw AppError
    if (!category) return next(AppError("Category not found.", 404));

    // get products of category
    const products = await Product.find({ category: category.id });

    // init catalogData object
    const catalogData = {};

    catalogData.category = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      products: products,
    };

    console.log(catalogData);

    // send JSON response with catalogData
    res.json({ data: catalogData });
  } catch (err) {
    next(err);
  }
};
