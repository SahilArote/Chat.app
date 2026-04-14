const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
});

const sendOTP = async (email, otp, username) => {
    const mailOptions = {
        from: `"Pulse Chat" <${config.email.user}>`,
        to: email,
        subject: 'Your verification code — Pulse',
        html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; background: #0c0c0f; color: #f0f0f5; padding: 40px; border-radius: 16px;">
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; background: #7c5cfc; padding: 12px 20px; border-radius: 12px; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
                    Pulse
                </div>
            </div>
            <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">Hi ${username}! 👋</h2>
            <p style="color: #8b8b9e; margin-bottom: 32px; font-size: 15px;">
                Use this code to verify your account. It expires in <strong style="color: #f0f0f5;">10 minutes</strong>.
            </p>
            <div style="background: #1a1a22; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 32px;">
                <div style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #7c5cfc;">
                    ${otp}
                </div>
            </div>
            <p style="color: #55556a; font-size: 13px; text-align: center;">
                If you didn't request this, ignore this email.
            </p>
        </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };