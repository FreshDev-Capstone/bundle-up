import { RegisterData, AuthFormConfig, LoginCredentials } from "../types";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateAuthForm = (
  values: RegisterData | LoginCredentials,
  mode: "signup" | "login",
  config?: AuthFormConfig
): ValidationResult => {
  const errors: Record<string, string> = {};

  // Form validation logic
  if (
    !values.email ||
    !values.password ||
    (mode === "signup" && (!values.firstName || !values.lastName)) ||
    (mode === "signup" && config?.showCompanyName && !values.companyName) ||
    (mode === "signup" && !values.confirmPassword)
  ) {
    errors.form = "Please fill in all fields";
  }

  // Email validation
  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Password validation
  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  }

  // Signup specific validations
  if (mode === "signup") {
    if (!values.firstName?.trim()) {
      errors.firstName = "First name is required";
    }

    if (!values.lastName?.trim()) {
      errors.lastName = "Last name is required";
    }

    // Company name validation for B2B signup only
    if (
      mode === "signup" &&
      config?.showCompanyName &&
      !values.companyName?.trim()
    ) {
      errors.companyName = "Company name is required for business accounts.";
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateEmail = (email: string): boolean => {
  return /\S+@\S+\.\S+/.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateRequired = (value: string | undefined): boolean => {
  return Boolean(value?.trim());
};
