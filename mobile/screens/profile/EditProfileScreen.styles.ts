import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: "#2c3e50",
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#2c3e50",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#2c3e50",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  helperText: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 4,
    fontStyle: "italic",
  },
  saveButton: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 32,
  },
  saveButtonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
