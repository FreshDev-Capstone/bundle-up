import React from "react";
import { Alert } from "react-native";
import AuthForm from "../AuthForm/AuthForm";
import { AuthFormValues, AuthFormConfig } from "../../../../shared/types";
import { useAuth } from "../../../context/AuthContext";

interface SignupFormProps {
  keyboardVisible?: boolean;
  config?: AuthFormConfig;
}

export default function SignupForm({
  keyboardVisible = false,
  config,
}: SignupFormProps) {
  const { register, loading, error } = useAuth();

  const handleSignup = async (values: AuthFormValues) => {
    if (
      !values.email ||
      !values.password ||
      !values.firstName ||
      !values.lastName
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // For B2B, check if company name is required
    if (config?.showCompanyName && !values.companyName) {
      Alert.alert("Error", "Company name is required for business accounts");
      return;
    }

    if (values.password !== values.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const success = await register({
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      companyName: values.companyName, // Include company name for B2B
    });

    if (!success) {
      Alert.alert("Registration Failed", error || "Please try again");
    }
  };

  return (
    <AuthForm
      mode="signup"
      onSubmit={handleSignup}
      loading={loading}
      error={error}
      keyboardVisible={keyboardVisible}
      config={config}
    />
  );
}
