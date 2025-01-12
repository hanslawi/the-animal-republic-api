// import models
const Country = require("../models/country.model");
const ShippingClass = require("../models/shippingClass.model");
const ShippingFee = require("../models/shippingFee.model");
const Product = require("../models/product.model");
const ProductVariant = require("../models/productVariant.model");
const Order = require("../models/order.model");

// import utils
const AppError = require("../utils/appError");

// This is your test secret API key.
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51Qfe7iIDHHonGOuqLPXxiFOiRDTG3NrEWE4vhWhiuS7KVMZC1xhzegLEcgn7kIFWuZuwxyD72xCdpAqxUf8RZA1N00DekJUS5J"
);

exports.stripeCreateCheckoutSession = async (req, res, next) => {
  // get items from req.body
  const { items } = req.body;

  // get id field from items
  const itemIds = items.map((item) => item.id);

  // get products by item ids
  const products = await Product.find({
    _id: {
      $in: itemIds,
    },
  }).sort({ shippingClass: 1 });

  // add item quantity field to products
  const productsWithItemQuantity = products.map((product) => {
    const { quantity } = items.filter(
      (item) => item.id === product._id.toString()
    )[0];
    return { ...product.toObject(), quantity };
  });

  // get country from body
  const { country } = req.body;

  // get id of country
  const { _id: countryId } = await Country.findOne({ code: country.code });

  // get shipping fees of country
  const shippingFees = await ShippingFee.find({ country: countryId });

  let shippingFeeAccumulator = 0;
  let previousShippingClass;

  productsWithItemQuantity.map((product) => {
    const { firstItem, additionalItem } = shippingFees.filter(
      (el) => el.shippingClass.toString() === product.shippingClass.toString()
    )[0];

    if (previousShippingClass === product.shippingClass.toString()) {
      if (product.quantity > 1)
        shippingFeeAccumulator +=
          Number(additionalItem) * Number(product.quantity);
      else shippingFeeAccumulator += Number(additionalItem);
    } else if (previousShippingClass !== product.shippingClass.toString()) {
      if (product.quantity > 1) {
        // get shipping fee for first item
        shippingFeeAccumulator += Number(firstItem);
        // get shipping fees for additional items
        shippingFeeAccumulator +=
          Number(additionalItem) * (Number(product.quantity) - 1);
      } else if (product.quantity === 1) {
        shippingFeeAccumulator += firstItem;
      }
    }
    previousShippingClass = product.shippingClass.toString();

    return 1;
  });

  let itemsSubtotalAccumulator = 0;
  let orderItems = [];

  const lineItems = await Promise.all(
    items.map(async (item) => {
      // get product variant
      const productVariant = await ProductVariant.findOne({
        _id: item.productVariant._id,
      }).populate("product");

      orderItems = [
        ...orderItems,
        {
          product: productVariant.product._id,
          productVariant: productVariant._id,
          quantity: item.quantity,
        },
      ];

      const lineItem = {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${productVariant.product.name} ${productVariant.attributes[0].value} ${productVariant.attributes[1].value}`,
            images: [productVariant.images[0].fileURL],
          },
          unit_amount_decimal: Number(productVariant.regularPrice) * 100,
        },
        quantity: item.quantity,
      };

      itemsSubtotalAccumulator +=
        Number(item.quantity) * Number(productVariant.regularPrice);

      return lineItem;
    })
  );

  // get customer data from req body
  const {
    emailAddress,
    firstName,
    lastName,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    phone,
  } = req.body.customer;

  // get payment method from req body

  const { paymentMethod } = req.body;

  const order = await Order.create({
    customerEmailAddress: emailAddress,
    customerCountry: country.code,
    customerFirstName: firstName,
    customerLastName: lastName,
    customerAddressLine1: addressLine1,
    customerAddressLine2: addressLine2,
    customerCity: city,
    customerState: state,
    customerZipCode: zipCode,
    customerPhone: phone,
    paymentMethod: paymentMethod,
    items: orderItems,
    itemsSubtotal: itemsSubtotalAccumulator,
    shippingAmount: shippingFeeAccumulator,
    vatAmount: 0,
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: shippingFeeAccumulator * 100,
            currency: "usd",
          },
          display_name: "Standard",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
    ],
    mode: "payment",
    success_url: `http://localhost:5173/checkout/success`,
    cancel_url: `http://localhost:5173/checkout`,
  });

  res.status(201).json({
    status: "SUCCESS",
    data: {
      stripeCheckoutURL: session.url,
      order: { id: order._id },
    },
  });
};
