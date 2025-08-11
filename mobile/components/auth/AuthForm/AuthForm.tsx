import React, { useRef, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { AuthFormProps } from "../../../../shared/types";
import { useAuthForm } from "../../../../shared/hooks";
import styles from "./AuthForm.styles";

const AuthForm = React.memo(
  ({
    mode,
    onSubmit,
    initialValues = {},
    loading,
    error,
    keyboardVisible = false,
    config,
  }: AuthFormProps) => {
    const { values, handleChange, handleSubmit, validationErrors } =
      useAuthForm({
        mode,
        onSubmit,
        initialValues,
        loading,
        error,
        config,
      });

    // Create refs for text inputs to enable focus navigation
    const scrollViewRef = useRef<any>(null);
    const firstNameRef = useRef<any>(null);
    const lastNameRef = useRef<any>(null);
    const companyNameRef = useRef<any>(null);
    const emailRef = useRef<any>(null);
    const passwordRef = useRef<any>(null);
    const confirmPasswordRef = useRef<any>(null);

    // Function to scroll to a specific input field
    const scrollToInput = (inputRef: React.RefObject<any>) => {
      if (inputRef.current && scrollViewRef.current) {
        // Use setTimeout to ensure the keyboard animation has started
        setTimeout(() => {
          inputRef.current.measureLayout(
            scrollViewRef.current,
            (x: number, y: number, width: number, height: number) => {
              // Calculate scroll position to show input right below logo/subtitle
              const isFirstName = inputRef === firstNameRef;
              const isLastName = inputRef === lastNameRef;
              const isCompanyName = inputRef === companyNameRef;
              const isEmail = inputRef === emailRef;
              const isPassword = inputRef === passwordRef;
              const isConfirmPassword = inputRef === confirmPasswordRef;

              let extraOffset;
              if (isFirstName) {
                extraOffset = 120; // Position First Name right below logo/subtitle
              } else if (isLastName) {
                extraOffset = 100; // Position Last Name appropriately
              } else if (isCompanyName) {
                extraOffset = 90; // Position Company Name appropriately
              } else if (isEmail) {
                extraOffset = 80; // Position Email appropriately
              } else if (isPassword || isConfirmPassword) {
                extraOffset = 60; // Standard for password fields
              } else {
                extraOffset = 50; // Default
              }

              scrollViewRef.current?.scrollTo({
                y: Math.max(0, y - extraOffset),
                animated: true,
              });
            },
            () => {
              // Enhanced fallback - position First Name right below logo/subtitle
              const fieldIndex =
                inputRef === firstNameRef
                  ? 0
                  : inputRef === lastNameRef
                  ? 1
                  : inputRef === companyNameRef
                  ? 2
                  : inputRef === emailRef
                  ? 3
                  : inputRef === passwordRef
                  ? 4
                  : 5; // confirmPassword is 5

              // Calculate scroll position to show First Name right below logo/subtitle
              const logoSubtitleHeight = 150; // Approximate height of logo + subtitle + spacing
              const scrollY = logoSubtitleHeight + fieldIndex * 60;

              scrollViewRef.current?.scrollTo({
                y: Math.max(0, scrollY - 50),
                animated: true,
              });
            }
          );
        }, 100); // Slightly longer delay to ensure proper measurement
      }
    };

    // Function to return form to centered position when keyboard is dismissed
    const returnToCenter = () => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    };

    // Add listener for when keyboard state changes
    useEffect(() => {
      if (!keyboardVisible) {
        // Keyboard was dismissed, return to center with a slight delay
        setTimeout(returnToCenter, 200);
      }
    }, [keyboardVisible]);

    // Dynamic content container style based on keyboard visibility
    const dynamicContentStyle = {
      ...styles.contentContainer,
      justifyContent: keyboardVisible ? "flex-start" : "center", // Center when keyboard hidden, top when visible
      paddingTop: keyboardVisible ? 20 : 0, // Add top padding when keyboard is visible
    };

    return (
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={dynamicContentStyle}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEnabled={keyboardVisible} // Only enable scrolling when keyboard is visible
        bounces={false} // Disable bouncing to prevent unwanted scrolling
        overScrollMode="never" // Android: prevent over-scroll effects
      >
        <View style={styles.formContainer}>
          {/* Google OAuth Button - Temporarily disabled */}
          {/* <GoogleSignInButton
            title={
              mode === "signup" ? "Sign Up with Google" : "Continue with Google"
            }
          />

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View> */}

          {config?.showCompanyName && mode === "signup" && (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  ref={companyNameRef}
                  style={styles.input}
                  placeholder="Company Name"
                  placeholderTextColor="#666666"
                  value={values.companyName}
                  onChangeText={(v: string) => handleChange("companyName", v)}
                  onFocus={() => scrollToInput(companyNameRef)}
                  returnKeyType="next"
                  autoCapitalize="words"
                  autoCorrect={false}
                  blurOnSubmit={false}
                  onSubmitEditing={() => firstNameRef.current?.focus()}
                />
                <Text style={styles.requiredAsterisk}>*</Text>
              </View>
              {validationErrors.companyName && (
                <Text style={styles.error}>{validationErrors.companyName}</Text>
              )}
            </>
          )}

          {mode === "signup" && (
            <>
              {/* First Name and Last Name on the same line */}
              <View style={styles.nameRowContainer}>
                <View
                  style={[styles.inputContainer, styles.nameInputContainer]}
                >
                  <TextInput
                    ref={firstNameRef}
                    style={[styles.input, styles.nameInput]}
                    placeholder="First Name"
                    placeholderTextColor="#666666"
                    value={values.firstName}
                    onChangeText={(v: string) => handleChange("firstName", v)}
                    onFocus={() => scrollToInput(firstNameRef)}
                    returnKeyType="next"
                    autoCapitalize="words"
                    autoCorrect={false}
                    blurOnSubmit={false}
                    onSubmitEditing={() => lastNameRef.current?.focus()}
                  />
                  <Text style={styles.requiredAsterisk}>*</Text>
                </View>
                <View
                  style={[styles.inputContainer, styles.nameInputContainer]}
                >
                  <TextInput
                    ref={lastNameRef}
                    style={[styles.input, styles.nameInput]}
                    placeholder="Last Name"
                    placeholderTextColor="#666666"
                    value={values.lastName}
                    onChangeText={(v: string) => handleChange("lastName", v)}
                    onFocus={() => scrollToInput(lastNameRef)}
                    returnKeyType="next"
                    autoCapitalize="words"
                    autoCorrect={false}
                    blurOnSubmit={false}
                    onSubmitEditing={() => emailRef.current?.focus()}
                  />
                  <Text style={styles.requiredAsterisk}>*</Text>
                </View>
              </View>
              {/* Error messages for name fields */}
              {(validationErrors.firstName || validationErrors.lastName) && (
                <View style={styles.nameErrorContainer}>
                  {validationErrors.firstName && (
                    <Text style={[styles.error, styles.nameError]}>
                      {validationErrors.firstName}
                    </Text>
                  )}
                  {validationErrors.lastName && (
                    <Text style={[styles.error, styles.nameError]}>
                      {validationErrors.lastName}
                    </Text>
                  )}
                </View>
              )}
            </>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              ref={emailRef}
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666666"
              value={values.email}
              onChangeText={(v: string) => handleChange("email", v)}
              onFocus={() => scrollToInput(emailRef)}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              autoComplete="email"
              autoCorrect={false}
              blurOnSubmit={false}
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <Text style={styles.requiredAsterisk}>*</Text>
          </View>
          {validationErrors.email && (
            <Text style={styles.error}>{validationErrors.email}</Text>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              ref={passwordRef}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666666"
              value={values.password}
              onChangeText={(v: string) => handleChange("password", v)}
              onFocus={() => scrollToInput(passwordRef)}
              secureTextEntry
              returnKeyType={mode === "signup" ? "next" : "done"}
              autoComplete="password"
              autoCorrect={false}
              blurOnSubmit={false}
              onSubmitEditing={
                mode === "login"
                  ? handleSubmit
                  : () => confirmPasswordRef.current?.focus()
              }
            />
            <Text style={styles.requiredAsterisk}>*</Text>
          </View>
          {mode === "signup" && (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  ref={confirmPasswordRef}
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#666666"
                  value={values.confirmPassword}
                  onChangeText={(v: string) =>
                    handleChange("confirmPassword", v)
                  }
                  onFocus={() => scrollToInput(confirmPasswordRef)}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                  autoComplete="password"
                  autoCorrect={false}
                  blurOnSubmit={false}
                />
                <Text style={styles.requiredAsterisk}>*</Text>
              </View>
              {validationErrors.confirmPassword && (
                <Text style={styles.error}>
                  {validationErrors.confirmPassword}
                </Text>
              )}
            </>
          )}

          <View
            style={[
              styles.buttonContainer,
              keyboardVisible && styles.buttonContainerKeyboard,
            ]}
          >
            <Button
              title={mode === "login" ? "Login" : "Sign Up"}
              onPress={() => {
                console.log("Button pressed! Mode:", mode, "Loading:", loading);
                handleSubmit();
              }}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
);

AuthForm.displayName = "AuthForm";

export default AuthForm;
