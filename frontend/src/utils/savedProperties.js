const savedPropertiesKey = "savedProperties";

export function readSavedPropertyIds() {
  try {
    const ids = JSON.parse(localStorage.getItem(savedPropertiesKey) || "[]");
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function isPropertySaved(propertyId) {
  return readSavedPropertyIds().includes(propertyId);
}

export function toggleSavedProperty(propertyId) {
  const saved = readSavedPropertyIds();
  const next = saved.includes(propertyId) ? saved.filter((id) => id !== propertyId) : [...saved, propertyId];
  localStorage.setItem(savedPropertiesKey, JSON.stringify(next));
  window.dispatchEvent(new Event("saved-properties-changed"));
  return next.includes(propertyId);
}

export function removeSavedProperty(propertyId) {
  const next = readSavedPropertyIds().filter((id) => id !== propertyId);
  localStorage.setItem(savedPropertiesKey, JSON.stringify(next));
  window.dispatchEvent(new Event("saved-properties-changed"));
  return next;
}
