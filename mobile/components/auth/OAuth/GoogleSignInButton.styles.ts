import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Container for the Google Sign In button - matches Google Material Design with pill shape
  container: {
    backgroundColor: "#F2F2F2", // Neutral fill color as requested
    borderWidth: 0, // No stroke as requested
    borderRadius: 20, // Pill shape border radius
    height: 40, // Standard Google button height
    paddingHorizontal: 12, // Reduced horizontal padding to hug content more closely
    width: "auto", // Auto width to fit content tightly
    minWidth: 200, // Minimum width to ensure button isn't too small
    maxWidth: 280, // Maximum width to prevent button from being too wide
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    alignSelf: "center", // Center the button in its container
    marginBottom: 16, // Clean space below Google button
    // Shadow for elevation (Google Material Design)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },

  // Content wrapper that holds icon and text
  contentWrapper: {
    flexDirection: "row", // Horizontal layout: icon + text
    alignItems: "center", // Center items vertically
    justifyContent: "center", // Center content horizontally
    // Removed width: "100%" to allow content to determine width naturally
  },

  // Container for the Google icon
  iconContainer: {
    width: 20, // Fixed width for icon
    height: 20, // Fixed height for icon
    marginRight: 12, // Space between icon and text
  },

  // Text style for button label
  buttonText: {
    fontFamily: "Roboto-Medium", // Roboto Medium font (once properly loaded)
    fontWeight: "500", // Medium weight (500) for Google Material Design
    fontSize: 14, // Font size as requested
    lineHeight: 20, // Line height as requested
    color: "#1F1F1F", // Font color as requested
    textAlign: "center", // Center text
  },
});

export default styles;
