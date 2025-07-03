import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
  },
  buttonContainer: {
    width: "80%",
    height: 40,
    backgroundColor: "blue",
    color: "white",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
  or: {
    marginVertical: 10,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  googleButtonContainer: {
    width: "80%",
    height: 40,
    backgroundColor: "red",
    color: "white",
  },
  forgotPassword: {
    marginVertical: 10,
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default styles;
