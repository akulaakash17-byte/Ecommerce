import bcrypt from "bcryptjs";
import { pool, query, testConnection } from "../config/db.js";
import { createBaseSlug } from "../utils/slug.js";

const demoPassword = "DemoAgent@123";
const demoUsers = [
  {
    name: "Srinivas Akula",
    phone: "+919849972116",
    email: "srinivas.demo@sidrealestate.local",
    role: "admin",
  },
  {
    name: "Akash Kumar",
    phone: "+919704061427",
    email: "akash.agent@sidrealestate.local",
    role: "agent",
  },
  {
    name: "Mounika Reddy",
    phone: "+918897422872",
    email: "mounika.agent@sidrealestate.local",
    role: "agent",
  },
];

const propertyImages = {
  plots: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1400&q=85",
  ],
  farm: [
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1400&q=85",
  ],
  home: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
  ],
  villa: [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
  ],
  commercial: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1400&q=85",
  ],
};

const demoProperties = [
  {
    title: "Verified HMDA Open Plot near Gajwel Main Road",
    description:
      "East-facing residential open plot with clear road access, nearby electricity, and fast access to Gajwel bus stand. Suitable for building an independent house or holding as a short-term investment.",
    price: 1850000,
    mandal: "Gajwel",
    village: "Pragnapur",
    property_type: "Open Plot",
    land_area: "267 sq yd",
    images: propertyImages.plots,
    owner_name: "Ramesh Patel",
    phone: "+919849972116",
    is_verified: true,
    status: "available",
    createdOffsetDays: 1,
  },
  {
    title: "RRR Corridor Agricultural Land with Borewell",
    description:
      "Fertile agricultural land close to the Regional Ring Road influence belt. The parcel has a working borewell, red soil, and a usable approach road for farm activity or future conversion planning.",
    price: 7200000,
    mandal: "Markook",
    village: "Pamulaparthi",
    property_type: "Agricultural Land",
    land_area: "3 acres",
    images: propertyImages.farm,
    owner_name: "Kiran Goud",
    phone: "+919704061427",
    is_verified: true,
    status: "available",
    createdOffsetDays: 2,
  },
  {
    title: "Ready House for Sale in Siddipet Town Limits",
    description:
      "Well-maintained 2 BHK independent house with municipal water, parking space, and easy access to schools and daily needs. Documentation has been checked by the office team.",
    price: 5600000,
    mandal: "Siddipet Urban",
    village: "Siddipet",
    property_type: "House",
    land_area: "180 sq yd built-up",
    images: propertyImages.home,
    owner_name: "Lakshmi Narayana",
    phone: "+918897422872",
    is_verified: true,
    status: "available",
    createdOffsetDays: 3,
  },
  {
    title: "Premium Villa Plot Facing 40 Feet Road",
    description:
      "Premium plot in a peaceful residential pocket with 40 feet road frontage. Best suited for a duplex villa plan, with nearby homes already under construction.",
    price: 3450000,
    mandal: "Mulugu",
    village: "Mulugu",
    property_type: "Villa",
    land_area: "400 sq yd",
    images: propertyImages.villa,
    owner_name: "Harish Rao",
    phone: "+919849972116",
    is_verified: true,
    status: "available",
    createdOffsetDays: 4,
  },
  {
    title: "Commercial Building on Busy Gajwel Junction",
    description:
      "Ground plus one commercial building with shutter frontage and rental demand from retail tenants. Located near a busy junction with strong daily visibility.",
    price: 12500000,
    mandal: "Gajwel",
    village: "Gajwel",
    property_type: "Commercial",
    land_area: "220 sq yd site",
    images: propertyImages.commercial,
    owner_name: "Naveen Kumar",
    phone: "+919704061427",
    is_verified: true,
    status: "available",
    createdOffsetDays: 5,
  },
  {
    title: "Budget Open Plot near Wargal Temple Road",
    description:
      "Affordable open plot with clear boundaries and a calm neighborhood. Good choice for buyers looking for a low-entry residential investment near Wargal.",
    price: 980000,
    mandal: "Wargal",
    village: "Wargal",
    property_type: "Open Plot",
    land_area: "150 sq yd",
    images: propertyImages.plots.slice().reverse(),
    owner_name: "Mahesh Reddy",
    phone: "+918897422872",
    is_verified: false,
    status: "available",
    createdOffsetDays: 6,
  },
  {
    title: "Irrigated Farm Land near Jagdevpur",
    description:
      "Agricultural land with useful road approach, nearby transformer line, and active cultivation in the surrounding parcels. Suitable for farming, farmhouse plans, or long-term land banking.",
    price: 4650000,
    mandal: "Jagdevpur",
    village: "Munigadapa",
    property_type: "Agricultural Land",
    land_area: "2 acres",
    images: propertyImages.farm.slice().reverse(),
    owner_name: "Suresh Yadav",
    phone: "+919849972116",
    is_verified: true,
    status: "available",
    createdOffsetDays: 7,
  },
  {
    title: "Corner Plot near Komuravelli Temple Route",
    description:
      "Corner residential plot on a developing internal road, close to the Komuravelli temple route. The layout is easy to inspect and boundaries are visible on site.",
    price: 1425000,
    mandal: "Komuravelli",
    village: "Komuravelli",
    property_type: "Open Plot",
    land_area: "183 sq yd",
    images: [propertyImages.plots[1], propertyImages.plots[2], propertyImages.home[2]],
    owner_name: "Praveen Reddy",
    phone: "+919704061427",
    is_verified: true,
    status: "available",
    createdOffsetDays: 8,
  },
  {
    title: "Dubbak Roadside Commercial Site",
    description:
      "Road-facing commercial site suitable for a small showroom, service center, or rental shutters. It has good approach width and high visibility from the local traffic route.",
    price: 6800000,
    mandal: "Dubbak",
    village: "Dubbak",
    property_type: "Commercial",
    land_area: "300 sq yd",
    images: [propertyImages.commercial[1], propertyImages.commercial[0], propertyImages.plots[0]],
    owner_name: "Anil Chary",
    phone: "+918897422872",
    is_verified: true,
    status: "available",
    createdOffsetDays: 9,
  },
  {
    title: "Independent House near Husnabad Market",
    description:
      "Compact independent house close to the local market, with bore connection, parking for two-wheelers, and immediate occupancy potential after minor painting work.",
    price: 3250000,
    mandal: "Husnabad",
    village: "Husnabad",
    property_type: "House",
    land_area: "120 sq yd",
    images: [propertyImages.home[1], propertyImages.home[0], propertyImages.home[2]],
    owner_name: "Raju Sharma",
    phone: "+919849972116",
    is_verified: false,
    status: "available",
    createdOffsetDays: 10,
  },
  {
    title: "Sold Sample Plot in Cherial Layout",
    description:
      "Completed transaction sample retained for admin reporting and sold-listing display checks. Similar verified plots are available nearby through the office team.",
    price: 1180000,
    mandal: "Cherial",
    village: "Cherial",
    property_type: "Open Plot",
    land_area: "165 sq yd",
    images: [propertyImages.plots[2], propertyImages.plots[0], propertyImages.plots[1]],
    owner_name: "Vijay Kumar",
    phone: "+919704061427",
    is_verified: true,
    status: "sold",
    createdOffsetDays: 11,
  },
  {
    title: "Large Farm Parcel near Koheda",
    description:
      "Large farm parcel in a green belt near Koheda with village road access and scope for seasonal cultivation. The site is suitable for buyers seeking bigger acreage.",
    price: 13200000,
    mandal: "Koheda",
    village: "Koheda",
    property_type: "Agricultural Land",
    land_area: "5.5 acres",
    images: [propertyImages.farm[2], propertyImages.farm[0], propertyImages.farm[1]],
    owner_name: "Madhavi Reddy",
    phone: "+918897422872",
    is_verified: true,
    status: "available",
    createdOffsetDays: 12,
  },
];

