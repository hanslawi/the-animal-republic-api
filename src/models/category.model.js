const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  slug: String,
});

// slugify name eg. Premium Hoodies = premium-hoodies
categorySchema.pre("save", function (next) {
  if (this.name) this.slug = slugify(this.name, { lower: true });
  next();
});

categorySchema.pre("findOneAndUpdate", function (next) {
  const { name } = this.getUpdate();
  if (name) this.set({ slug: slugify(name, { lower: true }) });
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
