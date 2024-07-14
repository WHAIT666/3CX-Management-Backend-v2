export default {
  port: 3000,
  dbUri: "mongodb+srv://andre:andre@cluster0.g60d601.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  logLevel: "info",
  accessTokenPrivateKey: "",
  accessTokenPublicKey: "",
  refreshTokenPrivateKey: "",
  refreshTokenPublicKey: "",
  smtp: {
    user: process.env.SMTP_USER || "ru6xrpubqncf6b3r@ethereal.email",
    pass: process.env.SMTP_PASS || "8Kq95YKPmQRGmAXrBN",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
  },
};
