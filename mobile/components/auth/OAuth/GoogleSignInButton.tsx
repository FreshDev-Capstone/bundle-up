import * as React from "react";
import { TouchableOpacity, View, Text, Alert } from "react-native";
import { Svg, Path } from "react-native-svg";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  fetchHandler,
  getPostOptions,
} from "../../../../shared/utils/fetchingUtils";
import { useAuthStore } from "../../../context/AuthContext";
import { API_BASE_URL } from "../../../utils/constants";
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
          `${API_BASE_URL}/auth/google`,
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
    <TouchableOpacity
      style={styles.container}
      disabled={!request}
      onPress={() => promptAsync()}
      activeOpacity={0.8}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.iconContainer}>
          <Svg width={20} height={20} viewBox="0 0 48 48">
            <Path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <Path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <Path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <Path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </Svg>
        </View>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
