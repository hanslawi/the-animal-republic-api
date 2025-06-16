// import models
const Referral = require("../models/referral.model");

// import utils
const AppError = require("../utils/appError");

// import lib
const crypto = require("crypto");

exports.addReferral = async (req, res, next) => {
  try {
    const referralBody = {
      ...req.body,
      referralCode: crypto.randomBytes(3).toString("hex"),
    };
    const referral = await Referral.create(referralBody);
    console.log(referral);
    res.status(201).json({ status: "SUCCESS", data: { referral } });
  } catch (err) {
    next(err);
  }
};

exports.getReferrals = async (req, res, next) => {
  try {
    const referrals = await Referral.find({});

    res.status(200).json({
      status: "SUCCESS",
      results: referrals.length,
      data: { referrals },
    });
  } catch (err) {
    next(err);
  }
};

exports.getReferral = async (req, res, next) => {
  try {
    const referral = await Referral.findById(req.params.referralId);

    res.status(200).json({
      status: "SUCCESS",
      data: { referral },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateReferral = async (req, res, next) => {
  try {
    // find RFERRAL by ID and update
    const updatedReferral = await Referral.findByIdAndUpdate(
      req.params.referralId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // if REFERRAL is not found, throw AppError to next middleware
    if (!updatedReferral) return next(new AppError("Referral not found", 404));

    // send JSON response with updated Referral
    res
      .status(200)
      .json({ status: "SUCCESS", data: { referral: updatedReferral } });
  } catch (err) {
    next(err);
  }
};

exports.deleteReferral = async (req, res, next) => {
  try {
    // delete REFERRAL by Id
    const referral = await Referral.findByIdAndDelete(req.params.referralId);

    // if REFERRAL with that ID is not found, throw AppError
    if (!referral) return next(new AppError("Subcategory not found", 404));

    // send JSON response with deleted subcategory
    res.status(200).json({ status: "SUCCESS", data: referral });
  } catch (err) {
    next(err);
  }
};
