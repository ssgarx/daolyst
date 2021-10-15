// const nodemailer = require("nodemailer");
const SMTPClient = require("emailjs");

module.exports.sendOtpMail = async (otp, email) => {
  const client = new SMTPClient({
    user: "qurate",
    password: "ufbxpnrhbzueyigq",
    host: "smtp.fushiarebel@1627",
    ssl: true,
  });

  try {
    const message = await client.sendAsync({
      text: "Hello world?",
      from: "qurate6@gmail.com",
      to: email,
      cc: "",
      subject: "OTP for Qurate Login/Signup",
      attachment: [
        { data: "<html>i <i>hope</i> this works!</html>", alternative: true },
      ],
    });
    console.log(message);
  } catch (err) {
    console.error(err);
  }

  // send the message and get a callback with an error or details of the message that was sent
  client.send(message, function (err, message) {
    console.log(err || message);
  });

  // you can continue to send more messages with successive calls to 'client.send',
  // they will be queued on the same smtp connection

  // or instead of using the built-in client you can create an instance of 'smtp.SMTPConnection'
};
