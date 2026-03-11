export function resolveImageUrl(imagePath?: string | null): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;

  const base = (process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:3001/api').replace(/\/$/, '');
  const origin = base.replace(/\/api$/, '');
  return `${origin}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
}
