import { ADMIN_NAME, OFFICE_EMAIL } from "../data/propertyTypes";

export const DEFAULT_EMAIL_SUBJECT = "Property inquiry - Siddipet Real Estate";
export const DEFAULT_EMAIL_BODY = `Hi ${ADMIN_NAME},

I am interested in property options in Siddipet district. Please contact me with available listings and next steps.

Name:
Phone:
Preferred mandal/village:
Requirement:`;

export function createMailtoUrl({
  email = OFFICE_EMAIL,
  subject = DEFAULT_EMAIL_SUBJECT,
  body = DEFAULT_EMAIL_BODY,
} = {}) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
