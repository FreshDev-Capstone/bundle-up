import * as React from "react";
import { Button, StyleSheet, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import styles from "./GoogleSignInButton.styles";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton({ title }: { title: string }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        console.log("Google Sign-In successful!");
        console.log("Access Token:", authentication.accessToken);

        // Fetch user info
        fetch("https://www.googleapis.com/userinfo/v2/me", {
          headers: { Authorization: `Bearer ${authentication.accessToken}` },
        })
          .then((res) => res.json())
          .then((user) => {
            console.log("User Info:", user);
            // Handle user data here (e.g., store in state, context, etc.)
          })
          .catch((error) => {
            console.error("Error fetching user info:", error);
          });
      }
    } else if (response?.type === "error") {
      console.error("Google Sign-In error:", response.error);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Button disabled={!request} title={title} onPress={() => promptAsync()} />
    </View>
  );
}
