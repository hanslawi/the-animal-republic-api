// import library
const mongoose = require("mongoose");
const slugify = require("slugify");

// import model
const ProductVariant = require("./productVariant.model");

// import data
const { prices } = require("../data/prices");

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
  slug: { type: String, unique: true },
  category: { type: mongoose.Schema.ObjectId, ref: "Category" },
  subcategory: { type: mongoose.Schema.ObjectId, ref: "SubCategory" },
  swiperSliderImageFilename: { type: String },
  featured: { type: Boolean, default: false },
  shippingClass: { type: mongoose.Schema.ObjectId, ref: "ShippingClass" },
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

productSchema.method(
  "_generateProductVariants",
  async function _generateProductVariants() {
    // check if there's existing PRODUCT VARIANTS then delete
    await ProductVariant.deleteMany({ product: this.id });

    const productVariants = [];

    // get first element of attributes
    const firstAttribute = this.attributes[0];

    // get name and values of first attribute
    const { name: name1, values: values1 } = firstAttribute;

    // iterate values
    await Promise.all(
      values1.map(async (el1) => {
        // get second element of attributes
        const secondAttribute = this.attributes[1];

        // get name and values of second attribute
        const { name: name2, values: values2 } = secondAttribute;

        // iterate values
        await Promise.all(
          await values2.map(async (el2) => {
            // create PRODUCT VARIANT
            const productVariant = await ProductVariant.create({
              product: this.id,
              attributes: [
                { name: name1, value: el1 },
                { name: name2, value: el2 },
              ],
              regularPrice: prices[this.category.name][el2],
              images: [
                {
                  altText: `${this.name} ${el1}`,
                  fileURL: this.images.filter((image) =>
                    image.altText.includes(el1)
                  )[0].fileURL,
                },
              ],
            });

            // push PRODUCT VARIANT to array
            productVariants.push(productVariant);
          })
        );
      })
    );

    return productVariants;
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
