import { transporter } from '../config/mailer.config';
import { envConfig } from '../config/env.config';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendMailOptions) {
  const mailOptions = {
    from: `"Quran App" <${envConfig.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  return await transporter.sendMail(mailOptions);
}

/**
 * OTP Specific Email Template Utility
 */
export async function sendOtpEmail(to: string, otp: string) {
  const subject = 'Your Verification OTP Code';
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Email Verification Code</h2>
      <p>Aapka verification code yeh hai:</p>
      <h1 style="color: #2d6a4f; letter-spacing: 4px;">${otp}</h1>
      <p>Yeh code 5 minutes mein expire ho jayega.</p>
    </div>
  `;

  return await sendEmail({ to, subject, html });
}