const demoInquiries = [
  {
    name: "Rajesh Kumar",
    phone: "+919876543210",
    message: "Interested in a site visit this weekend. Please share exact location and final price.",
    propertyTitle: "Verified HMDA Open Plot near Gajwel Main Road",
    status: "new",
    assignedAgentEmail: "akash.agent@sidrealestate.local",
    createdOffsetDays: 0,
  },
  {
    name: "Priya Reddy",
    phone: "+919765432109",
    message: "Looking for agricultural land near the RRR corridor. Need details about road access.",
    propertyTitle: "RRR Corridor Agricultural Land with Borewell",
    status: "contacted",
    status_note: "Called and shared location pin. Site visit planned.",
    assignedAgentEmail: "mounika.agent@sidrealestate.local",
    createdOffsetDays: 1,
  },
  {
    name: "Sandeep Rao",
    phone: "+919654321098",
    message: "Please confirm if bank loan support is possible for the Siddipet house.",
    propertyTitle: "Ready House for Sale in Siddipet Town Limits",
    status: "new",
    assignedAgentEmail: "akash.agent@sidrealestate.local",
    createdOffsetDays: 2,
  },
  {
    name: "Anusha Goud",
    phone: "+919543210987",
    message: "Need options below 20 lakhs near Wargal or Gajwel for investment.",
    propertyTitle: "Budget Open Plot near Wargal Temple Road",
    status: "closed",
    status_note: "Shortlisted two plots and customer will revisit next month.",
    assignedAgentEmail: "mounika.agent@sidrealestate.local",
    createdOffsetDays: 4,
  },
  {
    name: "Vikram Singh",
    phone: "+919432109876",
    message: "Interested in commercial site. Please arrange owner meeting.",
    propertyTitle: "Dubbak Roadside Commercial Site",
    status: "contacted",
    status_note: "Owner meeting requested for Friday.",
    assignedAgentEmail: "akash.agent@sidrealestate.local",
    createdOffsetDays: 5,
  },
];

