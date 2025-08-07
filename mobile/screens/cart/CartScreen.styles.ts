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
    padding: 10, // Back to original padding
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
    width: 100, // Even larger image
    height: 100,
    borderRadius: 20, // More rounded for larger image
    marginRight: 20, // More spacing for larger image
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
    justifyContent: "flex-start",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    width: "100%",
    maxWidth: 260,
    minWidth: 207,
    flexWrap: "nowrap",
  },
  quantityButton: {
    width: 32,
    height: 32, // Match input height for better centering
    borderRadius: 6,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 2,
  },
  quantityButtonDisabled: {
    backgroundColor: "#E5E7EB",
    shadowOpacity: 0,
    elevation: 0,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 32, // Match button height for vertical centering
  },
  quantityButtonTextDisabled: {
    color: "#9CA3AF",
  },
  quantityInputContainer: {
    flexDirection: "column", // Stack input and hint vertically
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
    minWidth: 48,
    flexShrink: 1,
  },
  quantityInput: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    minWidth: 120, // Wider for better usability
    width: 64, // Wider for better usability
    height: 32,
    textAlign: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    paddingHorizontal: 2,
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
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    alignSelf: "flex-start",
    marginTop: 0,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    display: "flex",
  },
  removeButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
    height: "100%",
    includeFontPadding: false,
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
