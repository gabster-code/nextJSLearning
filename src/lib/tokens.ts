import { v4 as uuidv4 } from "uuid";

export function generateVerificationToken() {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 hours

  return { token, expires };
}

export function generatePasswordResetToken() {
  return {
    token: uuidv4(),
    expires: addHours(new Date(), 1), // 1 hour
  };
}
