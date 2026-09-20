import nodemailer from 'nodemailer';
import { envConfig } from './env.config';

export const transporter = nodemailer.createTransport({
  host: envConfig.EMAIL_HOST,
  port: envConfig.EMAIL_PORT,
  secure: envConfig.EMAIL_PORT === 465, // 465 port ke liye true, 587 ke liye false
  auth: {
    user: envConfig.EMAIL_USER,
    pass: envConfig.EMAIL_PASS,
  },
});

export const mailOptionsDefaults = {
  from: `"madarsa  App" <${envConfig.EMAIL_USER}>`,
};
