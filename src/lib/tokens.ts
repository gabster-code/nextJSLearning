import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";

export function generateVerificationToken() {
  return {
    token: uuidv4(),
    expires: addHours(new Date(), 24), // 24 hours
  };
}

export function generatePasswordResetToken() {
  return {
    token: uuidv4(),
    expires: addHours(new Date(), 1), // 1 hour
  };
}
