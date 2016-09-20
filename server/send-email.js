const nodemailer = require("nodemailer");
const log = require("./log");
const config = require("./config");
const password = process.env.PUMP_EMAIL_PASSWORD;

const controllerEmail = config.get("controllerEmail");
const emailList = config.get("emailList");

// if address/password/recipients aren't provided, disable email support
if(password && controllerEmail && emailList && emailList.length) {
  const transporter = nodemailer.createTransport(`smtps://${controllerEmail}:${password}@smtp.gmail.com`);

  module.exports = function sendEmail(subject, text="") {
    const options = {
      from: `"Pump Controller" <${controllerEmail}>`,
      to: emailList,
      subject: `OIMB Pumps: ${subject}`,
      text
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(options, (error, response) => {
        if(error) {
          console.log(`Failed to send email: ${error}`);
          reject(error);
        } else {
          resolve(response);
        }
      });
    })
  }
} else {
  module.exports = () => Promise.resolve();
}
