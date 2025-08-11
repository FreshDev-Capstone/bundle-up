import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  carouselContainer: {
    height: 300,
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: 300,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  imageCounter: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  counterText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  dotContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeDot: {
    backgroundColor: "#FFFFFF",
  },
  thumbnailContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  thumbnailList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  activeThumbnail: {
    borderColor: "#4CAF50",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  productInfo: {
    flex: 1,
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
    lineHeight: 28,
  },
  priceContainer: {
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  adminPriceContainer: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  adminPriceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceItem: {
    flex: 1,
  },
  adminPriceLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4CAF50",
  },
  marginInfo: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
  },
  productDescription: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    marginBottom: 32,
  },
  addToCartButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
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
  addToCartText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default styles;
