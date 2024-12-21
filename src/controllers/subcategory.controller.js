const SubCategory = require('../models/subcategory.model');
const AppError = require('../utils/appError')

exports.getAllSubcategories = async (req, res, next) => {
    try {
      // get all SUBCATEGORIES with CATEGORY ID
      const categoryId = req.params.categoryId;
      const subcategories = await SubCategory.find({ category: categoryId });
  
      // send JSON response with SUBCATEGORIES
      res.status(200).json({ status: 200, data: subcategories });
    } catch (err) {
      next(err);
    }
  };
  
  exports.createSubcategory = async (req, res, next) => {
    try {
      // create SUBCATEGORY
      const subcategory = await SubCategory.create({
        ...req.body,
        category: req.params.categoryId,
      });
  
      // send JSON response (200) with subcategory
      res.status(200).json({ status: "SUCCESS", data: subcategory });
    } catch (err) {
      next(err);
    }
  };
  
  exports.getSubcategory = async (req, res, next) => {
      try {
          // get SUBCATEGORY by Id
      } catch (err) {
          next(err);
      }
  }