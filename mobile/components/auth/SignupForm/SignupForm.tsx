import React from "react";
import { Alert } from "react-native";
import AuthForm from "@/components/auth/AuthForm/AuthForm";
import { AuthFormConfig, RegisterData } from "../../../../shared/types";
import { useAuth } from "@/context/AuthContext";
import { validateAuthForm } from "../../../../shared/utils/validators";

interface AuthFormProps {
  keyboardVisible: boolean;
  config: AuthFormConfig;
  onSuccess: () => void;
}

export default function SignupForm({
  keyboardVisible,
  config,
  onSuccess,
}: AuthFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { register } = useAuth();

  const handleSignup = async (values: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      const success = await register(values);
      if (success) {
        onSuccess();
      } else {
        Alert.alert("Sign Up Failed", "Please check your credentials");
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
