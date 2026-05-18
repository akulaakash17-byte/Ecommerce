export const FALLBACK_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=85";

export function resolveImage(image) {
  if (!image) return FALLBACK_PROPERTY_IMAGE;
  return image.startsWith("http") ? image : image;
}
