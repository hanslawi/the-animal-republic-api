const mongoose = require("mongoose");
const slugify = require("slugify");

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  images: { type: [{ altText: String, fileURL: String }] },
  slug: String,
  category: { type: mongoose.Schema.ObjectId, ref: "Category", required: true },
});

// slugify name eg. Premium Hoodies = premium-hoodies
subcategorySchema.pre("save", function (next) {
  if (this.name) this.slug = slugify(this.name, { lower: true });
  next();
});

subcategorySchema.pre("findOneAndUpdate", function (next) {
  const { name } = this.getUpdate();
  if (name) this.set({ slug: slugify(name, { lower: true }) });
  next();
});

const SubCategory = mongoose.model("SubCategory", subcategorySchema);

module.exports = SubCategory;
