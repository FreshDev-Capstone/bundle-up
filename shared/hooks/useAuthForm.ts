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
  };

  const handleSubmit = () => {
    const validation = validateAuthForm(values, mode, config);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

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
