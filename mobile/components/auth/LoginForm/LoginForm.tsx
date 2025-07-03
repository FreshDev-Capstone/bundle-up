import { View, Text, TextInput, Button } from "react-native";
import { Link } from "@react-navigation/native";
import GoogleSignInButton from "../OAuth/GoogleSignInButton";
import styles from "./LoginForm.styles";

export default function LoginForm() {
  return (
    <View style={styles.container}>
      <View style={styles.googleButtonContainer}>
        <GoogleSignInButton title="Continue with Google" />
      </View>
      <Text style={styles.or}>OR</Text>
      <Text style={styles.loginTitle}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={() => {}} />
      </View>
      <Text style={styles.forgotPassword}>
        <Link href="/forgot-password" action={{ type: "navigate" }}>
          Forgot Password?
        </Link>
      </Text>
      <Text>
        Don't have an account?{" "}
        <Link href="/signup" action={{ type: "navigate" }} style={styles.link}>
          Sign Up
        </Link>
      </Text>
    </View>
  );
}
