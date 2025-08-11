import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#2c3e50",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#7f8c8d",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    lineHeight: 24,
  },
  addressesList: {
    flex: 1,
    marginBottom: 20,
  },
  addressItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  defaultAddress: {
    borderLeftColor: "#27ae60",
    backgroundColor: "#f0fff4",
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  addressName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
  },
  defaultBadge: {
    backgroundColor: "#27ae60",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
  fullName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50",
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  instructions: {
    fontSize: 12,
    color: "#7f8c8d",
    fontStyle: "italic",
    marginTop: 8,
    marginBottom: 8,
  },
  deleteButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fee2e2",
    borderRadius: 6,
    marginTop: 8,
  },
  deleteButtonText: {
    fontSize: 12,
    color: "#dc2626",
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#3498db",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
