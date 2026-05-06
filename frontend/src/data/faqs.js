export const FAQS = [
  {
    category: "Buying Process",
    items: [
      {
        question: "Can I buy or pay for a property online?",
        answer:
          "No. This website is only for property discovery and inquiries. Site visits, price discussion, documentation, token decisions, and final deals happen offline through the Pragnapur office.",
      },
      {
        question: "How do I schedule a site visit?",
        answer:
          "Open a property, tap WhatsApp or Call, and share the property name, village, and your preferred visit time. The office team will coordinate with the agent or seller.",
      },
      {
        question: "Are properties verified?",
        answer:
          "Listings marked verified have been reviewed by the office team. Buyers should still confirm documents, boundaries, approvals, and ownership details before making any offline decision.",
      },
    ],
  },
  {
    category: "Locations",
    items: [
      {
        question: "Which areas do you cover?",
        answer:
          "The platform focuses on Siddipet district, including Gajwel, Pragnapur, Wargal, Mulugu, Markook, Jagdevpur, Siddipet Urban, Siddipet Rural, and nearby mandals.",
      },
      {
        question: "Can I search by mandal and village?",
        answer:
          "Yes. The listings page has dynamic mandal and village filters powered by the Siddipet location dataset.",
      },
      {
        question: "Do you handle properties outside Siddipet?",
        answer:
          "The current focus is Siddipet district. You can contact the office for nearby location requirements and the team will confirm availability.",
      },
    ],
  },
  {
    category: "Listings",
    items: [
      {
        question: "What property types are listed?",
        answer:
          "Open plots, agricultural land, houses, villas, and commercial properties can be listed and managed by the office team.",
      },
      {
        question: "How do I list my property?",
        answer:
          "Contact the Pragnapur office with property location, land area, expected price, owner details, and images. The admin or agent can add it to the dashboard after review.",
      },
      {
        question: "What does sold status mean?",
        answer:
          "Sold means the office team has marked that listing as no longer available. Sold properties are hidden from normal public search by default.",
      },
    ],
  },
  {
    category: "Contact",
    items: [
      {
        question: "How can I contact the office?",
        answer:
          "Use the WhatsApp button, call +91 9849972116, +91 9704061427, or +91 8897422872, or submit the inquiry form on the contact or property details page.",
      },
      {
        question: "Where is the office?",
        answer:
          "The office is located in Pragnapur, Gajwel Mandal, Siddipet District, Telangana.",
      },
    ],
  },
];

export const CHATBOT_PROMPTS = [
  "How do I schedule a site visit?",
  "Show me listings",
  "How can I list my property?",
  "Do you take online payments?",
  "Contact office",
];

const intentAnswers = [
  {
    keywords: ["visit", "schedule", "site", "time"],
    answer:
      "To schedule a site visit, open the property you like and use WhatsApp or Call. Share the property name, village, and your preferred visit time.",
    actionLabel: "Browse listings",
    actionTo: "/properties",
  },
  {
    keywords: ["listing", "listings", "property", "search", "available", "show"],
    answer:
      "You can browse available Siddipet district properties by mandal, village, property type, and price range.",
    actionLabel: "Open listings",
    actionTo: "/properties",
  },
  {
    keywords: ["sell", "list my", "add property", "owner", "agent"],
    answer:
      "To list your property, contact the Pragnapur office with location, land area, expected price, owner details, and photos. The office team will review and add it.",
    actionLabel: "Contact office",
    actionTo: "/contact",
  },
  {
    keywords: ["payment", "pay", "online", "checkout", "booking", "book"],
    answer:
      "There are no online payments, checkout, or booking features. This app is only for discovery and communication. Deals happen offline through the office.",
  },
  {
    keywords: ["contact", "phone", "call", "whatsapp", "office"],
    answer:
      "You can call +91 9849972116, +91 9704061427, or +91 8897422872. You can also use the WhatsApp button or submit an inquiry form.",
    actionLabel: "Contact page",
    actionTo: "/contact",
  },
  {
    keywords: ["mandal", "village", "area", "location", "gajwel", "pragnapur", "siddipet"],
    answer:
      "The listings page supports mandal and village filters for Siddipet district. Select a mandal first, then the villages load dynamically.",
    actionLabel: "Filter properties",
    actionTo: "/properties",
  },
];

export function getChatbotReply(message) {
  const normalized = message.toLowerCase();
  const match = intentAnswers.find((intent) =>
    intent.keywords.some((keyword) => normalized.includes(keyword))
  );

  if (match) {
    return match;
  }

  return {
    answer:
      "I can help with listings, site visits, property listing, mandal/village filters, office contact, and payment questions. Choose a quick question or type what you need.",
    actionLabel: "View FAQ",
    actionTo: "/faq",
  };
}
