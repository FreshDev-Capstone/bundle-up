import React from "react";
import { Alert } from "react-native";
import AuthForm from "../AuthForm/AuthForm";
import { RegisterData, AuthFormConfig } from "../../../../shared/types";
import { useAuth } from "../../../context/AuthContext";

export default function SignupScreen() {
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const [config, setConfig] = React.useState({
    showCompanyName: false, // Default to false for B2C
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { register } = useAuth();

  const handleSignup = async (values: RegisterData) => {
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
    if (config.showCompanyName && !values.companyName) {
      Alert.alert("Error", "Company name is required for business accounts");
      return;
    }

    if (values.password !== values.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await register({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        companyName: values.companyName, // Include company name for B2B
      });
      if (success) {
        // Optionally handle successful registration
      } else {
        Alert.alert("Registration Failed", error || "Please try again");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
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
