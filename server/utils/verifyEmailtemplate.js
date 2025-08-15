const verifyEmailTemplate = ({ name, url }) => {
  return `
    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
      <p style="font-size: 16px; margin-bottom: 16px;">
        Dear <strong>${name}</strong>,
      </p>

      <p style="font-size: 15px; margin-bottom: 24px;">
        Thank you for registering with <strong>Bringit</strong>.<br>
        Please click the button below to verify your email address.
      </p>

      <a href="${url}"
         style="color: white;
                background-color: #ff7a00;
                padding: 12px 24px;
                text-decoration: none;
                font-size: 16px;
                font-weight: bold;
                border-radius: 6px;
                display: inline-block;
                margin-bottom: 32px;">
        Verify Email
      </a>

      <p style="font-size: 13px; color: #777; margin-top: 30px;">
        If you did not register with Bringit, please ignore this email.
      </p>

      <p style="font-size: 15px; margin-top: 40px;">
        Thanks,<br>
        <strong>Bringit Team</strong>
      </p>
    </div>
  `;
};

export default verifyEmailTemplate;
