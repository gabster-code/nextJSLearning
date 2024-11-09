import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;
  const isDevelopment = process.env.NODE_ENV === "development";

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: isDevelopment ? "gab.jornacion@gmail.com" : email,
      subject: "Verify your email address",
      html: `
        <h1>Verify your email</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verifyUrl}">Verify Email</a>
        ${isDevelopment ? `<p>Original recipient: ${email}</p>` : ""}
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Failed to send email");
    }

    console.log("Email sent:", data);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  const isDevelopment = process.env.NODE_ENV === "development";

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: isDevelopment ? "gab.jornacion@gmail.com" : email,
      subject: "Reset your password",
      html: `
        <h1>Reset your password</h1>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetUrl}">Reset Password</a>
        ${isDevelopment ? `<p>Original recipient: ${email}</p>` : ""}
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Failed to send email");
    }

    console.log("Reset email sent:", data);
  } catch (error) {
    console.error("Failed to send reset email:", error);
    throw new Error("Failed to send reset email");
  }
}
