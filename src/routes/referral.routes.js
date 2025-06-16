const express = require("express");

// import controllers
const referralController = require("../controllers/referral.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/", referralController.addReferral);

router.get("/:referralId", referralController.getReferral);
router.get("/", referralController.getReferrals);
router.patch(
  "/referralId",
  authController.protect,
  referralController.updateReferral
);
router.delete(
  "/:referralId",
  authController.protect,
  referralController.deleteReferral
);

module.exports = router;
