const mongoose = require("mongoose");
const slugify = require("slugify");

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  slug: String,
  category: { type: mongoose.Schema.ObjectId, ref: "Category", required: true },
});

// slugify name eg. Premium Hoodies = premium-hoodies
subcategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  console.log(this.slug);
  next();
});

subcategorySchema.pre("findOneAndUpdate", function (next) {
  const { name } = this.getUpdate();
  this.set({ slug: slugify(name, { lower: true }) });
  next();
});

const SubCategory = mongoose.model("SubCategory", subcategorySchema);

module.exports = SubCategory;
