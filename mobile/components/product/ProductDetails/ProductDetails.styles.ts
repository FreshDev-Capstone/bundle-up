import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  carouselContainer: {
    position: "relative",
    height: 400,
  },
  imageContainer: {
    width: screenWidth,
    height: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: screenWidth,
    height: 400,
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
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  dotContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  thumbnailContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  thumbnailList: {
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  activeThumbnail: {
    borderColor: "#007AFF",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  productInfo: {
    flex: 1,
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  priceContainer: {
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "600",
    color: "#007AFF",
  },
  adminPriceInfo: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  adminPriceText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  adminPriceContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  adminPriceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priceItem: {
    flex: 1,
    alignItems: "center",
  },
  adminPriceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  marginInfo: {
    fontSize: 14,
    color: "#28a745",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
});

export default styles;
