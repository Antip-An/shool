const nodemailer = require("nodemailer")

/**
 * 
 * @param {string} mailReceiver 
 * @param {string} mailSubject 
 * @param {string} mailText 
 * @param {string} htmlText 
 */
// async..await is not allowed in global scope, must use a wrapper
module.exports = async function main(mailReceiver, mailSubject, mailText, htmlText) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "<Hogwarts@example.com>", // sender address
    to: mailReceiver, // list of receivers
    subject: mailSubject, // Subject line
    text: mailText, // plain text body
    html: htmlText, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main(
//   "Hogwarts@example.com",
//   "Регистрация пользователя",
//   "##Hello world?",
//   "<b>Hello world!</b>"
// ).catch(console.error);
