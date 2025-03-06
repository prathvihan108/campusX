import nodemailer from "nodemailer";

export const sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "campusX <prathvijnk@gmail.com>",
    to: email,
    subject: "CampusX OTP Verification",
    text: `Your OTP is ${otp}. This OTP will expire in 10 minutes.`,
  };

  console.log("Trying to send email to:", email);

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully send otp file");
  } catch (error) {
    console.log("Email Error:", error);
  }

  console.log("OTP sent successfully send otp file");
};
