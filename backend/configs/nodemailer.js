import nodemailer from "nodemailer";

//Create a test account or replace with real credentials.

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
