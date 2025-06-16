// import libraries
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// import router
const categoryRouter = require("./src/routes/category.routes");
const subcategoryRouter = require("./src/routes/subcategory.routes");
const productRouter = require("./src/routes/product.routes");
const productVariantRouter = require("./src/routes/productVariant.routes");
const uiRouter = require("./src/routes/ui.routes");
const shippingRouter = require("./src/routes/shipping.routes");
const taxRouter = require("./src/routes/tax.routes");
const paymentRouter = require("./src/routes/payment.routes");
const orderRouter = require("./src/routes/order.routes");
const referralRouter = require("./src/routes/referral.routes");

// init express
const app = express();

// morgan middleware
app.use(morgan("dev"));

// allow cors
app.use(cors());

// router with webhook
app.use("/api/payments", paymentRouter);

// parse incoming json body
app.use(express.json());

// routers
app.use("/api/categories", categoryRouter);
app.use("/api/subcategories", subcategoryRouter);
app.use("/api/products", productRouter);
app.use("/api/productvariants", productVariantRouter);
app.use("/api/ui", uiRouter);
app.use("/api/shipping", shippingRouter);
app.use("/api/tax", taxRouter);
app.use("/api/orders", orderRouter);
app.use("/api/referrals", referralRouter);
app.get("/", (req, res) => {
  res.status(200);
});

// error-handling middleware
app.use((err, req, res, next) => {
  // PROD
  if (err.status)
    res.status(err.status).json({ status: "ERROR", message: err.message });
  else res.status(500).json({ status: "ERROR", message: err.message });

  // DEV
  console.log(err);
});

module.exports = app;
