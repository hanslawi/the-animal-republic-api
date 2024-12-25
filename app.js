// import libraries
const express = require("express");
const morgan = require("morgan");

// import router
const categoryRouter = require("./src/routes/category.routes");
const subcategoryRouter = require("./src/routes/subcategory.routes");
const productRouter = require("./src/routes/product.routes");
const productVariantRouter = require("./src/routes/productVariant.routes");
const uiRouter = require("./src/routes/ui.routes");

// init express
const app = express();

// parse incoming json body
app.use(express.json());

// morgan middleware
app.use(morgan("dev"));

// routers
app.use("/api/categories", categoryRouter);
app.use("/api/subcategories", subcategoryRouter);
app.use("/api/products", productRouter);
app.use("/api/productvariants", productVariantRouter);
app.use("/api/ui", uiRouter);

// error-handling middleware
app.use((err, req, res, next) => {
  // PROD
  //   if (err.status)
  //     res.status(err.status).json({ status: "ERROR", message: err.message });
  //   else res.status(500).json({ status: "ERROR", message: err.message });

  // DEV
  console.log(err);
});

module.exports = app;
