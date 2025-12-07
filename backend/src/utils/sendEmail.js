import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // app password in production
      },
    });

    const verifyUrl = `${process.env.BACKEND_URL || "http://localhost:4000"}/users/verify/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email for Chatbot App",
      html: `<p>Click to verify your email: <a href="${verifyUrl}">Verify Email</a></p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("sendVerificationEmail error:", err);
    throw err;
  }
};
