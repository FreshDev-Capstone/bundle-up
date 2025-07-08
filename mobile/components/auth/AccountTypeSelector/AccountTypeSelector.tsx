import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./AccountTypeSelector.styles";

interface Props {
  onSelect: (type: "B2B" | "B2C") => void;
}

export default function AccountTypeSelector({ onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Account Type</Text>
      <TouchableOpacity style={styles.button} onPress={() => onSelect("B2C")}>
        <Text style={styles.buttonText}>Customer (B2C)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => onSelect("B2B")}>
        <Text style={styles.buttonText}>Business (B2B)</Text>
      </TouchableOpacity>
    </View>
  );
}
