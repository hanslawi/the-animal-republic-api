const AppError = require("../utils/appError");

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // console.log(token);

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    // 2) Verify token

    const verified = token === "Hassan#1234567890";

    if (!verified) return next(new AppError("Invalid token!", 401));

    next();
  } catch (err) {
    next(err);
  }
};
