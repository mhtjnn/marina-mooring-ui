import { EMAIL_REGEX, PASSWORD_REGEX, NAME_REGEX } from './RegexUtils'

// Function to validate an email address.
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
}

// Function to validate a password.
export const isValidPassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password);
}

// Function to validate a name.
export const isValidName = (name: string): boolean => {
  return NAME_REGEX.test(name);
}
// Function to validate user credentials.
export const validateUserCredentials = (
  email: string,
  password: string,
  name: string,
): string | null => {
  if (!isValidEmail(email)) {
    return 'Email is not valid';
  }

  if (!isValidPassword(password)) {
    return 'Password is not valid';
  }

  if (!isValidName(name)) {
    return 'Name is not valid';
  }

  return null;
}
