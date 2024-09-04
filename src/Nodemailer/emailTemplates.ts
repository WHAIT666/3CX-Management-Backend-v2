export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #000000; /* Black background for the entire email */
      margin: 0;
      padding: 0;
      color: #ffffff;
      width: 100%;
    }
    .email-container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #1e1e1e; /* Dark card background */
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      text-align: center;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      background: #FFA500; /* Orange gradient background */
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      color: #ffffff;
      font-size: 24px;
      margin: 0;
    }
    .content {
      background-color: #2b2b2b; /* Slightly lighter black for content */
      padding: 20px;
      border-radius: 0 0 8px 8px;
    }
    .content p {
      color: #cccccc;
      margin: 0 0 10px;
    }
    .verification-code {
      font-size: 32px;
      font-weight: bold;
      letter-spacing: 5px;
      color: #FFA500; /* Orange text for the verification code */
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #777777;
      font-size: 12px;
    }
    .footer p {
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header section -->
    <div class="header">
      <h1>Verify Your Email</h1>
    </div>
    
    <!-- Content section -->
    <div class="content">
      <p>Hello,</p>
      <p>Thank you for signing up! Your verification code is:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span class="verification-code">{verificationCode}</span>
      </div>
      <p>Enter this code on the verification page to complete your registration.</p>
      <p>This code will expire in 15 minutes for security reasons.</p>
      <p>If you didn't create an account with us, please ignore this email.</p>
      <p>Best regards,<br>Techbase Team</p>
    </div>

    <!-- Footer section -->
    <div class="footer">
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;


export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #000000; /* Black background for the entire email */
      margin: 0;
      padding: 0;
      color: #ffffff;
      width: 100%;
    }
    .email-container {
      width: 100%;
      margin: 0 auto;
      background-color: #1e1e1e; /* Dark card background */
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      text-align: center;
    }
    .header {
      text-align: center;
      padding: 20px 0;
    }
    .header img {
      height: 50px; /* Adjusted image height */
    }
    .header h1 {
      color: #FF8800;
      font-size: 24px;
      margin: 0;
    }
    .content {
      background-color: #2b2b2b;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .content p {
      color: #cccccc;
      margin: 0 0 10px;
    }
    .content a {
      display: inline-block;
      padding: 12px 25px;
      background-color: #FFA500;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
      font-weight: bold;
    }
    .content a:hover {
      background-color: #ff8800;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #777777;
      font-size: 12px;
    }
    .footer p {
      margin: 0;
    }
    .logo {
      color: #FFA500;
      font-size: 16px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="email-container" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #1e1e1e; border-radius: 8px; padding: 30px;">
    <!-- Add the logo here -->
    <div class="header">
      <img src="https://yourpublicdomain.com/techbase.png" alt="Techbase Logo" />
      <h1>FORGOT PASSWORD</h1>
    </div>
    <div class="content" style="background-color: #2b2b2b; padding: 20px; border-radius: 8px;">
      <p>Hello {name},</p>
      <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
      <p>To reset your password, click the button below:</p>
      <a href="{resetURL}">RESET PASSWORD</a>
      <p>This link will expire in 1 hour for security reasons.</p>
    </div>
    <div class="footer">
      <!-- Add the second image (bottom logo) here -->
      <img src="https://yourpublicdomain.com/footer-logo.png" alt="Techbase Team Logo" />
      <p>Thank you,</p>
      <p class="logo">Techbase Team</p>
    </div>
  </div>
</body>
</html>
`;

