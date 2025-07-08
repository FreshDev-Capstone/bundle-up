import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#7f8c8d",
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  clearButton: {
    fontSize: 16,
    color: "#e74c3c",
    fontWeight: "500",
  },
  cartList: {
    flex: 1,
    padding: 20,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: "center",
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: "#27ae60",
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e74c3c",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  removeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    backgroundColor: "#f8f9fa",
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
    color: "#2c3e50",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27ae60",
  },
  checkoutButton: {
    backgroundColor: "#27ae60",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
