const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  images: { type: [{ altText: String, fileURL: String }] },
  swiperSliders: {
    type: [{ product: { type: mongoose.Schema.ObjectId, ref: "Product" } }],
  },
  bannerColor: { type: String },
  bannerImagesFileName: {
    type: [String],
  },
  slug: String,
  productDescription: {
    type: String,
  },
  productDetails: {
    type: [String],
  },
  productSizeChart: {
    type: mongoose.Schema.Types.Mixed,
  },
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
