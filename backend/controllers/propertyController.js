import { ApiError } from "../middleware/errorMiddleware.js";
import { PropertyModel } from "../models/propertyModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { storeUploadedImages, storeUploadedVideo } from "../utils/imageStorage.js";
import { createBaseSlug } from "../utils/slug.js";

async function createUniqueSlug(property, ignoredId = null) {
  const baseSlug = createBaseSlug([property.title, property.village, property.mandal]) || "property";
  let slug = baseSlug;
  let suffix = 2;

  while (await PropertyModel.slugExists(slug, ignoredId)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function parseBoolean(value) {
  return value === true || value === "true" || value === "on";
}

function parseExistingImages(value) {
  if (!value) return null;
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getUploadedImages(files = {}) {
  return [...(files.images || []), ...(files["images[]"] || [])];
}

export const listProperties = asyncHandler(async (req, res) => {
  const filters = {
    ...req.query,
    status: req.query.status || (req.query.includeSold === "true" ? undefined : "available"),
  };
  const properties = await PropertyModel.list(filters);
  res.json(properties);
});

export const getProperty = asyncHandler(async (req, res) => {
  const property = await PropertyModel.findByIdOrSlug(req.params.idOrSlug);

  if (!property) {
    throw new ApiError(404, "Property not found.");
  }

  res.json(property);
});

export const createProperty = asyncHandler(async (req, res) => {
  const images = await storeUploadedImages(getUploadedImages(req.files));
  const videoUrl = await storeUploadedVideo(req.files?.video);
  const propertyInput = {
    ...req.body,
    district: req.body.district || "Siddipet",
    images,
    video_url: videoUrl,
    is_verified: parseBoolean(req.body.is_verified),
    created_by: req.user.id,
  };

  propertyInput.slug = await createUniqueSlug(propertyInput);
  const property = await PropertyModel.create(propertyInput);

  res.status(201).json(property);
});

export const updateProperty = asyncHandler(async (req, res) => {
  const current = await PropertyModel.findById(req.params.id);

  if (!current) {
    throw new ApiError(404, "Property not found.");
  }

  const uploadedImages = await storeUploadedImages(getUploadedImages(req.files));
  const uploadedVideo = await storeUploadedVideo(req.files?.video);
  const existingImages = parseExistingImages(req.body.existingImages);
  const existingVideo = req.body.existingVideo || "";
  const nextImages = [...(existingImages || current.images || []), ...uploadedImages];
  const shouldRefreshSlug =
    req.body.title !== current.title || req.body.mandal !== current.mandal || req.body.village !== current.village;

  const propertyInput = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    district: req.body.district || "Siddipet",
    mandal: req.body.mandal,
    village: req.body.village,
    property_type: req.body.property_type,
    land_area: req.body.land_area || "",
    images: nextImages,
    video_url: uploadedVideo || existingVideo,
    owner_name: req.body.owner_name || "",
    phone: req.body.phone,
    is_verified: parseBoolean(req.body.is_verified),
    status: req.body.status || "available",
  };

  if (shouldRefreshSlug) {
    propertyInput.slug = await createUniqueSlug(propertyInput, current.id);
  }

  const property = await PropertyModel.update(req.params.id, propertyInput);
  res.json(property);
});

export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await PropertyModel.remove(req.params.id);

  if (!property) {
    throw new ApiError(404, "Property not found.");
  }

  res.json({ message: "Property deleted.", property });
});
