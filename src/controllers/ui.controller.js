// import library
const AppError = require("../utils/appError");

// import model
const Category = require("../models/category.model");
const SubCategory = require("../models/subcategory.model");
const Product = require("../models/product.model");

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
    await Promise.all(
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
      })
    );

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
