import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function BrandedHeader({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <Image
        source={require("../../../../assets/images/icon.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
