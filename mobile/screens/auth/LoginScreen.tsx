import React from "react";
import { Alert } from "react-native";
import AuthForm from "../AuthForm/AuthForm";
import { RegisterData, AuthFormConfig } from "../../../../shared/types";
import { useAuth } from "../../../context/AuthContext";

export default function LoginScreen() {
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const [config, setConfig] = React.useState({
    showCompanyName: false, // Default to false for B2C
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async (values: RegisterData) => {
    if (!values.email || !values.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await login(values.email, values.password);
      if (success) {
        // Optionally handle successful login
      } else {
        Alert.alert("Login Failed", error || "Please check your credentials");
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
