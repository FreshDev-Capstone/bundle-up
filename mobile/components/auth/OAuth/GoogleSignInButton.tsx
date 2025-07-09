import * as React from "react";
import { Button, View, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { fetchHandler, getPostOptions } from "../../../utils/fetchingUtils";
import { useAuthStore } from "../../../context/AuthContext";
import styles from "./GoogleSignInButton.styles";

WebBrowser.maybeCompleteAuthSession();

interface GoogleSignInButtonProps {
  title?: string;
}

export default function GoogleSignInButton({
  title = "Sign in with Google",
}: GoogleSignInButtonProps) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  React.useEffect(() => {
    const handleGoogleAuth = async () => {
      if (
        response?.type === "success" &&
        response.authentication?.accessToken
      ) {
        // Fetch user info from Google
        const userInfoRes = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          {
            headers: {
              Authorization: `Bearer ${response.authentication.accessToken}`,
            },
          }
        );
        const userInfo = await userInfoRes.json();
        // Send to backend for JWT
        const [data, error] = await fetchHandler(
          "http://localhost:3001/api/auth/google",
          getPostOptions({
            googleId: userInfo.id,
            email: userInfo.email,
            firstName: userInfo.given_name,
            lastName: userInfo.family_name,
          })
        );
        if (data && data.token && data.user) {
          useAuthStore.getState().setUser({ ...data.user, token: data.token });
        } else {
          Alert.alert(
            "Google Sign-In Error",
            error?.message || "Failed to authenticate with backend"
          );
        }
      } else if (response?.type === "error") {
        Alert.alert(
          "Google Sign-In Error",
          response.error?.message || "Google sign-in failed"
        );
      }
    };
    handleGoogleAuth();
  }, [response]);

  return (
    <View style={styles.container}>
      <Button disabled={!request} title={title} onPress={() => promptAsync()} />
    </View>
  );
}
