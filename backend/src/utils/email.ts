import nodemailer from "nodemailer";

export const sendMail = (otp: number, email: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS,
      },
    } as any);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "MindEase - Reset OTP For Password ",
      html: `<div style="font-family:sans-serif;">
               <h3>Your OTP Code</h3>
               <p style="font-size:20px; font-weight:bold; color:#4CAF50;">${otp}</p>
             </div>`
    };

    transporter.sendMail(mailOptions, (err: Error, info: any) => {
      if (err) {
        throw new Error("Error sending email: " + err.message);
      }
    });
  } catch (error) {
    console.error("Error in sendMail:", error);
    throw new Error("Failed to send email");
  }
};
