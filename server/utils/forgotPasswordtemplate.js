const forgotPasswordTemplate = ({ name, otp }) => {
  return `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
    <p style="font-size: 16px;">Dear <strong>${name}</strong>,</p>

    <p style="font-size: 15px; line-height: 1.5;">
      You requested a password reset.<br>
      Please use the following OTP to reset your password:
    </p>

    <div style="margin: 20px 0; padding: 12px; background-color: #e0f7fa; font-size: 24px; text-align: center; font-weight: bold; letter-spacing: 4px; border-radius: 6px; color: #00796b;">
      ${otp}
    </div>

    <p style="font-size: 14px; line-height: 1.5;">
      This OTP is valid for <strong>1 hour</strong>.<br>
      Enter this code on the <strong>Bringit</strong> website to reset your password.
    </p>

    <p style="margin-top: 40px; font-size: 15px;">Thanks,<br><strong>Bringit Team</strong></p>
  </div>
  `;
};

export default forgotPasswordTemplate