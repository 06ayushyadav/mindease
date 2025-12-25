import nodemailer from "nodemailer";

export const sendEmailtoPatient = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.APP_PASS,
      },
    });

    const mailOptions = {
      from: `"MindEase Team"<${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
