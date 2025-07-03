import { View, Text, Image } from "react-native";
import { Product } from "../../../../shared/types/product";
import { CirclePlus } from "lucide-react-native";
import styles from "./ProductCard.styles";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <CirclePlus style={styles.addButton} />
      <Text style={styles.name}>{product.name}</Text>
      {product.b2cPrice && <Text style={styles.price}>{product.b2cPrice}</Text>}
      {product.b2bPrice && <Text style={styles.price}>{product.b2bPrice}</Text>}
    </View>
  );
}
