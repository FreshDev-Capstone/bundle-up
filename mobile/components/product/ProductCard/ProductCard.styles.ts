import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#F8F9FA",
  },
  addButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
    lineHeight: 18,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4CAF50",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceLabel: {
    fontSize: 12,
    color: "#666666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginRight: 8,
  },
  adminPriceContainer: {
    backgroundColor: "#F8F9FA",
    padding: 8,
    borderRadius: 6,
  },
  adminPrice: {
    fontSize: 12,
    color: "#333333",
    fontWeight: "500",
    lineHeight: 16,
  },
  carouselContainer: {
    position: "relative",
    height: 160,
  },
  carouselIndicators: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 3,
  },
  carouselDotActive: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default styles;
