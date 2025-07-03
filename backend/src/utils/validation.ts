/**
 * @fileoverview Validation utility functions
 * @description Common validation functions for email, password, and other data types.
 * Provides reusable validation logic for form inputs and API requests.
 */

/**
 * Validates email address format
 * @function validateEmail
 * @description Checks if the provided string is a valid email address format
 *
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid, false otherwise
 *
 * @example
 * const isValid = validateEmail('user@example.com'); // true
 * const isInvalid = validateEmail('invalid-email'); // false
 *
 * @see RFC 5322 for email validation standards
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * @function validatePassword
 * @description Checks if password meets minimum security requirements
 *
 * @param {string} password - Password to validate
 * @returns {boolean} True if password meets requirements, false otherwise
 *
 * @example
 * const isValid = validatePassword('SecurePass123!'); // true
 * const isWeak = validatePassword('123'); // false
 *
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePassword(password: string): boolean {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Validates password with custom requirements
 * @function validatePasswordWithRequirements
 * @description Checks password against customizable requirements
 *
 * @param {string} password - Password to validate
 * @param {Object} requirements - Password requirements
 * @param {number} requirements.minLength - Minimum password length (default: 8)
 * @param {boolean} requirements.requireUppercase - Require uppercase letters (default: true)
 * @param {boolean} requirements.requireLowercase - Require lowercase letters (default: true)
 * @param {boolean} requirements.requireNumbers - Require numbers (default: true)
 * @param {boolean} requirements.requireSpecialChars - Require special characters (default: true)
 * @returns {Object} Validation result with success status and error messages
 *
 * @example
 * const result = validatePasswordWithRequirements('MyPass123', {
 *   minLength: 6,
 *   requireSpecialChars: false
 * });
 *
 * if (result.isValid) {
 *   console.log('Password is valid');
 * } else {
 *   console.log('Password errors:', result.errors);
 * }
 */
export function validatePasswordWithRequirements(
  password: string,
  requirements: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): { isValid: boolean; errors: string[] } {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = requirements;

  const errors: string[] = [];

  // Check minimum length
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  // Check for uppercase letters
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  // Check for lowercase letters
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  // Check for numbers
  if (requireNumbers && !/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  // Check for special characters
  if (requireSpecialChars && !/[@$!%*?&]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (@$!%*?&)"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates phone number format
 * @function validatePhoneNumber
 * @description Checks if the provided string is a valid phone number format
 *
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if phone number format is valid, false otherwise
 *
 * @example
 * const isValid = validatePhoneNumber('+1-555-123-4567'); // true
 * const isInvalid = validatePhoneNumber('not-a-phone'); // false
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  // Basic phone number validation (supports various formats)
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ""));
}

/**
 * Validates URL format
 * @function validateURL
 * @description Checks if the provided string is a valid URL format
 *
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL format is valid, false otherwise
 *
 * @example
 * const isValid = validateURL('https://example.com'); // true
 * const isInvalid = validateURL('not-a-url'); // false
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates that a string is not empty or only whitespace
 * @function validateRequired
 * @description Checks if a string has meaningful content
 *
 * @param {string} value - String to validate
 * @returns {boolean} True if string has content, false otherwise
 *
 * @example
 * const isValid = validateRequired('Hello World'); // true
 * const isEmpty = validateRequired(''); // false
 * const isWhitespace = validateRequired('   '); // false
 */
export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validates string length within specified range
 * @function validateLength
 * @description Checks if string length is within minimum and maximum bounds
 *
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum allowed length
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} True if length is within bounds, false otherwise
 *
 * @example
 * const isValid = validateLength('Hello', 1, 10); // true
 * const tooShort = validateLength('Hi', 5, 10); // false
 * const tooLong = validateLength('Very long string', 1, 5); // false
 */
export function validateLength(
  value: string,
  minLength: number,
  maxLength: number
): boolean {
  const length = value.length;
  return length >= minLength && length <= maxLength;
}

/**
 * Validates that a value is a positive number
 * @function validatePositiveNumber
 * @description Checks if a value is a valid positive number
 *
 * @param {any} value - Value to validate
 * @returns {boolean} True if value is a positive number, false otherwise
 *
 * @example
 * const isValid = validatePositiveNumber(42); // true
 * const isInvalid = validatePositiveNumber(-5); // false
 * const isNotNumber = validatePositiveNumber('abc'); // false
 */
export function validatePositiveNumber(value: any): boolean {
  const num = Number(value);
  return !isNaN(num) && num > 0;
}

/**
 * Validates that a value is within a specified range
 * @function validateRange
 * @description Checks if a numeric value is within minimum and maximum bounds
 *
 * @param {number} value - Number to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} True if value is within range, false otherwise
 *
 * @example
 * const isValid = validateRange(5, 1, 10); // true
 * const tooLow = validateRange(0, 1, 10); // false
 * const tooHigh = validateRange(15, 1, 10); // false
 */
export function validateRange(
  value: number,
  min: number,
  max: number
): boolean {
  return value >= min && value <= max;
}

export const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};

export const validateProductData = (
  data: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Product name must be at least 2 characters long");
  }

  if (
    !data.b2cPrice ||
    isNaN(Number(data.b2cPrice)) ||
    Number(data.b2cPrice) <= 0
  ) {
    errors.push("B2C price must be a positive number");
  }

  if (
    !data.b2bPrice ||
    isNaN(Number(data.b2bPrice)) ||
    Number(data.b2bPrice) <= 0
  ) {
    errors.push("B2B price must be a positive number");
  }

  if (
    !data.eggCount ||
    isNaN(Number(data.eggCount)) ||
    Number(data.eggCount) < 0
  ) {
    errors.push("Egg count must be a non-negative number");
  }

  if (
    data.inventoryByCarton !== undefined &&
    (isNaN(Number(data.inventoryByCarton)) ||
      Number(data.inventoryByCarton) < 0)
  ) {
    errors.push("Inventory by carton must be a non-negative number");
  }

  if (
    data.inventoryByBox !== undefined &&
    (isNaN(Number(data.inventoryByBox)) || Number(data.inventoryByBox) < 0)
  ) {
    errors.push("Inventory by box must be a non-negative number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
