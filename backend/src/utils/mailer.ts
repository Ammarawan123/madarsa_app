import { transporter } from '../config/mail';

export async function sendOtpEmail(toEmail: string, otp: string) {
  await transporter.sendMail({
    from: `"Madarsa App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your Login OTP Code',
    html: `<h3>Your OTP code is: <b>${otp}</b></h3>`,
  });
}