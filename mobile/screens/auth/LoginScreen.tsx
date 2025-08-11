import React from "react";
import { Alert } from "react-native";
import AuthForm from "../../components/auth/AuthForm/AuthForm";
import { LoginCredentials } from "../../../shared/types";
import { useAuth } from "../../context/AuthContext";
import { validateAuthForm } from "../../../shared/utils/validators";

interface LoginScreenProps {
  keyboardVisible: boolean;
  config?: any;
  onSuccess?: () => void;
}

export default function LoginScreen({
  keyboardVisible,
  config,
  onSuccess,
}: LoginScreenProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async (values: LoginCredentials) => {
    const validationResult = validateAuthForm(values, "login", config);
    if (!validationResult.isValid) {
      const firstError = Object.values(validationResult.errors)[0];
      Alert.alert(
        "Validation Error",
        firstError || "Please fix the errors in the form."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await login(values.email, values.password);
      if (success) {
        onSuccess?.();
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      mode="login"
      onSubmit={handleLogin}
      loading={loading}
      error={error}
      keyboardVisible={keyboardVisible}
      config={config}
    />
  );
}
