// import library
const AppError = require("../utils/appError");

// import model
const Category = require("../models/category.model");

exports.getHomeData = async (req, res, next) => {
  try {
    // get CATEGORIES and PRODUCTS ref in swiperSliders
    const categories = await Category.find().populate("swiperSliders.product");

    // init homeData
    const homeData = {};

    // copy names of CATEGORIES to homeData.categories
    homeData.categories = categories.map((category) => category.name);

    // define swiper
    homeData.swiper = {};

    // iterate categories
    homeData.categories.map((category, index) => {
      homeData.swiper[category] = categories[index].swiperSliders.map(
        (slide) => {
          const slideData = {
            productName: slide.product.name,
            productPrice: slide.product.regularPrice,
            productSlug: slide.product.slug,
            slideImageFilename: slide.product.swiperSliderImageFilename,
          };
          return slideData;
        }
      );
      return 1;
    });

    res.status(200).json(homeData);

    // homeData.categories = categories.map((category) => category.name);
  } catch (err) {
    next(err);
  }
};
