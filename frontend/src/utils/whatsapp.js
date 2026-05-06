import { OFFICE_WHATSAPP } from "../data/propertyTypes";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi, I am looking for property options in Siddipet district. Please share available listings.";

export function createWhatsAppUrl(message = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${OFFICE_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
