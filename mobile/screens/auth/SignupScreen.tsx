import React from "react";
import { Alert } from "react-native";
import AuthForm from "../../components/auth/AuthForm/AuthForm";
import { RegisterData } from "../../../shared/types";
import { useAuth } from "../../context/AuthContext";
import { validateAuthForm } from "../../../shared/utils/validators";

interface SignupScreenProps {
  keyboardVisible: boolean;
  config?: any;
  onSuccess?: () => void;
}

export default function SignupScreen({
  keyboardVisible,
  config,
  onSuccess,
}: SignupScreenProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { register, error: authError } = useAuth();

  const handleSignup = async (values: RegisterData) => {
    console.log("Signup attempt with values:", {
      ...values,
      password: "[HIDDEN]",
    });

    const validationResult = validateAuthForm(values, "signup", config);
    if (!validationResult.isValid) {
      console.log("Validation failed:", validationResult.errors);
      const firstError = Object.values(validationResult.errors)[0];
      Alert.alert(
        "Validation Error",
        firstError || "Please fix the errors in the form."
      );
      return;
    }

    console.log("Validation passed, attempting registration...");
    setLoading(true);
    setError(null);

    try {
      const success = await register(values);
      console.log("Registration result:", success);
      if (success) {
        console.log("Registration successful!");
        onSuccess?.();
      } else {
        console.log("Registration failed, auth error:", authError);
        Alert.alert(
          "Sign Up Failed",
          authError || "Please check your credentials"
        );
      }
    } catch (err) {
      console.error("Sign Up error:", err);
      setError("Sign Up failed. Please try again.");
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
