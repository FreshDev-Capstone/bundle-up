import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: "#2c3e50",
  },
  settingGroup: {
    marginBottom: 32,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  groupItems: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  actionItem: {
    backgroundColor: "transparent",
  },
  settingLabel: {
    fontSize: 16,
    color: "#2c3e50",
    flex: 1,
  },
  dangerousLabel: {
    color: "#e74c3c",
  },
  settingValue: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  chevron: {
    fontSize: 20,
    color: "#bdc3c7",
    fontWeight: "300",
  },
  signOutButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
