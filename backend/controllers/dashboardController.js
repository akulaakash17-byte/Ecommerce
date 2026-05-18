import { InquiryModel } from "../models/inquiryModel.js";
import { FollowUpModel } from "../models/followUpModel.js";
import { PropertyModel } from "../models/propertyModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardOverview = asyncHandler(async (req, res) => {
  const [
    propertyStats,
    leadCount,
    inquiriesToday,
    pendingFollowUps,
    recentProperties,
    recentInquiries,
    inquiryTrend,
    propertyTrend,
  ] = await Promise.all([
    PropertyModel.stats(),
    InquiryModel.count(),
    InquiryModel.countToday(req.user),
    FollowUpModel.countPending(req.user),
    PropertyModel.list({ includeSold: "true", limit: 5 }),
    InquiryModel.list({ limit: 5 }, req.user),
    InquiryModel.recentCounts(7, req.user),
    PropertyModel.recentCounts(7),
  ]);

  res.json({
    stats: {
      ...propertyStats,
      leads: leadCount,
      inquiriesToday,
      pendingFollowUps,
    },
    recentProperties: recentProperties.data,
    recentInquiries: recentInquiries.data,
    trends: {
      inquiries: inquiryTrend,
      properties: propertyTrend,
    },
  });
});
