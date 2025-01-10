const mongoose = require("mongoose");
const slugify = require("slugify");

const shippingClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
  },
});

shippingClassSchema.pre("save", function (next) {
  if (this.name) this.slug = slugify(this.name, { lower: true });
  next();
});

const ShippingClass = mongoose.model("ShippingClass", shippingClassSchema);

module.exports = ShippingClass;
