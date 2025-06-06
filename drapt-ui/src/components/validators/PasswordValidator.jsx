export function getPasswordStrength(password) {
  if (!password) return "";
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (/[!@$^&*()_+\-{}\[\],.<>?]/.test(password)) score++;

  if (score <= 2) return "Weak";
  if (score === 3) return "Medium";
  if (score === 4 || score === 5) return "Strong";
  if (score === 6) return "Very Strong";
  return "";
}