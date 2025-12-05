import nodemailer from "nodemailer";

//Creating an email testing account .

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export default transporter;
