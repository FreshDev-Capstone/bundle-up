import { API_BASE_URL } from "../config/apiConfig";

/**
 * Constructs a full image URL from a relative path
 * @param imagePath - The relative image path from the database
 * @returns The full URL to the image
 */
export const getImageUrl = (imagePath: string): string => {
  console.log("[getImageUrl] Input imagePath:", imagePath);

  if (!imagePath) {
    console.log("[getImageUrl] No imagePath provided, returning placeholder");
    return "https://via.placeholder.com/400x300/E3E3E3/999999?text=No+Image";
  }

  // If it's already a full URL, handle special cases
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    console.log("[getImageUrl] Full URL detected:", imagePath);

    // Convert Unsplash photo page URLs to direct image URLs
    if (imagePath.includes("unsplash.com/photos/")) {
      console.log("[getImageUrl] Converting Unsplash URL");
      // Try different patterns to extract photo ID
      let photoId = null;

      // Pattern 1: /photos/description-ID format (e.g., five-broil-eggs-g8xdO1Q1kIg)
      const pattern1 = imagePath.match(
        /\/photos\/.*-([a-zA-Z0-9_-]{11})(?:\?|$)/
      );
      if (pattern1 && pattern1[1]) {
        photoId = pattern1[1];
      } else {
        // Pattern 2: /photos/ID format (simple ID)
        const pattern2 = imagePath.match(/\/photos\/([a-zA-Z0-9_-]+)(?:\?|$)/);
        if (pattern2 && pattern2[1]) {
          // If it looks like a description-ID, take the last part
          const parts = pattern2[1].split("-");
          const lastPart = parts[parts.length - 1];
          if (lastPart.length >= 10) {
            // Typical Unsplash ID length
            photoId = lastPart;
          } else {
            photoId = pattern2[1];
          }
        }
      }

      if (photoId) {
        const convertedUrl = `https://images.unsplash.com/photo-${photoId}?w=400&h=300&fit=crop&auto=format`;
        console.log("[getImageUrl] Converted Unsplash URL to:", convertedUrl);
        return convertedUrl;
      }
    }
    return imagePath;
  }

  // Handle local asset paths from your backend
  console.log("[getImageUrl] Local asset path detected:", imagePath);

  // If it's a relative path starting with /assets/eggs, convert to the correct backend path
  if (imagePath.startsWith("/assets/eggs/")) {
    // Convert /assets/eggs/... to /assets/images/Eggs/...
    const convertedPath = imagePath.replace(
      "/assets/eggs/",
      "/assets/images/Eggs/"
    );
    const fullUrl = `${API_BASE_URL}${convertedPath}`;
    console.log("[getImageUrl] Converted eggs path to backend URL:", fullUrl);
    return fullUrl;
  }

  // If it's a relative path starting with /assets, serve it through your backend
  if (imagePath.startsWith("/assets")) {
    const fullUrl = `${API_BASE_URL}${imagePath}`;
    console.log("[getImageUrl] Converted to backend URL:", fullUrl);
    return fullUrl;
  }

  // If it's just a filename or relative path, assume it's in the assets folder
  const fullUrl = `${API_BASE_URL}/assets/${imagePath}`;
  console.log("[getImageUrl] Treating as asset file, converted to:", fullUrl);
  return fullUrl;
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
