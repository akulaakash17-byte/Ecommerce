import { body, param } from "express-validator";

const nameRegex = /^[A-Za-z][A-Za-z .'-]{1,79}$/;
const indianMobileRegex = /^(?:\+?91)?[6-9]\d{9}$/;
const inquiryMessageRegex = /^(?=.*[A-Za-z0-9])[A-Za-z0-9\s.,'"/!?()&:+-]{5,500}$/;

export const loginRules = [
  body("email").isEmail().withMessage("Valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
];

export const userRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required."),
  body("phone").optional({ values: "falsy" }).trim().isLength({ min: 6 }),
  body("email").isEmail().withMessage("Valid email is required."),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
  body("role").isIn(["admin", "agent"]).withMessage("Role must be admin or agent."),
];

export const changePasswordRules = [
  body("currentPassword").notEmpty().withMessage("Current password is required."),
  body("newPassword").isLength({ min: 8 }).withMessage("New password must be at least 8 characters."),
];

export const resetPasswordRules = [
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
];

export const propertyRules = [
  body("title").trim().isLength({ min: 3 }).withMessage("Property title is required."),
  body("description").trim().isLength({ min: 10 }).withMessage("Description is required."),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a valid number."),
  body("mandal").trim().notEmpty().withMessage("Mandal is required."),
  body("village").trim().notEmpty().withMessage("Village is required."),
  body("property_type")
    .isIn(["Open Plot", "Agricultural Land", "House", "Villa", "Commercial"])
    .withMessage("Invalid property type."),
  body("phone").trim().isLength({ min: 6 }).withMessage("Contact phone is required."),
  body("status").optional().isIn(["available", "sold"]),
];

export const inquiryRules = [
  body("property_id").optional({ values: "falsy" }).isInt({ min: 1 }),
  body("name")
    .trim()
    .matches(nameRegex)
    .withMessage("Enter a valid name using letters, spaces, apostrophes, periods, or hyphens."),
  body("phone")
    .trim()
    .matches(indianMobileRegex)
    .withMessage("Enter a valid 10-digit Indian mobile number, optionally starting with +91. Letters are not allowed."),
  body("message")
    .trim()
    .matches(inquiryMessageRegex)
    .withMessage("Enter 5 to 500 characters using letters, numbers, spaces, and common punctuation."),
];

export const inquiryStatusRules = [
  body("status").isIn(["new", "contacted", "closed"]).withMessage("Status must be new, contacted, or closed."),
  body("status_note").optional({ values: "falsy" }).trim().isLength({ min: 2 }),
];

export const inquiryAssignmentRules = [
  body("assigned_to").optional({ values: "falsy" }).isInt({ min: 1 }).withMessage("Assigned user must be a valid id."),
];

export const chatbotRules = [
  body("message").trim().isLength({ min: 2, max: 500 }).withMessage("Message must be between 2 and 500 characters."),
  body("history")
    .optional()
    .isArray({ max: 8 })
    .withMessage("History must contain up to 8 messages."),
  body("history.*.role")
    .optional()
    .isIn(["user", "assistant"])
    .withMessage("Invalid chat history role."),
  body("history.*.text")
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Chat history text is too long."),
];

export const followUpRules = [
  body("property_id").optional({ values: "falsy" }).isInt({ min: 1 }),
  body("inquiry_id").optional({ values: "falsy" }).isInt({ min: 1 }),
  body("customer_name").trim().isLength({ min: 2 }).withMessage("Customer name is required."),
  body("phone").optional({ values: "falsy" }).trim().isLength({ min: 6 }),
  body("email").optional({ values: "falsy" }).isEmail().withMessage("Valid email is required."),
  body("message").trim().isLength({ min: 5 }).withMessage("Follow-up message is required."),
  body("next_action").optional({ values: "falsy" }).trim().isLength({ min: 2 }),
];

export const followUpStatusRules = [
  body("status").isIn(["accepted", "rejected"]).withMessage("Status must be accepted or rejected."),
  body("admin_note").optional({ values: "falsy" }).trim().isLength({ min: 2 }),
];

export const idParamRule = [param("id").isInt({ min: 1 }).withMessage("Invalid id.")];
