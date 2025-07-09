import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // The outer ScrollView container that holds the entire form
  scrollContainer: {
    flex: 1, // Takes full height of parent container
    width: "100%", // Takes full width of parent container
  },

  // The contentContainerStyle for ScrollView - controls the scrollable content area
  contentContainer: {
    flexGrow: 1, // Allows content to grow and fill available space
    justifyContent: "center", // Centers the form vertically on screen
    paddingHorizontal: 20, // Clean horizontal padding for breathing room
  },

  // Container that holds all form elements (Google button, divider, inputs, submit button)
  formContainer: {
    alignItems: "center", // Centers all form elements horizontally
    width: "100%", // Takes full width of content container
  },

  // Style for all text input fields (First Name, Last Name, Email, Password, etc.)
  input: {
    width: "100%", // Full width of container
    height: 44, // Fixed height for consistent input field size
    borderColor: "#ccc", // Light gray border color
    borderWidth: 1, // Clean 1px border
    borderRadius: 6, // Rounded corners
    marginBottom: 12, // Small space between input fields
    paddingHorizontal: 12, // Left and right padding inside the input
    fontSize: 16, // Text size inside inputs
    backgroundColor: "#fff", // White background for input fields
  },

  // Style for error messages that appear below input fields
  error: {
    color: "red", // Red text color for error messages
    marginBottom: 8, // Small space below error message
    fontSize: 14, // Slightly smaller text than input fields
    width: "100%", // Full width for alignment
    textAlign: "left", // Left-aligned error text
  },

  // Container for the "OR" divider between Google button and email/password form
  dividerContainer: {
    flexDirection: "row", // Horizontal layout: line - OR - line
    alignItems: "center", // Centers items vertically within the container
    width: "100%", // Full width for consistency
    marginVertical: 16, // Clean space above and below the OR divider
  },

  // The horizontal lines on either side of "OR"
  divider: {
    flex: 1, // Takes equal space on both sides of "OR" text
    height: 1, // 1px thick line
    backgroundColor: "#ccc", // Light gray color for the lines
  },

  // The "OR" text in the middle of the divider
  dividerText: {
    marginHorizontal: 15, // Clean space on left and right of "OR" text
    fontSize: 14, // Text size for "OR"
    color: "#666", // Medium gray color
    fontWeight: "500", // Slightly bold text
  },

  // Container that wraps the Submit button (Login/Sign Up)
  buttonContainer: {
    width: "100%", // Full width for consistency
    marginTop: 16, // Clean space above the submit button
  },

  // Modified button container style when keyboard is visible (reduces spacing)
  buttonContainerKeyboard: {
    marginTop: 12, // Slightly reduced space when keyboard is active
  },
});
