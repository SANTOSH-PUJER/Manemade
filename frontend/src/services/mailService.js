import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_qjiad7x';
const TEMPLATE_ID = 'template_00qfms1';
const PUBLIC_KEY = 'HbOERmMSSdUKqZcT0';

/**
 * Sends an OTP email using EmailJS
 * @param {string} toEmail - Recipient's email (stored for reference)
 * @param {string} toName - Recipient's name (for template)
 * @param {string} otp - The 6-digit OTP code
 * @returns {Promise}
 */
export const sendOtpEmail = async (toEmail, toName, otp) => {
  try {
    const templateParams = {
      to_name: toName || toEmail.split('@')[0], // Fallback to email prefix if name not provided
      to_email: toEmail,
      otp: otp,
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    console.log('Email sent successfully!', response.status, response.text);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
