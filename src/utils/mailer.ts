import nodemailer, { SendMailOptions } from "nodemailer";
import log from "./logger";

const smtp = {
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
};

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: smtp.secure, // true for 465, false for other ports
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});

async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, "Error sending email");
      return;
    }
    log.info(`Message sent: ${info.messageId}`);
  });
}

export default sendEmail;
