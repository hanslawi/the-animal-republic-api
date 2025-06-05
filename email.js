require("dotenv").config();

const nodemailer = require("nodemailer");
const ejs = require("ejs");
const Order = require("./src/models/order.model");

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "570e4b61f13745",
    pass: "56b08308c8f255",
  },
});

async function sendEmail(to, subject, template, data) {
  try {
    const html = await ejs.renderFile(
      __dirname + "/src/views/" + template + ".ejs",
      data,
      { async: true }
    );

    const mailOptions = {
      from: "admin@theanimalrepublic.com",
      to,
      subject,
      html,
      attachments: [
        {
          filename: "logo.png",
          path: "./path/to/logo.png",
          cid: "logo@example.com", // same cid value as in the html img src
        },
      ],
    };

    await transport.sendMail(mailOptions);

    console.log("Message sent successfully!");
  } catch (err) {
    console.log("Error: ", err);
  }
}

(async () => {
  try {
    const order = await Order.findById("683ea774083d1879dc77cbff")
      .populate("items.product")
      .populate("items.productVariant");

    sendEmail(
      "realhanslawi@gmail.com",
      "Thank you for your order!",
      "invoiceReceipt",
      {
        order: order,
      }
    );
  } catch (err) {
    console.log(err);
  }
})();

// sendEmail('email@domain.com', 'Dynamic Email Template with EJS', 'anotherMessage', { accessCode: '123456' })
