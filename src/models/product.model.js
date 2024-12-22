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
    default: "simple",
    required: true,
  },
  regularPrice: { type: Number, min: 0 }, // product.type = simple
  salePrice: { type: Number, min: 0 }, // product.type = simple
  SKU: String, // product.type = simple
  attributes: [{ name: String, values: [String] }],
  collections: [String],
  images: [{ type: { altText: String, fileURL: String } }],
  backgroundImage: { type: { altText: String, fileURL: String } },
  videoShowcase: { type: { altText: String, fileURL: String } },
  tags: [String],
  slug: { type: String, unique: true, required: true },
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