async function upsertUser(user, passwordHash) {
  const result = await query(
    `INSERT INTO users (name, username, phone, email, password, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (email) DO UPDATE
       SET name = EXCLUDED.name,
           username = EXCLUDED.username,
           phone = EXCLUDED.phone,
           password = EXCLUDED.password,
           role = EXCLUDED.role
     RETURNING id, name, email, role`,
    [user.name, user.email, user.phone, user.email, passwordHash, user.role]
  );

  return result.rows[0];
}

async function upsertProperty(property, createdBy) {
  const slug = createBaseSlug([property.title, property.village, property.mandal]);
  const result = await query(
    `INSERT INTO properties (
       slug, title, description, price, district, mandal, village, property_type,
       land_area, images, video_url, owner_name, phone, is_verified, status, created_by, created_at, updated_at
     )
     VALUES (
       $1, $2, $3, $4, 'Siddipet', $5, $6, $7,
       $8, $9::jsonb, '', $10, $11, $12, $13, $14,
       NOW() - ($15::int * interval '1 day'),
       NOW() - ($15::int * interval '1 day')
     )
     ON CONFLICT (slug) DO UPDATE
       SET title = EXCLUDED.title,
           description = EXCLUDED.description,
           price = EXCLUDED.price,
           district = EXCLUDED.district,
           mandal = EXCLUDED.mandal,
           village = EXCLUDED.village,
           property_type = EXCLUDED.property_type,
           land_area = EXCLUDED.land_area,
           images = EXCLUDED.images,
           video_url = EXCLUDED.video_url,
           owner_name = EXCLUDED.owner_name,
           phone = EXCLUDED.phone,
           is_verified = EXCLUDED.is_verified,
           status = EXCLUDED.status,
           created_by = EXCLUDED.created_by,
           updated_at = NOW()
     RETURNING id, title, slug`,
    [
      slug,
      property.title,
      property.description,
      property.price,
      property.mandal,
      property.village,
      property.property_type,
      property.land_area,
      JSON.stringify(property.images),
      property.owner_name,
      property.phone,
      property.is_verified,
      property.status,
      createdBy,
      property.createdOffsetDays,
    ]
  );

  return result.rows[0];
}

async function resetDemoActivity() {
  const phones = demoInquiries.map((inquiry) => inquiry.phone);
  await query(
    `DELETE FROM agent_followups
     WHERE phone = ANY($1::text[])
        OR inquiry_id IN (SELECT id FROM inquiries WHERE phone = ANY($1::text[]))`,
    [phones]
  );
  await query("DELETE FROM notification_logs WHERE inquiry_id IN (SELECT id FROM inquiries WHERE phone = ANY($1::text[]))", [phones]);
  await query("DELETE FROM inquiries WHERE phone = ANY($1::text[])", [phones]);
  await query("DELETE FROM audit_logs WHERE metadata->>'source' = 'dummy-seed'");
}

