// import library
const AppError = require("../utils/appError");

// import model
const Category = require("../models/category.model");
const SubCategory = require("../models/subcategory.model");

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

        // get SUBCATEGORIES of current CATEGORY
        const subcategories = await SubCategory.find({
          category: category.id,
        }).select("name slug bannerColor bannerImageFileName");

        homeData.search.categories = [
          ...homeData.search.categories,
          {
            name: category.name,
            slug: category.slug,
            bannerColor: category.bannerColor,
            bannerImagesFileName: category.bannerImagesFileName,
            subcategories: subcategories,
          },
        ];

        return 1;
      })
    );

    // iterate CATEGORIES

    res.json({ data: homeData });

    // // copy names of CATEGORIES to homeData.categories
    // homeData.categories = categories.map((category) => category.name);

    // // define swiper
    // homeData.swiper = {};

    // // FOR MAIN
    // // iterate categories
    // homeData.categories.map((category, index) => {
    //   homeData.swiper[category] = categories[index].swiperSliders.map(
    //     (slide) => {
    //       const slideData = {
    //         productName: slide.product.name,
    //         productPrice: slide.product.regularPrice,
    //         productSlug: slide.product.slug,
    //         slideImageFilename: slide.product.swiperSliderImageFilename,
    //       };
    //       return slideData;
    //     }
    //   );
    //   return 1;
    // });

    // res.status(200).json({ data: homeData });
  } catch (err) {
    next(err);
  }
};
