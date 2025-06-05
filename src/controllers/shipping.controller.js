// import models
const Country = require("../models/country.model");
const ShippingClass = require("../models/shippingClass.model");
const ShippingFee = require("../models/shippingFee.model");
const Product = require("../models/product.model");

// import utils
const AppError = require("../utils/appError");

exports.addCountry = async (req, res, next) => {
  try {
    const country = await Country.create(req.body);

    res.status(201).json({ status: "SUCCESS", data: { country } });
  } catch (err) {
    next(err);
  }
};

exports.getCountries = async (req, res, next) => {
  try {
    const countries = await Country.find({}).select("name code");

    res.status(200).json({
      status: "SUCCESS",
      results: countries.length,
      data: { countries },
    });
  } catch (err) {
    next(err);
  }
};

exports.getStatesOfCountry = async (req, res, next) => {
  try {
    const country = await Country.findOne({
      code: req.params.countryCode,
    }).select("states");

    if (!country) return next(new AppError("Country not found", 404));

    const { states } = country;

    res.status(200).json({
      status: "SUCCESS",
      results: states.length,
      data: { states: states },
    });
  } catch (err) {
    next(err);
  }
};

exports.addShippingClass = async (req, res, next) => {
  try {
    const shippingClass = await ShippingClass.create(req.body);

    res.status(201).json({ status: "SUCCESS", data: { shippingClass } });
  } catch (err) {
    next(err);
  }
};

exports.getShippingClasses = async (req, res, next) => {
  try {
    const shippingClasses = await ShippingClass.find({});

    res.status(200).json({
      status: "SUCCESS",
      results: shippingClasses.length,
      data: { shippingClasses },
    });
  } catch (err) {
    next(err);
  }
};

exports.addShippingFee = async (req, res, next) => {
  try {
    const shippingFee = await ShippingFee.create(req.body);

    res.status(201).json({ status: "SUCCESS", data: { shippingFee } });
  } catch (err) {
    next(err);
  }
};

exports.getShippingFeesOfCountry = async (req, res, next) => {
  try {
    // get country by code
    const country = await Country.findOne({ code: req.params.countryCode });

    // get country id
    const { id: countryId } = country;

    const shippingFees = await ShippingFee.find({ country: countryId })
      .populate("country")
      .populate("shippingClass");

    res.status(200).json({
      status: "SUCCESS",
      results: shippingFees.length,
      data: { shippingFees },
    });
  } catch (err) {
    next(err);
  }
};

exports.calculateShippingFee = async (req, res, next) => {
  try {
    // get items from cart
    const { items } = req.body;


    const itemsWithShippingClass = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.id).select(
          "_id name shippingClass"
        );

        return { ...product.toObject(), quantity: item.quantity };
      })
    );

    const productsWithItemQuantity = itemsWithShippingClass.sort((a, b) =>
      a.shippingClass.toString().localeCompare(b.shippingClass.toString())
    );

    // get country from body
    const { country } = req.body;

    // get id of country
    const { _id: countryId } = await Country.findOne({ code: country.code });

    // get shipping fees of country
    const shippingFees = await ShippingFee.find({ country: countryId });

    let shippingFeeAccumulator = 0;
    let previousShippingClass;

    productsWithItemQuantity.map((product) => {
      const { firstItem, additionalItem } = shippingFees.filter(
        (el) => el.shippingClass.toString() === product.shippingClass.toString()
      )[0];

      if (previousShippingClass === product.shippingClass.toString()) {
        if (product.quantity > 1)
          shippingFeeAccumulator +=
            Number(additionalItem) * Number(product.quantity);
        else shippingFeeAccumulator += Number(additionalItem);
      } else if (previousShippingClass !== product.shippingClass.toString()) {
        if (product.quantity > 1) {
          // get shipping fee for first item
          shippingFeeAccumulator += Number(firstItem);
          // get shipping fees for additional items
          shippingFeeAccumulator +=
            Number(additionalItem) * (Number(product.quantity) - 1);
          console.log(product.quantity);
        } else if (product.quantity === 1) {
          shippingFeeAccumulator += firstItem;
        }
      }

      previousShippingClass = product.shippingClass.toString();

      return 1;
    });

    // await Promise.all(productsShippingClass.map(async (product) => {
    //   // get
    //   const
    // }));

    res.status(200).json({
      status: "SUCCESS",
      data: { shippingFee: shippingFeeAccumulator },
    });

    // res.status(200).json({
    //   status: "SUCCESS",
    //   data: { productsWithItemQuantity },
    // });

    // res.status(200).json({
    //   items,
    //   products,
    // });
  } catch (error) {
    next(error);
  }
};
