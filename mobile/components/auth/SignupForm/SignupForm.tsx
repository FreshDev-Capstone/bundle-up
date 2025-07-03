import { Button, Text, TextInput, View } from "react-native";
import GoogleSignInButton from "../OAuth/GoogleSignInButton";
import { Link } from "@react-navigation/native";
import styles from "./SignupForm.styles";

export default function SignupForm() {
  return (
    <View>
      <View style={styles.googleButtonContainer}>
        <GoogleSignInButton title="Sign up with Google" />
      </View>
      <Text style={styles.or}>OR</Text>
      <Text style={styles.signupTitle}>Sign Up</Text>
      <TextInput style={styles.input} placeholder="First Name" />
      <TextInput style={styles.input} placeholder="Last Name" />
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" />
      </View>
      <Text>
        Already have an account?{" "}
        <Link href="/login" action={{ type: "navigate" }} style={styles.link}>
          Login
        </Link>
      </Text>
    </View>
  );
}
