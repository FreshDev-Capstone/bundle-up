import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666666",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  clearButton: {
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  cartList: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16, // Keep modern rounded corners
    padding: 16, // Back to original padding
    marginBottom: 12, // Reduce space between items
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4, // Keep deeper shadow
    },
    shadowOpacity: 0.08, // Keep subtle shadow
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F5F5F5", // Keep subtle border
  },
  productImage: {
    width: 60, // Back to original size
    height: 60,
    borderRadius: 12, // Keep more rounded
    marginRight: 12, // Back to original spacing
    backgroundColor: "#F8F9FA",
  },
  itemDetails: {
    flex: 1,
    paddingRight: 8, // Keep space for remove button
  },
  productName: {
    fontSize: 16, // Slightly smaller for compact layout
    fontWeight: "700", // Keep bolder
    color: "#1A1A1A", // Keep darker for better contrast
    marginBottom: 4, // Reduced space
    lineHeight: 20, // Tighter line height
  },
  productPrice: {
    fontSize: 14, // Back to original
    color: "#6B7280", // Keep modern gray
    marginBottom: 8, // Reduced space
    fontWeight: "500",
  },
  inventoryWarning: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inventoryWarningText: {
    fontSize: 12,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6, // Reduced space
    marginTop: 4, // Reduced space
    backgroundColor: "#F8F9FA", // Keep subtle background
    borderRadius: 8, // Smaller radius for compact look
    padding: 4, // Reduced padding
    alignSelf: "flex-start", // Don't stretch full width
  },
  quantityButton: {
    width: 32, // Back to smaller size
    height: 32,
    borderRadius: 16,
    backgroundColor: "#10B981", // Keep modern green
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: {
      width: 0,
      height: 1, // Smaller shadow for compact look
    },
    shadowOpacity: 0.15, // Reduced shadow
    shadowRadius: 2,
    elevation: 2,
  },
  quantityButtonDisabled: {
    backgroundColor: "#E5E7EB",
    shadowOpacity: 0,
    elevation: 0,
  },
  quantityButtonText: {
    fontSize: 18, // Slightly smaller
    fontWeight: "700", // Keep bolder
    color: "#FFFFFF",
  },
  quantityButtonTextDisabled: {
    color: "#9CA3AF",
  },
  quantityInputContainer: {
    alignItems: "center",
    marginHorizontal: 12, // Reduced spacing
    minWidth: 20, // Smaller width
  },
  quantityInput: {
    fontSize: 16, // Smaller text for compact layout
    fontWeight: "700", // Keep bolder
    color: "#1F2937", // Darker
    minWidth: 36, // Smaller width
    height: 32, // Match button height
    textAlign: "center",
    borderWidth: 2, // Keep thicker border
    borderColor: "#E5E7EB",
    borderRadius: 6, // Smaller radius for compact look
    paddingHorizontal: 4, // Reduced padding
    paddingVertical: 4,
    backgroundColor: "#FFFFFF",
  },
  quantityInputMax: {
    borderColor: "#EF4444", // Modern red
    backgroundColor: "#FEF2F2", // Light red background
  },
  quantityHint: {
    fontSize: 11, // Slightly larger
    color: "#6B7280", // Modern gray
    marginTop: 4,
    fontWeight: "500",
  },
  itemTotal: {
    fontSize: 15, // Slightly smaller for compact layout
    fontWeight: "700", // Keep bolder
    color: "#10B981", // Modern green
    marginTop: 6, // Reduced space
    backgroundColor: "#ECFDF5", // Keep light green background
    paddingHorizontal: 10, // Reduced padding
    paddingVertical: 4, // Reduced padding
    borderRadius: 6, // Smaller radius
    alignSelf: "flex-start", // Don't stretch full width
  },
  removeButton: {
    width: 32, // Smaller for compact layout
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EF4444", // Modern red
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10, // Reduced spacing
    alignSelf: "flex-start",
    marginTop: 0, // Align with top content
    shadowColor: "#EF4444",
    shadowOffset: {
      width: 0,
      height: 1, // Smaller shadow for compact look
    },
    shadowOpacity: 0.15, // Reduced shadow
    shadowRadius: 2,
    elevation: 2,
  },
  removeButtonText: {
    fontSize: 18, // Smaller X for compact layout
    fontWeight: "700", // Keep bolder
    color: "#FFFFFF",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
  },
  authPrompt: {
    backgroundColor: "#F0F8FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  authPromptText: {
    fontSize: 14,
    color: "#2E7D32",
    textAlign: "center",
    fontWeight: "500",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  checkoutButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  checkoutButtonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#4CAF50",
    shadowOpacity: 0,
    elevation: 0,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  checkoutButtonTextSecondary: {
    color: "#4CAF50",
  },
  checkoutButtonLoading: {
    backgroundColor: "#CCCCCC",
    shadowOpacity: 0,
    elevation: 0,
  },
  checkoutButtonTextLoading: {
    color: "#666666",
  },
});
