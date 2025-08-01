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

  // Container that wraps each input and its asterisk
  inputContainer: {
    position: "relative", // Enable absolute positioning for asterisk
    width: "100%", // Full width of container
    marginBottom: 12, // Space between input containers
  },

  // Style for all text input fields (First Name, Last Name, Email, Password, etc.)
  input: {
    width: "100%", // Full width of container
    height: 44, // Fixed height for consistent input field size
    borderColor: "#ccc", // Light gray border color
    borderWidth: 1, // Clean 1px border
    borderRadius: 6, // Rounded corners
    marginBottom: 0, // Remove margin since container handles it
    paddingHorizontal: 12, // Left and right padding inside the input
    paddingRight: 28, // Extra right padding to make room for asterisk
    fontSize: 16, // Text size inside inputs
    backgroundColor: "#fff", // White background for input fields
    color: "#333", // Dark text color for input text
  },

  // Red asterisk for required fields
  requiredAsterisk: {
    position: "absolute",
    right: 8, // Position from right edge
    top: 12, // Center vertically within input height
    color: "#ff0000", // Red color
    fontSize: 16, // Match input font size
    fontWeight: "bold", // Make asterisk bold
  },

  // Container for first and last name inputs on the same line
  nameRowContainer: {
    flexDirection: "row", // Horizontal layout
    justifyContent: "space-between", // Space between the two inputs
    width: "100%", // Full width of container
    marginBottom: 12, // Space below the name row
  },

  // Container for name input with asterisk
  nameInputContainer: {
    width: "48%", // Each container takes about half width with space for gap
    marginBottom: 0, // Remove margin since nameRowContainer handles it
  },

  // Style for name inputs (first and last name)
  nameInput: {
    width: "100%", // Full width of its container
    marginBottom: 0, // Remove margin bottom since container handles it
  },

  // Container for name error messages
  nameErrorContainer: {
    flexDirection: "row", // Horizontal layout for errors
    justifyContent: "space-between", // Space between error messages
    width: "100%", // Full width
    marginBottom: 8, // Space below errors
    marginTop: -4, // Slight negative margin to bring closer to inputs
  },

  // Style for name error messages
  nameError: {
    width: "48%", // Match the input container width
    marginBottom: 0, // Remove default margin
  },

  // Style for error messages that appear below input fields
  error: {
    color: "red", // Red text color for error messages
    marginBottom: 8, // Small space below error message
    fontSize: 14, // Slightly smaller text than input fields
    width: "100%", // Full width for alignment
    textAlign: "left", // Left-aligned error text
    minHeight: 20, // Fixed minimum height to prevent layout jumping
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
