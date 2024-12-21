const SubCategory = require("../models/subcategory.model");
const AppError = require("../utils/appError");

exports.getAllSubcategories = async (req, res, next) => {
  try {
    let filter;

    // if endpoint /api/categories/.../subcategories
    if (req.params.categoryId) filter = { category: req.params.categoryId };

    // get all SUBCATEGORIES with filter
    const subcategories = await SubCategory.find(filter);

    // send JSON response with SUBCATEGORIES
    res.status(200).json({ status: 200, data: subcategories });
  } catch (err) {
    next(err);
  }
};

//   exports.createSubcategory = async (req, res, next) => {
//     try {
//       // create SUBCATEGORY
//       const subcategory = await SubCategory.create({
//         ...req.body,
//         category: req.params.categoryId,
//       });

//       // send JSON response (200) with subcategory
//       res.status(200).json({ status: "SUCCESS", data: subcategory });
//     } catch (err) {
//       next(err);
//     }
//   };

//   exports.getSubcategory = async (req, res, next) => {
//       try {
//           // get SUBCATEGORY by Id
//       } catch (err) {
//           next(err);
//       }
//   }
