require("dotenv").config();

const nodemailer = require("nodemailer");
const ejs = require("ejs");

async function sendEmail(to, subject, template, data) {
  try {
    const transport = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      secure: true,
      auth: {
        user: "admin@theanimalrepublic.com",
        pass: "theanimalrepublic",
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
