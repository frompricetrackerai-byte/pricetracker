
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_EMAIL || process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
    },
});

export async function sendWelcomeEmail(email: string, name: string | null) {
    const subject = 'Welcome to Price Tracker AI! 🚀';
    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #6366f1;">Hello ${name || 'there'}!</h2>
            <p>Welcome to <b>Price Tracker AI</b>. We're excited to help you save money on your favorite products.</p>
            <p>Getting started is easy:</p>
            <ul>
                <li>Paste any product link into your dashboard.</li>
                <li>Set your price target.</li>
                <li>Wait for the magic to happen! We'll notify you the moment the price drops.</li>
            </ul>
            <p>If you have any questions, just reply to this email.</p>
            <br />
            <p>Best regards,</p>
            <p><b>The Price Tracker AI Team</b></p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: process.env.SMTP_EMAIL || process.env.SMTP_FROM,
            to: email,
            subject,
            html,
        });
        console.log(`[Email] Welcome email sent to ${email}`);
    } catch (error) {
        console.error('[Email Error] Failed to send welcome email:', error);
    }
}

export async function sendAdminNewUserAlert(userEmail: string, userName: string | null) {
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'admin@example.com').split(',');
    const primaryAdmin = adminEmails[0]; // Send to the first admin in the list

    const subject = 'New User Registered - Price Tracker AI';
    const html = `
        <div style="font-family: sans-serif; padding: 20px; background-color: #f9fafb;">
            <h2 style="color: #1f2937;">New User Alert!</h2>
            <p>A new user has just signed up for Price Tracker AI.</p>
            <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
                <p><b>Name:</b> ${userName || 'N/A'}</p>
                <p><b>Email:</b> ${userEmail}</p>
                <p><b>Time:</b> ${new Date().toLocaleString()}</p>
            </div>
            <p><a href="https://www.pricetracker.store/dashboard/admin" style="color: #6366f1; font-weight: bold;">View in Admin Panel</a></p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: process.env.SMTP_EMAIL || process.env.SMTP_FROM,
            to: primaryAdmin,
            subject,
            html,
        });
        console.log(`[Email] Admin alert sent for new user: ${userEmail}`);
    } catch (error) {
        console.error('[Email Error] Failed to send admin alert:', error);
    }
}
