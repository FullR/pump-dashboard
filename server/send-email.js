const nodemailer = require("nodemailer");
const {controllerEmail, emailList} = require("../config");
const password = process.env.PUMP_EMAIL_PASSWORD;
const log = require("./log");

const transporter = nodemailer.createTransport(`smtps://${controllerEmail}:${password}@smtp.gmail.com`);

function sendEmail(subject, text) {
  const options = {
    from: `"Pump Controller" <${controllerEmail}>`,
    to: emailList,
    subject,
    text
  };

  transporter.sendMail(options, (error) => {
    if(error) {
      log.error(`Failed to send email: ${error}`);
    }
  });
}
