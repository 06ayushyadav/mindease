
import { sendEmailtoPatient } from "../../utils/sendEmaitoPatient"
import Email from "../../models/counselor/sendEmail";

export const sendEmail = async (req,res) => {
  try {
    const {patientEmail, subject, message } = req.body;
    const counselorId=req.Counselor?._id

    if (!patientEmail || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }
    await sendEmailtoPatient(patientEmail,subject,message)
    const newEmail = await Email.create({
      counselorId,
      patientEmail,
      subject,
      message,
      status: "sent",
    });

    res.status(200).json({
      success: true,
      message: "Email sent successfully!",
      data: newEmail,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    await Email.create({
      counselorId: req.body.counselorId,
      patientEmail: req.body.patientEmail,
      subject: req.body.subject,
      message: req.body.message,
      status: "failed",
    });

    res.status(500).json({
      success: false,
      error: "Failed to send email. Please try again later.",
    });
  }
};

export const getEmailsByCounselor = async (req, res) => {
  try {
    const emails = await Email.find({ counselorId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch emails" });
  }
};
