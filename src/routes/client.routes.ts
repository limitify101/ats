import express from "express";
import ClientService from "../services/ClientService";
import extractTenantId from "../middleware/extractTenantID";
import handleClient from "../controllers/client/handleClient";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const clientRoutes = (sequelize: any, model: any) => {
  const router = express.Router();
  const clientService = new ClientService(model);

  router.post(
    "/create",
    extractTenantId,
    handleClient(sequelize, clientService)
  );
  router.post("/send-email", async (req: any, res: any) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      // Create transporter with your email service credentials
      const transporter = nodemailer.createTransport({
        service: "gmail", // Use your email service (e.g., Gmail, Outlook)
        auth: {
          user: process.env.APP, // Replace with your email
          pass: process.env.APP_PASS, // Replace with your email password or app-specific password
        },
      });

      // Mail options
      const mailOptions = {
        from: email, // Sender's email
        to: process.env.APP, // Replace with the email where you want to receive subscription requests
        subject: "New Subscription Request",
        text: `You have a new subscription request from: ${email}`,
      };

      // Send email
      await transporter.sendMail(mailOptions);

      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Failed to send email" });
    }
  });
  return router;
};

export default clientRoutes;