async function createInquiry(inquiry, propertyByTitle, userByEmail) {
  const property = propertyByTitle.get(inquiry.propertyTitle);
  const assignedAgent = userByEmail.get(inquiry.assignedAgentEmail);
  const result = await query(
    `INSERT INTO inquiries (
       property_id, name, phone, message, status, status_note, assigned_to, created_at, updated_at
     )
     VALUES (
       $1, $2, $3, $4, $5, $6, $7,
       NOW() - ($8::int * interval '1 day'),
       NOW() - ($8::int * interval '1 day')
     )
     RETURNING id, name, phone, property_id, assigned_to`,
    [
      property?.id || null,
      inquiry.name,
      inquiry.phone,
      inquiry.message,
      inquiry.status,
      inquiry.status_note || "",
      assignedAgent?.id || null,
      inquiry.createdOffsetDays,
    ]
  );

  return result.rows[0];
}

async function createFollowUps(inquiries, propertyByTitle, userByEmail) {
  const followUps = [
    {
      inquiry: inquiries[1],
      propertyTitle: "RRR Corridor Agricultural Land with Borewell",
      agentEmail: "mounika.agent@sidrealestate.local",
      email: "priya@example.com",
      message: "Customer wants to inspect road access and borewell point before negotiating.",
      next_action: "Schedule site visit and collect latest village map copy.",
      status: "pending",
    },
    {
      inquiry: inquiries[4],
      propertyTitle: "Dubbak Roadside Commercial Site",
      agentEmail: "akash.agent@sidrealestate.local",
      email: "vikram@example.com",
      message: "Customer is comparing rental yield for commercial use.",
      next_action: "Arrange owner meeting and share frontage measurements.",
      status: "accepted",
      admin_note: "Proceed with owner meeting.",
    },
    {
      inquiry: inquiries[3],
      propertyTitle: "Budget Open Plot near Wargal Temple Road",
      agentEmail: "mounika.agent@sidrealestate.local",
      email: "anusha@example.com",
      message: "Buyer paused decision after reviewing budget options.",
      next_action: "Follow up next month with updated low-budget inventory.",
      status: "rejected",
      admin_note: "Keep warm, no immediate action.",
    },
  ];

  for (const followUp of followUps) {
    const property = propertyByTitle.get(followUp.propertyTitle);
    const agent = userByEmail.get(followUp.agentEmail);
    await query(
      `INSERT INTO agent_followups (
         agent_id, property_id, inquiry_id, customer_name, phone, email, message,
         next_action, status, admin_note, created_at, updated_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
      [
        agent?.id || null,
        property?.id || null,
        followUp.inquiry?.id || null,
        followUp.inquiry?.name || "Demo Customer",
        followUp.inquiry?.phone || "",
        followUp.email,
        followUp.message,
        followUp.next_action,
        followUp.status,
        followUp.admin_note || "",
      ]
    );
  }
}

async function createAuditLogs(properties, adminId) {
  for (const property of properties.slice(0, 8)) {
    await query(
      `INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, entity_label, metadata, created_at)
       VALUES ($1, 'property.seeded', 'property', $2, $3, $4::jsonb, NOW())`,
      [
        adminId,
        property.id,
        property.title,
        JSON.stringify({ source: "dummy-seed", slug: property.slug }),
      ]
    );
  }
}

try {
  const connection = await testConnection();
  const passwordHash = await bcrypt.hash(demoPassword, 10);
  const users = [];

  for (const user of demoUsers) {
    users.push(await upsertUser(user, passwordHash));
  }

  const userByEmail = new Map(users.map((user) => [user.email, user]));
  const admin = users.find((user) => user.role === "admin") || users[0];
  const properties = [];

  for (const property of demoProperties) {
    properties.push(await upsertProperty(property, admin.id));
  }

  const propertyByTitle = new Map(properties.map((property) => [property.title, property]));
  await resetDemoActivity();

  const inquiries = [];
  for (const inquiry of demoInquiries) {
    inquiries.push(await createInquiry(inquiry, propertyByTitle, userByEmail));
  }

  await createFollowUps(inquiries, propertyByTitle, userByEmail);
  await createAuditLogs(properties, admin.id);

  console.log(`Database connected at ${connection.now.toISOString()}`);
  console.log(`Seeded ${users.length} demo users, ${properties.length} properties, ${inquiries.length} inquiries, and 3 follow-ups.`);
  console.log(`Demo user password: ${demoPassword}`);
} catch (error) {
  console.error("Dummy data seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
