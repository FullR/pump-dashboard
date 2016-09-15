const nodemailer = require("nodemailer");
const {controllerEmail, emailList} = require("../config");
const password = process.env.PUMP_EMAIL_PASSWORD;

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
