import { useState } from "react";
import { RegisterData, AuthFormConfig } from "../types";
import { validateAuthForm } from "../utils/validators";

export interface UseAuthFormOptions {
  mode: "login" | "signup";
  onSubmit: (values: RegisterData) => void;
  initialValues?: Partial<RegisterData>;
  loading?: boolean;
  error?: string | null;
  config?: AuthFormConfig;
}

export const useAuthForm = ({
  mode,
  onSubmit,
  initialValues = {},
  loading = false,
  error = null,
  config,
}: UseAuthFormOptions) => {
  const [values, setValues] = useState<RegisterData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
    companyName: "", // Add company name field
    ...initialValues,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleChange = (field: keyof RegisterData, value: string) => {
    setValues((prev: RegisterData) => ({ ...prev, [field]: value }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev: Record<string, string>) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Real-time validation for password length
    if (field === "password" && value.length > 0 && value.length < 8) {
      setValidationErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters long",
      }));
    } else if (field === "password" && value.length >= 8) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.password;
        return newErrors;
      });
    }

    // Real-time validation for confirm password
    if (field === "confirmPassword" && value.length > 0) {
      const currentPassword = values.password;
      if (value !== currentPassword) {
        setValidationErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
      }
    }
  };

  const handleSubmit = () => {
    console.log("useAuthForm handleSubmit called with mode:", mode);
    console.log("Form values:", {
      ...values,
      password: "[HIDDEN]",
      confirmPassword: "[HIDDEN]",
    });

    const validation = validateAuthForm(values, mode, config);

    if (!validation.isValid) {
      console.log("Form validation failed:", validation.errors);
      setValidationErrors(validation.errors);
      return; // Make sure we return early and don't call onSubmit
    }

    console.log("Form validation passed, calling onSubmit");
    setValidationErrors({});
    onSubmit(values);
  };

  const resetForm = () => {
    setValues({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
      ...initialValues,
    });
    setValidationErrors({});
  };

  return {
    values,
    handleChange,
    handleSubmit,
    resetForm,
    loading,
    error,
    validationErrors,
    mode,
  };
};
