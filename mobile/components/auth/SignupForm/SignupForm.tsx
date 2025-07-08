import React from "react";
import { Alert } from "react-native";
import AuthForm from "../AuthForm/AuthForm";
import { AuthFormValues } from "../../../../shared/types";
import { useAuth } from "../../../context/AuthContext";

export default function SignupForm() {
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

    if (values.password !== values.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const success = await register({
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
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
    />
  );
}
