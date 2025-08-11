import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  welcome: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  accountType: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "400",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  menuSection: {
    marginBottom: 32,
  },
  orderSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  orderDate: {
    fontSize: 14,
    color: "#666666",
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
    lineHeight: 20,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10B981",
  },
  orderStatusProcessing: {
    color: "#F59E0B",
  },
  orderStatusDelivered: {
    color: "#10B981",
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  orderSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderHeaderButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refreshButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  viewAllButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  viewAllButtonText: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666666",
  },
  emptyOrders: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyOrdersText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 8,
  },
  emptyOrdersSubtext: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
  },
  menuItem: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  logoutItem: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  logoutLabel: {
    color: "#DC2626",
  },
  adminItem: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  adminLabel: {
    color: "#2563EB",
  },
  signOutContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  signOutButton: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },
});
