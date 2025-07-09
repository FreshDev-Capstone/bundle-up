import React from "react";
import { Alert } from "react-native";
import AuthForm from "../AuthForm/AuthForm";
import { AuthFormValues, AuthFormConfig } from "../../../../shared/types";
import { useAuth } from "../../../context/AuthContext";

interface LoginFormProps {
  keyboardVisible?: boolean;
  config?: AuthFormConfig;
}

export default function LoginForm({
  keyboardVisible = false,
  config,
}: LoginFormProps) {
  const { login, loading, error } = useAuth();

  const handleLogin = async (values: AuthFormValues) => {
    if (!values.email || !values.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const success = await login(values.email, values.password);

    if (!success) {
      Alert.alert("Login Failed", error || "Please check your credentials");
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
