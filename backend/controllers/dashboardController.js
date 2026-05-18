import { InquiryModel } from "../models/inquiryModel.js";
import { PropertyModel } from "../models/propertyModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardOverview = asyncHandler(async (req, res) => {
  const [propertyStats, leadCount, recentProperties, recentInquiries] = await Promise.all([
    PropertyModel.stats(),
    InquiryModel.count(),
    PropertyModel.list({ includeSold: "true", limit: 5 }),
    InquiryModel.list({ limit: 5 }, req.user),
  ]);

  res.json({
    stats: {
      ...propertyStats,
      leads: leadCount,
    },
    recentProperties: recentProperties.data,
    recentInquiries: recentInquiries.data,
  });
});
