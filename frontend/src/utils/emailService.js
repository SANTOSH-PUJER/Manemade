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

  try {
    return await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      templateParams,
      'YOUR_PUBLIC_KEY'
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
