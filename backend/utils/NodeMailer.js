import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // true if port 465 (SSL)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendLoginNotification = async (toEmail, userName) => {
    const mailOptions = {
        from: `"Baral Community WAPDA Management" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Login Alert – Baral Community Portal",
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #1d4ed8;">Welcome to Baral Community Portal</h2>

        <p>Dear ${userName || "Resident"},</p>

        <p>
          This is to inform you that your account was successfully logged in to the
          <strong>Baral Community WAPDA Management System</strong>.
        </p>

        <p>
          <strong>Login Time:</strong> ${new Date().toLocaleString()}
        </p>

        <p>
          If this login was performed by you, no further action is required.
          However, if you do not recognize this activity, please change your
          password immediately or contact the community administration.
        </p>

        <p>
          Thank you for being a valued member of the Baral Community.
        </p>

        <br />

        <p style="font-size: 14px; color: #555;">
          Regards,<br />
          <strong>Baral Community WAPDA Management</strong><br />
          Official Community Portal
        </p>

        <hr style="margin-top: 20px;" />

        <p style="font-size: 12px; color: #777;">
          This is an automated security notification. Please do not reply to this email.
        </p>
      </div>
    `,
    };


    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
    } catch (err) {
        console.error("Error sending email: ", err);
    }
};
