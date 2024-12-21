const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: mongoose.SchemaTypes.Mixed,
  type: {
    type: String,
    enum: ["simple", "variable"],
    required: true,
    default: "simple",
  },
  regularPrice: {type: Number, min: 0, default: 0, required: true},
  salePrice: {type: Number, min: 0, default: 0},
  SKU: String,
  stockManagement: { type: Boolean, default: false },
  // if stockManagement is true
  quantity: { type: Number, min: 0, default: 0, required: true },
  // if stockManagement is false
  stockStatus: {
    type: String,
    enum: ["In stock", "Out of stock"],
    default: "In stock",
    required: true,
  },
  attributes: [{ name: String, values: [String] }],
  collections: [String],
  imagesURL: [String],
  backgroundImageURL: String,
  tags: [String],
  slug: String,
  category: { type: mongoose.Schema.ObjectId, ref: "Category" },
  subcategory: { type: mongoose.Schema.ObjectId, ref: "SubCategory" },
});

// slugify name eg. Premium Hoodies = premium-hoodies
productSchema.pre("save", function (next) {
  if (this.name) this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre("findOneAndUpdate", function (next) {
  const { name } = this.getUpdate();
  if (name) this.set({ slug: slugify(name, { lower: true }) });
  next();
});

// productSchema.statics.generateVariations = function (next) {

// }

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
