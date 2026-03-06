interface OTPTemplateOptions {
  otp: string;
  type: 'SIGNUP' | 'PASSWORD_RESET';
  expiryMinutes?: number;
}

export function getOTPTemplate(options: OTPTemplateOptions): string {
  const { otp, type, expiryMinutes = 10 } = options;

  const title = type === 'SIGNUP' ? 'Verify Your Email' : 'Reset Your Password';
  const heading = type === 'SIGNUP' ? 'Welcome to AwaazAI!' : 'Password Reset Request';
  const message =
    type === 'SIGNUP'
      ? 'Use the OTP below to verify your email address and complete your registration.'
      : 'Use the OTP below to reset your password. If you did not request this, please ignore this email.';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 480px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #e4e4e7;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #6366f1;">AwaazAI</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #18181b;">${heading}</h2>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #52525b;">${message}</p>

              <!-- OTP Box -->
              <div style="background-color: #f4f4f5; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: 500; color: #71717a; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                <p style="margin: 0; font-size: 36px; font-weight: 700; color: #18181b; letter-spacing: 8px; font-family: monospace;">${otp}</p>
              </div>

              <!-- Expiry Notice -->
              <p style="margin: 0; font-size: 13px; color: #71717a; text-align: center;">
                This code will expire in <strong style="color: #18181b;">${expiryMinutes} minutes</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #fafafa; border-top: 1px solid #e4e4e7; border-radius: 0 0 12px 12px;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #a1a1aa; text-align: center;">
                If you didn't request this email, you can safely ignore it.
              </p>
              <p style="margin: 0; font-size: 12px; color: #a1a1aa; text-align: center;">
                &copy; ${new Date().getFullYear()} AwaazAI. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
