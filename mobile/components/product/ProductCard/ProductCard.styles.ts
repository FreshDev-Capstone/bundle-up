import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "green",
    borderRadius: 100,
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  priceContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  adminPriceContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: "#f8f9fa",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  adminPrice: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
});

export default styles;
