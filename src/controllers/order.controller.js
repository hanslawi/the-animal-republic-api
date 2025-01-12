const Order = require("../models/order.model");
const AppError = require("../utils/appError");

exports.getOrder = async (req, res, next) => {
  try {
    // get ORDER by ID
    const order = await Order.findById(req.params.orderId)
      .populate("items.product")
      .populate("items.productVariant");

    // if ORDER is not found, throw AppError
    if (!order) return next(new AppError("Order not found", 404));

    res.status(200).json({ status: "SUCCESS", data: { order } });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    // get all orders
    const orders = await Order.find()
      .populate("items.product")
      .populate("items.productVariant");

    res
      .status(200)
      .json({ status: "SUCCESS", results: orders.length, data: { orders } });
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    // get ORDER by ID
    const order = await Order.findById(req.params.orderId);

    // if ORDER is not found, throw AppError
    if (!order) return next(new AppError("Order not found", 404));

    res.status(200).json({ status: "SUCCESS", data: { order } });
  } catch (err) {
    next(err);
  }
};
