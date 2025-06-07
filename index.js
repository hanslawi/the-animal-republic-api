// import libraries
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./src/models/product.model");

// config.env
dotenv.config({ path: path.join(__dirname, "config.env") });

// import app
const app = require("./app");

// connect to MongoDB
const db = process.env.MONGODB_ATLAS_CONNECTION;
mongoose.connect(db).then(async () => {
  console.log(`Connected to ${db}`);
  // const products = await Product.find({ name: { $regex: "T-Shirt" } }).populate(
  //   "category"
  // );

  // await Promise.all(
  //   products.map(async (product, index) => {
  //     const tshirtProductVariants = await product._generateProductVariants();
  //     console.log("T-Shirt name: ", products[index].name);
  //     console.log("T-Shirt variants created: ", tshirtProductVariants.length);
  //     console.log(index);
  //   })
  // );
});

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Listening to ${port}`);
});
