import React from "react";
import { View, Text, TextInput, Button } from "react-native";
import { AuthFormProps } from "../../../../shared/types";
import { useAuthForm } from "../../../../shared/hooks";
import styles from "./AuthForm.styles";

export default function AuthForm({
  mode,
  onSubmit,
  initialValues = {},
  loading,
  error,
}: AuthFormProps) {
  const { values, handleChange, handleSubmit, validationErrors } = useAuthForm({
    mode,
    onSubmit,
    initialValues,
    loading,
    error,
  });

  return (
    <View style={styles.container}>
      {mode === "signup" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={values.firstName}
            onChangeText={(v: string) => handleChange("firstName", v)}
          />
          {validationErrors.firstName && (
            <Text style={styles.error}>{validationErrors.firstName}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={values.lastName}
            onChangeText={(v: string) => handleChange("lastName", v)}
          />
          {validationErrors.lastName && (
            <Text style={styles.error}>{validationErrors.lastName}</Text>
          )}
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={values.email}
        onChangeText={(v: string) => handleChange("email", v)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {validationErrors.email && (
        <Text style={styles.error}>{validationErrors.email}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={values.password}
        onChangeText={(v: string) => handleChange("password", v)}
        secureTextEntry
      />
      {validationErrors.password && (
        <Text style={styles.error}>{validationErrors.password}</Text>
      )}
      {mode === "signup" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={values.confirmPassword}
            onChangeText={(v: string) => handleChange("confirmPassword", v)}
            secureTextEntry
          />
          {validationErrors.confirmPassword && (
            <Text style={styles.error}>{validationErrors.confirmPassword}</Text>
          )}
        </>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title={mode === "login" ? "Login" : "Sign Up"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
}
