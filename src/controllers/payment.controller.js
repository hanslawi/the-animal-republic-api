// This is your test secret API key.
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY ||
    "sk_test_51Qfe7iIDHHonGOuqLPXxiFOiRDTG3NrEWE4vhWhiuS7KVMZC1xhzegLEcgn7kIFWuZuwxyD72xCdpAqxUf8RZA1N00DekJUS5J"
);

// import models
const Country = require("../models/country.model");
const ShippingFee = require("../models/shippingFee.model");
const Product = require("../models/product.model");
const ProductVariant = require("../models/productVariant.model");
const Order = require("../models/order.model");

// import utils
const email = require("../utils/email");

exports.stripeCreateCheckoutSession = async (req, res, next) => {
  // get items from req.body
  const { items } = req.body;

  const itemsWithShippingClass = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.id).select(
        "_id name shippingClass"
      );

      return { ...product.toObject(), quantity: item.quantity };
    })
  );

  const productsWithItemQuantity = itemsWithShippingClass.sort((a, b) =>
    a.shippingClass.toString().localeCompare(b.shippingClass.toString())
  );

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

  console.log(req.get("origin"));

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
    success_url: `${req.get("origin")}/checkout/success`,
    cancel_url: `${req.get("origin")}/checkout`,
    metadata: {
      orderId: order._id.toString(),
    },
  });

  res.status(201).json({
    status: "SUCCESS",
    data: {
      stripeCheckoutURL: session.url,
      order: { id: order._id },
    },
  });
};

exports.stripeWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_KEY
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  let order;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object;

      // Update order status of checkoutSession.orderId to "Processing"
      order = await Order.findByIdAndUpdate(
        checkoutSession.metadata.orderId,
        { status: "Processing" },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("items.product")
        .populate("items.productVariant");

      const totalNoOfItems = order.items.reduce((accumulator, item) => {
        const _accumulator = accumulator + item.quantity;
        return _accumulator;
      }, 0);

      const data = {
        customerEmailAddress: order.customerEmailAddress,
        customerFirstName: order.customerFirstName,
        customerLastName: order.customerLastName,
        customerAddressLine1: order.customerAddressLine1,
        customerAddressLine2: order.customerAddressLine2,
        customerCity: order.customerCity,
        customerState: order.customerState,
        customerZipCode: order.customerZipCode,
        customerPhone: order.customerPhone,
        paymentMethod: order.paymentMethod,
        orderNo: order._id.toString(),
        totalNoOfItems: totalNoOfItems,
      };

      console.log(data);

      email.sendEmail(
        "realhanslawi@gmail.com",
        "Thank you for your order!",
        "invoiceReceipt",
        {
          data: data,
        }
      );
      break;
      // ... handle other event types
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a res to acknowledge receipt of the event
  res.json({ received: true, data: { order: order } });
};

// PAYPAL

const {
  ApiError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
  PaymentsController,
  PaypalExperienceLandingPage,
  PaypalExperienceUserAction,
  ShippingPreference,
} = require("@paypal/paypal-server-sdk");

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  // timeout: 0,
  environment: Environment.Production,
  // logging: {
  //   logLevel: LogLevel.Info,
  //   logRequest: { logBody: true },
  //   logResponse: { logHeaders: true },
  // },
});

console.log(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

const ordersController = new OrdersController(client);
const paymentsController = new PaymentsController(client);

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
exports.createOrder = async (cart) => {
  // get items from cart
  const { items } = cart;

  const itemsWithShippingClass = await Promise.all(
    items.map(async (item) => {
      const product = await Product.findById(item.id).select(
        "_id name shippingClass"
      );

      return { ...product.toObject(), quantity: item.quantity };
    })
  );

  const productsWithItemQuantity = itemsWithShippingClass.sort((a, b) =>
    a.shippingClass.toString().localeCompare(b.shippingClass.toString())
  );

  // get country from body
  const { country } = cart;

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
        name: `${productVariant.product.name} ${productVariant.attributes[0].value} ${productVariant.attributes[1].value}`,
        unitAmount: {
          currencyCode: "USD",
          value: Number(productVariant.regularPrice).toString(),
        },
        quantity: item.quantity.toString(),
        image_url: productVariant.images[0].fileURL,
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
  } = cart.customer;

  // get payment method from req body

  const { paymentMethod } = cart;

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

  // Update order status of checkoutSession.orderId to "Processing"
  const _order = await Order.findByIdAndUpdate(
    order._id.toString(),
    { status: "Processing" },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("items.product")
    .populate("items.productVariant");

  const totalNoOfItems = _order.items.reduce((accumulator, item) => {
    const _accumulator = accumulator + item.quantity;
    return _accumulator;
  }, 0);

  const data = {
    customerEmailAddress: _order.customerEmailAddress,
    customerFirstName: _order.customerFirstName,
    customerLastName: _order.customerLastName,
    customerAddressLine1: _order.customerAddressLine1,
    customerAddressLine2: _order.customerAddressLine2,
    customerCity: _order.customerCity,
    customerState: _order.customerState,
    customerZipCode: _order.customerZipCode,
    customerPhone: _order.customerPhone,
    paymentMethod: _order.paymentMethod,
    orderNo: _order._id.toString(),
    totalNoOfItems: totalNoOfItems,
  };

  console.log(data);

  email.sendEmail(
    "realhanslawi@gmail.com",
    "Thank you for your order!",
    "invoiceReceipt",
    {
      data: data,
    }
  );

  const collect = {
    body: {
      intent: "CAPTURE",
      purchaseUnits: [
        {
          amount: {
            currencyCode: "USD",
            value: (
              itemsSubtotalAccumulator + shippingFeeAccumulator
            ).toString(),
            breakdown: {
              itemTotal: {
                currencyCode: "USD",
                value: itemsSubtotalAccumulator.toString(),
              },
              shipping: {
                currencyCode: "USD",
                value: shippingFeeAccumulator.toString(),
              },
            },
          },
          invoiceId: order._id.toString(),
          // lookup item details in `cart` from database
          items: lineItems,
        },
      ],
    },
    prefer: "return=minimal",
  };

  try {
    console.log("creating order");
    const { body, ...httpResponse } =
      await ordersController.createOrder(collect);
    console.log("order created.");
    // Get more response info...
    // const { statusCode, headers } = httpResponse;
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      // const { statusCode, headers } = error;
      throw new Error(error.message);
    }
  }
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
exports.captureOrder = async (orderID) => {
  const collect = {
    id: orderID,
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } =
      await ordersController.captureOrder(collect);
    // Get more response info...
    // const { statusCode, headers } = httpResponse;
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      // const { statusCode, headers } = error;
      throw new Error(error.message);
    }
  }
};

exports.paypalWebhook = async (req, res, next) => {
  try {
    const { event_type } = req.body;

    console.log(req.body);

    if (event_type === "PAYMENT.CAPTURE.COMPLETED") {
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
