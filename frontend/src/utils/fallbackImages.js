const fallbackImages = [
  'https://images.unsplash.com/photo-1510552776732-07f2d5516a36?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518444022096-5e42fe6b1959?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1580910051072-49a89bbf24d2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512499617640-c2f999f0c0db?auto=format&fit=crop&w=800&q=80',
];

export function getProductImageUrl(product, index = 0) {
  const imageUrl = product?.image_url || product?.imageUrl || product?.image || '';
  if (imageUrl) {
    return imageUrl;
  }

  const name = (product?.name || '').toLowerCase();
  if (name.includes('phone') || name.includes('smartphone')) {
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('watch')) {
    return 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('earbud') || name.includes('headphone') || name.includes('audio')) {
    return 'https://images.unsplash.com/photo-1518444022096-5e42fe6b1959?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('tablet')) {
    return 'https://images.unsplash.com/photo-1580910051072-49a89bbf24d2?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('battery') || name.includes('charger') || name.includes('power')) {
    return 'https://images.unsplash.com/photo-1510552776732-07f2d5516a36?auto=format&fit=crop&w=800&q=80';
  }
  return fallbackImages[index % fallbackImages.length];
}
