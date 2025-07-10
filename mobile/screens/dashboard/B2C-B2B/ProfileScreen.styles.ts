import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 48,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  welcome: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2c3e50",
  },
  accountType: {
    fontSize: 16,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  menuList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    padding: 20,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  menuLabel: {
    fontSize: 18,
    color: "#2c3e50",
    fontWeight: "500",
  },
  logoutItem: {
    backgroundColor: "#fee2e2",
    borderLeftColor: "#ef4444",
    marginTop: 20,
  },
  logoutLabel: {
    color: "#dc2626",
    fontWeight: "600",
  },
  adminItem: {
    backgroundColor: "#fef3c7",
    borderLeftColor: "#f59e0b",
  },
  adminLabel: {
    color: "#d97706",
    fontWeight: "600",
  },
});
