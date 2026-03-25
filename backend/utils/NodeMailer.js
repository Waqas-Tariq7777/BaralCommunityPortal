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

// ✅ Existing: Login Notification
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

        <p>Thank you for being a valued member of the Baral Community.</p>

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

// ✅ Existing: Complaint Confirmation
export const sendComplaintConfirmation = async (toEmail) => {
  const mailOptions = {
    from: `"Baral Community WAPDA Management" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Complaint Received – Baral Community Portal",
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Complaint Received</h2>
        <p>Your complaint has been received successfully.</p>
        <p>Please wait for our confirmation.</p>
        <br/>
        <p>Regards,<br/>Baral Community WAPDA Management</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Existing: Reset Password Email
export const sendResetPasswordEmail = async (toEmail, resetLink) => {
  const mailOptions = {
    from: `"Baral Community WAPDA Management" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial; line-height:1.6">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>Click below link to reset:</p>

        <a href="${resetLink}" 
           style="background:#748dff;color:white;padding:10px 15px;border-radius:5px;text-decoration:none;">
           Reset Password
        </a>

        <p>This link will expire in 15 minutes.</p>

        <br/>
        <p>Regards,<br/>Baral Community</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ✅ NEW: Guest Message Confirmation
export const sendGuestMessageConfirmation = async (toEmail, guestName = "Guest") => {
  const mailOptions = {
    from: `"Baral Community WAPDA Management" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Message Received – Baral Community Portal",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #1d4ed8;">Thank You for Contacting Us</h2>

        <p>Dear ${guestName},</p>

        <p>
          We have received your message successfully. Our team will review it and get back to you as soon as possible.
        </p>

        <p>
          <strong>Submission Time:</strong> ${new Date().toLocaleString()}
        </p>

        <p>
          Thank you for reaching out to the Baral Community WAPDA Management System.
        </p>

        <br />

        <p style="font-size: 14px; color: #555;">
          Regards,<br />
          <strong>Baral Community WAPDA Management</strong><br />
          Official Community Portal
        </p>

        <hr style="margin-top: 20px;" />

        <p style="font-size: 12px; color: #777;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Guest confirmation email sent: ", info.response);
  } catch (err) {
    console.error("Error sending guest confirmation email: ", err);
  }
};
  // ✅ NEW: Complaint Status Update Notification
export const sendStatusUpdateEmail = async (toEmail, userName = "Resident", status) => {
  const mailOptions = {
    from: `"Baral Community WAPDA Management" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Complaint Status Updated – Baral Community Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #1d4ed8;">Complaint Status Update</h2>

        <p>Dear ${userName},</p>

        <p>
          The status of your complaint has been updated.
        </p>

        <p>
          <strong>Current Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}
        </p>

        <p>
          You can login to the community portal to see more details.
        </p>

        <br />

        <p style="font-size: 14px; color: #555;">
          Regards,<br />
          <strong>Baral Community WAPDA Management</strong><br />
          Official Community Portal
        </p>

        <hr style="margin-top: 20px;" />

        <p style="font-size: 12px; color: #777;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Status update email sent: ", info.response);
  } catch (err) {
    console.error("Error sending status update email: ", err);
  }
};

// ✅ NEW: Complaint Resolved Notification with Resources
export const sendResolvedComplaintEmail = async (toEmail, userName = "Resident", resources = []) => {
  const resourcesList = resources.map(r => `<li>${r.name} - PKR ${r.cost}</li>`).join("");

  const mailOptions = {
    from: `"Baral Community WAPDA Management" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Complaint Resolved – Baral Community Portal`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #1d4ed8;">Your Complaint Has Been Resolved</h2>

        <p>Dear ${userName},</p>

        <p>
          We are pleased to inform you that your complaint has been resolved. 
        </p>

        <p><strong>Resources Used:</strong></p>
        <ul>
          ${resourcesList}
        </ul>

        <p>
          You can login to the community portal to see more details and track any future complaints.
        </p>

        <br />

        <p style="font-size: 14px; color: #555;">
          Regards,<br />
          <strong>Baral Community WAPDA Management</strong><br />
          Official Community Portal
        </p>

        <hr style="margin-top: 20px;" />

        <p style="font-size: 12px; color: #777;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Resolved complaint email sent: ", info.response);
  } catch (err) {
    console.error("Error sending resolved complaint email: ", err);
  }
};