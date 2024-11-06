import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.AUTH_URL}/auth/verify?token=${token}`;
  const isDevelopment = process.env.NODE_ENV === "development";

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: isDevelopment ? "gab.jornacion@gmail.com" : email,
      subject: "Verify your email address",
      html: `
        <h1>Verify your email</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${confirmLink}">Verify Email</a>
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
