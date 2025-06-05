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
app.get("/", (req, res) => {
  res.status(200);
});


// const path = require("path");
// app.use(express.static("public"));
// set the view engine to ejs
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "src", "views"));
// const Order = require("./src/models/order.model");
// const ejs = require("ejs");
// app.get("/email", async (req, res) => {
//   const order = await Order.findById("6840ab55adae295c9426c0ad")
//     .populate("items.product")
//     .populate("items.productVariant");

//   const totalNoOfItems = order.items.reduce((accumulator, item) => {
//     const _accumulator = accumulator + item.quantity;
//     return _accumulator;
//   }, 0);

//   console.log(order);

//   const data = {
//     customerEmailAddress: order.customerEmailAddress,
//     customerFirstName: order.customerFirstName,
//     customerLastName: order.customerLastName,
//     customerAddressLine1: order.customerAddressLine1,
//     customerAddressLine2: order.customerAddressLine2,
//     customerCity: order.customerCity,
//     customerState: order.customerState,
//     customerZipCode: order.customerZipCode,
//     customerPhone: order.customerPhone,
//     paymentMethod: order.paymentMethod,
//     orderNo: order._id.toString(),
//     totalNoOfItems: totalNoOfItems,
//     items: order.items,
//     itemsSubtotal: order.itemsSubtotal,
//     shippingAmount: order.shippingAmount,
//   };

//   console.log("/email");

//   res.status(200).render("invoiceReceipt", { data: data });
// });

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
