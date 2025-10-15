import nodemailer from 'nodemailer';
import escapeHtml from 'escape-html';

const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'contact@firstelectric.pro';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

function createTransporter() {
  if (!SMTP_USER || !SMTP_PASSWORD) {
    throw new Error('SMTP credentials not configured');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
}

export async function sendContactEmail({
  name,
  phone,
  email,
  subject,
  message,
}: {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const transporter = createTransporter();
    
    const info = await transporter.sendMail({
      from: `"First Electric" <${SMTP_USER}>`,
      to: BUSINESS_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    });

    return { success: true, data: info };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

export async function sendBookingConfirmation({
  name,
  email,
  serviceType,
  servicePrice,
  dateTime,
  address,
  referralSource,
}: {
  name: string;
  email: string;
  serviceType: string;
  servicePrice?: string;
  dateTime: string;
  address?: string;
  referralSource?: string;
}) {
  try {
    const transporter = createTransporter();
    
    // Map referral source codes to readable labels
    const referralLabels: Record<string, string> = {
      google: 'Google Search',
      yelp: 'Yelp',
      facebook: 'Facebook',
      instagram: 'Instagram',
      referral: 'Referral from friend/family',
      nextdoor: 'Nextdoor',
      repeat: 'Repeat customer',
      other: 'Other',
    };
    
    const info = await transporter.sendMail({
      from: `"First Electric" <${SMTP_USER}>`,
      to: email,
      subject: 'Booking Confirmation - First Electric',
      html: `
        <h2>Your Appointment is Confirmed</h2>
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thank you for choosing First Electric! We've received your booking request for:</p>
        <ul>
          <li><strong>Service:</strong> ${escapeHtml(serviceType)}</li>
          ${servicePrice ? `<li><strong>Price:</strong> ${escapeHtml(servicePrice)}</li>` : ''}
          <li><strong>Date & Time:</strong> ${escapeHtml(dateTime)}</li>
          ${address ? `<li><strong>Service Address:</strong> ${escapeHtml(address)}</li>` : ''}
          ${referralSource ? `<li><strong>How you heard about us:</strong> ${escapeHtml(referralLabels[referralSource] || referralSource)}</li>` : ''}
        </ul>
        <p>We look forward to serving you! A calendar invite has been sent to this email address.</p>
        <p>If you have any questions or need to reschedule, call us at <a href="tel:6572396331">(657) 239-6331</a></p>
        <p>Best regards,<br>First Electric Team<br>License #1120441</p>
      `,
    });

    return { success: true, data: info };
  } catch (error) {
    console.error('Confirmation email error:', error);
    return { success: false, error };
  }
}
