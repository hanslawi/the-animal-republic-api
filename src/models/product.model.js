const mongoose = require("mongoose");
const slugify = require('slugify');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: mongoose.SchemaTypes.Mixed,
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

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
