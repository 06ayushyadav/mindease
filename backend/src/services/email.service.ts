import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const brand = process.env.APP_NAME || "MindEase";
  const html = `
    <h2>${brand} Password Reset</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 15 minutes.</p>
  `;

  console.log(resetUrl);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"${brand}"<no-reply@mindease.app>`,
    to,
    subject: `${brand} Password Reset`,
    html,
  });
}
