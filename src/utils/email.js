require("dotenv").config();

const nodemailer = require("nodemailer");
const ejs = require("ejs");

async function sendEmail(to, subject, template, data) {
  try {
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "570e4b61f13745",
        pass: "56b08308c8f255",
      },
    });

    const html = await ejs.renderFile(
      "./src/views/" + template + ".ejs",
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
          filename: "receipt.png",
          path: "./src/assets/receipt.png",
          cid: "receipt@example.com", // same cid value as in the html img src
        },
        {
          filename: "logo.png",
          path: "./src/assets/logo.png",
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

module.exports = { sendEmail };
