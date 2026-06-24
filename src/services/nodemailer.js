import nodemailer from "nodemailer";
import { email } from "zod";

export const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jayne.schuppe@ethereal.email',
        pass: 'h4kQHkweHAW9hVmn8Y'
    }
});

export const sendEmail = async (
    to,
    subject,
    html
  ) => {
    await transporter.sendMail({
      from: process.env.gmail,
      to,
      subject,
      html,
    });
  };

  export const welcomeEmail = (email) => {
        return sendEmail(email,"welcome to library")
  }
const otpStore = new Map();

export const sendOTP = async (email) => {

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    otpStore.set(email, otp);

    await sendEmail(
        email,
        "Email Verification",
        `<h2>Your OTP is ${otp}</h2>`
    );

    return true;
};

export const verifyOTP = (email, otp) => {
    const storedOTP = otpStore.get(email);

    return storedOTP === otp;
};