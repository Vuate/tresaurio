// lib/email.ts
// Email service using Resend

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Tresaurio <onboarding@resend.dev>"; // Resend sandbox, sonra kendi domaininle değiştir

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.AUTH_URL}/api/auth/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Tresaurio - E-posta Doğrulama",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0d0f14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #1a1d24 0%, #0d0f14 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">

              <!-- Logo -->
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 700;">Tresaurio</h1>
              </div>

              <!-- Content -->
              <div style="text-align: center;">
                <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 16px 0; font-weight: 600;">E-posta Adresinizi Doğrulayın</h2>
                <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 0 0 32px 0;">
                  Tresaurio hesabınızı aktif etmek için aşağıdaki butona tıklayın.
                </p>

                <!-- Button -->
                <a href="${verifyUrl}" style="display: inline-block; background: #ffffff; color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  E-postamı Doğrula
                </a>

                <p style="color: #6b7280; font-size: 12px; margin-top: 32px; line-height: 1.5;">
                  Bu link 24 saat içinde geçerliliğini yitirecektir.<br>
                  Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı görmezden gelebilirsiniz.
                </p>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 32px; padding-top: 24px; text-align: center;">
                <p style="color: #4b5563; font-size: 11px; margin: 0;">
                  &copy; ${new Date().getFullYear()} Tresaurio. Tüm hakları saklıdır.
                </p>
              </div>

            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

// Generate verification token
export function generateVerificationToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.AUTH_URL}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Tresaurio - Şifre Sıfırlama",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0d0f14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #1a1d24 0%, #0d0f14 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(255,255,255,0.1);">

              <!-- Logo -->
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 700;">Tresaurio</h1>
              </div>

              <!-- Content -->
              <div style="text-align: center;">
                <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 16px 0; font-weight: 600;">Şifrenizi Sıfırlayın</h2>
                <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin: 0 0 32px 0;">
                  Şifrenizi sıfırlamak için aşağıdaki butona tıklayın.
                </p>

                <!-- Button -->
                <a href="${resetUrl}" style="display: inline-block; background: #ffffff; color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  Şifremi Sıfırla
                </a>

                <p style="color: #6b7280; font-size: 12px; margin-top: 32px; line-height: 1.5;">
                  Bu link 1 saat içinde geçerliliğini yitirecektir.<br>
                  Eğer bu isteği siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
                </p>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 32px; padding-top: 24px; text-align: center;">
                <p style="color: #4b5563; font-size: 11px; margin: 0;">
                  &copy; ${new Date().getFullYear()} Tresaurio. Tüm hakları saklıdır.
                </p>
              </div>

            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Password reset email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Password reset email error:", error);
    return { success: false, error };
  }
}
