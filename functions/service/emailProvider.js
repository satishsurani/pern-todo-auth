const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure the transporter for sending emails using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail', // Email service provider
  auth: {
    user: process.env.EMAIL_USER, // Email address from environment variables
    pass: process.env.EMAIL_PASS, // Email password from environment variables
  },
});

/**
 * Function to send an OTP to the specified email address
 * @param {string} email - The recipient's email address
 * @param {string} otp - The OTP to be sent
 * @returns {Promise<Object>} - Resolves with the email sending status
 * @throws {Error} - Throws an error if email sending fails
 */
const sendOtpToEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender's email address
      to: email, // Recipient's email address
      subject: 'Your Email Verification OTP', // Email subject
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`, // Plain text version of the email
      html: `<b>Your OTP is ${otp}. It will expire in 10 minutes.</b>`, // HTML version of the email
    });

    return info; // Return the result of the email sending process
  } catch (error) {
    console.error('Error occurred while sending email:', error.message);
    throw new Error('Failed to send email.'); // Throw a descriptive error
  }
};

module.exports = { sendOtpToEmail };
