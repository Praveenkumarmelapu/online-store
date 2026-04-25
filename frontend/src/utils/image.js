const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const API_HOST = API_BASE_URL.replace('/api', '');

export function getImageUrl(value) {
  if (!value || typeof value !== 'string') return null;
  return value.startsWith('http') ? value : `${API_HOST}${value}`;
}

export function getProductImageUrl(product) {
  if (!product) return null;
  // Prefer display_image (absolute URL from backend)
  if (product.display_image) return product.display_image;
  if (product.image_url) return product.image_url;
  return getImageUrl(product.image);
}
