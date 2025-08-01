export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // Minimum 8 characters, at least one uppercase, one lowercase, one number, one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

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

export function validatePhoneNumber(phoneNumber: string): boolean {
  // Basic phone number validation (supports various formats)
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ""));
}

export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateLength(
  value: string,
  minLength: number,
  maxLength: number
): boolean {
  const length = value.length;
  return length >= minLength && length <= maxLength;
}

export function validatePositiveNumber(value: any): boolean {
  const num = Number(value);
  return !isNaN(num) && num > 0;
}

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
    !data.product_count ||
    isNaN(Number(data.product_count)) ||
    Number(data.product_count) < 0
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
