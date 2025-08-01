import { API_BASE_URL } from "../config/apiConfig";

/**
 * Constructs a full image URL from a relative path
 * @param imagePath - The relative image path from the database
 * @returns The full URL to the image
 */
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) {
    // Return a placeholder image if no path is provided
    return "https://via.placeholder.com/200x150/E3E3E3/999999?text=No+Image";
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a relative path starting with /assets/eggs, convert to /assets/images/Eggs for server static path
  if (imagePath.startsWith("/assets/eggs/")) {
    // Capitalize 'eggs' to 'Eggs' and insert 'images' for the static server path
    const fixedPath = imagePath.replace(
      "/assets/eggs/",
      "/assets/images/Eggs/"
    );
    return `${API_BASE_URL}${fixedPath}`;
  }

  // If it's a relative path starting with /assets, just append to API_BASE_URL
  if (imagePath.startsWith("/assets")) {
    return `${API_BASE_URL}${imagePath}`;
  }

  // If it's a relative path starting with /, treat as /assets/images/Eggs/...
  if (imagePath.startsWith("/")) {
    return `${API_BASE_URL}/assets/images/Eggs${imagePath}`;
  }

  // If it's just a filename, construct the full path
  return `${API_BASE_URL}/assets/images/Eggs/${imagePath}`;
};

/**
 * Generates a placeholder image URL based on product information
 * @param productName - The name of the product
 * @param category - The category of the product
 * @returns A placeholder image URL
 */
export const getPlaceholderImage = (
  productName?: string,
  category?: string
): string => {
  const colors = ["8B4513", "DEB887", "F5DEB3", "CD853F"]; // Brown tones for eggs
  const text = productName || category || "Product";
  const colorIndex = Math.floor(Math.random() * colors.length);
  return `https://via.placeholder.com/200x150/${
    colors[colorIndex]
  }/FFFFFF?text=${encodeURIComponent(text)}`;
};
