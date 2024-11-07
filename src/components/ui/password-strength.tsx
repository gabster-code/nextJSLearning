"use client";

import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const calculateStrength = () => {
    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character type checks
    if (/[a-z]/.test(password)) score++; // lowercase
    if (/[A-Z]/.test(password)) score++; // uppercase
    if (/[0-9]/.test(password)) score++; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score++; // special characters

    return score;
  };

  const strength = calculateStrength();
  const percentage = (strength / 6) * 100;

  const getStrengthText = () => {
    if (strength <= 2) return "Weak";
    if (strength <= 4) return "Medium";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-2">
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300",
            getStrengthColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p
        className={cn(
          "text-sm",
          strength <= 2
            ? "text-red-500"
            : strength <= 4
            ? "text-yellow-500"
            : "text-green-500"
        )}
      >
        Password Strength: {getStrengthText()}
      </p>
    </div>
  );
}
