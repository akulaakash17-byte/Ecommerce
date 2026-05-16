const fallbackAnswer = {
  reply:
    "I can help with Siddipet listings, site visits, property listing, mandal and village filters, office contact, and payment questions. Tell me what you need, or choose one of the quick questions.",
  actionLabel: "View FAQ",
  actionTo: "/faq",
  matched: false,
};

const intentAnswers = [
  {
    keywords: ["visit", "schedule", "site", "time", "appointment"],
    reply:
      "To schedule a site visit, open the property you like and use WhatsApp or Call. Share the property name, village, and your preferred visit time. The office team will coordinate the visit offline.",
    actionLabel: "Browse listings",
    actionTo: "/properties",
  },
  {
    keywords: ["check before buying", "before buying", "buying land", "verify", "verified", "document", "documents", "registration", "legal", "approval"],
    reply:
      "Before buying land or property, confirm ownership documents, boundaries, approvals, survey details, road access, utilities, and registration status. Listings marked verified are reviewed by the office team, but final document checks and decisions happen offline.",
  },
  {
    keywords: ["listing", "listings", "property", "search", "available", "show", "plot", "land", "house", "villa"],
    reply:
      "You can browse available Siddipet district properties by mandal, village, property type, and price range. Open a listing to call, WhatsApp, or submit an inquiry.",
    actionLabel: "Open listings",
    actionTo: "/properties",
  },
  {
    keywords: ["sell", "list my", "add property", "owner", "agent", "post property"],
    reply:
      "To list your property, contact the Pragnapur office with the location, land area, expected price, owner details, and photos. The office team will review it before adding it.",
    actionLabel: "Contact office",
    actionTo: "/contact",
  },
  {
    keywords: ["payment", "pay", "online", "checkout", "booking", "book", "token", "advance"],
    reply:
      "There are no online payments, checkout, or booking features on this website. It is for discovery and inquiries only. Site visits, price discussion, documentation, token decisions, and final deals happen offline through the office.",
  },
  {
    keywords: ["contact", "phone", "call", "whatsapp", "office", "address"],
    reply:
      "You can call +91 9849972116, +91 9704061427, or +91 8897422872. You can also use the WhatsApp button or submit an inquiry form. The office is in Pragnapur, Gajwel Mandal, Siddipet District.",
    actionLabel: "Contact page",
    actionTo: "/contact",
  },
  {
    keywords: ["rrr", "regional ring road", "ring road", "corridor", "pragnapur"],
    reply:
      "For RRR Road information, open the RRR Road page. It covers route-plan context, Siddipet-side mandals and villages, and buyer verification checks around the Hyderabad Regional Ring Road.",
    actionLabel: "Open RRR Road page",
    actionTo: "/rrr-road",
  },
  {
    keywords: ["mandal", "village", "area", "location", "gajwel", "pragnapur", "siddipet", "wargal", "markook"],
    reply:
      "The listings page supports mandal and village filters for Siddipet district. Select a mandal first, then the matching villages load dynamically.",
    actionLabel: "Filter properties",
    actionTo: "/properties",
  },
];

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function getLocalChatbotReply(message) {
  const normalized = normalizeText(message);
  const match = intentAnswers.find((intent) =>
    intent.keywords.some((keyword) => normalized.includes(keyword))
  );
  const answer = match || fallbackAnswer;

  return {
    reply: answer.reply,
    actionLabel: answer.actionLabel,
    actionTo: answer.actionTo,
    matched: Boolean(match),
    source: "local",
  };
}
