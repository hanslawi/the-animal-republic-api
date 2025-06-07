require("dotenv").config();

const nodemailer = require("nodemailer");
const ejs = require("ejs");
const Order = require("./src/models/order.model");

const transport = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: "admin@theaimalrepublic.com",
    pass: "theanimalrepublic",
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
