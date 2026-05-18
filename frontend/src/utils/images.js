export const FALLBACK_PROPERTY_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1800&q=85";

function getApiOrigin() {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) return "";

  try {
    return new URL(apiUrl).origin;
  } catch {
    return "";
  }
}

export function resolveMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;

  const apiOrigin = getApiOrigin();
  return apiOrigin ? `${apiOrigin}${url.startsWith("/") ? url : `/${url}`}` : url;
}

export function resolveImage(image) {
  if (!image) return FALLBACK_PROPERTY_IMAGE;
  return resolveMediaUrl(image) || FALLBACK_PROPERTY_IMAGE;
}
