import slugify from "slugify";

export function createBaseSlug(parts) {
  return slugify(parts.filter(Boolean).join(" "), {
    lower: true,
    strict: true,
    trim: true,
  });
}
