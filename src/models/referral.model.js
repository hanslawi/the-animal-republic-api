const mongoose = require("mongoose");
const validator = require("validator");

const referralSchema = new mongoose.Schema({
  paypalEmailAddress: {
    type: String,
    required: true,
    validate: validator.isEmail,
  },
  referralCount: {
    type: Number,
    default: 0,
  },
  commissionsEarned: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
  },
});

const Referral = mongoose.model("Referral", referralSchema);

module.exports = Referral;
