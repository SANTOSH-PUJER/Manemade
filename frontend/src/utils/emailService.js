import emailjs from '@emailjs/browser';

/**
 * Send OTP via EmailJS
 */
export const sendOTPEmail = async (userEmail, otpCode) => {
  const templateParams = {
    to_email: userEmail,
    otp_code: otpCode,
    message: `Your Mane Made verification code is: ${otpCode}`
  };

  const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_qjiad7x',
    TEMPLATE_ID: 'template_1egdsk8',
    PUBLIC_KEY: 'HbOERmMSSdUKqZcT0',
  };

  try {
    return await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
  } catch (error) {
    console.error('EmailJS Error:', error);
    throw error;
  }
};

/**
 * Generate 6-digit OTP
 */
export const generateLocalOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
