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
        from: process.env.APP, // Sender's email
        to: email, // Replace with the recipient's email
        subject: "Subscription Request",
        html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Subscription Email</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 150px;
        height: auto;
      }
      .banner {
        text-align: center;
        margin-bottom: 20px;
      }
      .banner img {
        max-width: 100%;
        border-radius: 5px;
        height: auto;
      }
      .content {
        padding: 20px;
        text-align: center;
      }
      .content h1 {
        color: #333333;
        margin-bottom: 15px;
      }
      .content p {
        color: #666666;
        line-height: 1.6;
        margin: 10px 0;
      }
      .button {
        display: inline-block;
        padding: 12px 25px;
        margin-top: 20px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
      }
      .button:hover {
        background-color: #0056b3;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #999999;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Logo Section -->
      <div class="logo">
        <img src="https://i.postimg.cc/BQZsxqPj/logo.png" alt="Logo" />
      </div>
      <!-- Banner Section -->
      <div class="banner">
        <img src="https://i.postimg.cc/DfDfvHwW/ATS-Banner.png" alt="Banner" />
      </div>
      <!-- Main Content -->
      <div class="content">
        <h1>Thank You for Subscribing to <span>ATS</span></h1>
        <p>Dear Subscriber,</p>
        <p>
          We are thrilled to have you onboard. Your subscription request from
          <span
            id="sender-email"
            style="font-style: italic; font-weight: 700; color: #0056b3"
      >${email}</span
          >
          has been successfully received and our team is currently reviewing it.
          A member of the LIMITIFY team will be in contact with you shortly to
          assist with the next steps and answer any questions you may have. We
          look forward to supporting your needs and helping you achieve your
          goals with our innovative solutions!
        </p>
        <p>Best Regards,</p>
        <p>The LIMITIFY Team</p>
      </div>
      <!-- Footer Section -->
      <div class="footer">
        <p>
          &copy; <span id="current-year"></span> LIMITIFY. All rights reserved.
        </p>
      </div>
    </div>
    <script>
      // Dynamically update the current year
      document.getElementById("current-year").textContent =
        new Date().getFullYear();
    </script>
  </body>
</html>`,
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
