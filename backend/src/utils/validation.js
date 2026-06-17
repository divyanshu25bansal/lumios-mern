import validator from "validator";

export function validateUserData(req) {
  const { firstName, lastName, email, password } =
    req.body.authDetails;

  if (firstName && !firstName?.trim() || lastName && !lastName?.trim()) {
    throw new Error("Please enter a valid name");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email address");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must contain uppercase, lowercase, number, and special character"
    );
  }

  return true;
}