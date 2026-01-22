import nodemailer from "nodemailer";

/**
 * Configure email transporter
 * Note: Use app-specific password for Gmail or similar secured services
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Send password reset email
 * @param email - Recipient email address
 * @param resetUrl - Absolute URL for the password reset page
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string,
) => {
  const mailOptions = {
    from:
      process.env.EMAIL_FROM ||
      '"Student Finance" <noreply@studentfinance.com>',
    to: email,
    subject: "Reset Your Password - Student Finance",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #2d3748; text-align: center;">Password Reset Request</h2>
        <p style="color: #4a5568; font-size: 16px;">Hello,</p>
        <p style="color: #4a5568; font-size: 16px;">We received a request to reset your password for your Student Finance account. Click the button below to proceed:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Reset Password</a>
        </div>
        <p style="color: #4a5568; font-size: 14px;">If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #718096; font-size: 12px; text-align: center;">Student Finance App &copy; 2026</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending reset email:", error);
    // Don't throw here in development to avoid breaking the flow,
    // but in production you might want to handle this more strictly
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
    return null;
  }
};
