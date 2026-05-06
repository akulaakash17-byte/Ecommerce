import { body, param } from "express-validator";

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
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required."),
  body("phone").trim().isLength({ min: 6 }).withMessage("Phone number is required."),
  body("message").trim().isLength({ min: 5 }).withMessage("Message is required."),
];

export const idParamRule = [param("id").isInt({ min: 1 }).withMessage("Invalid id.")];
