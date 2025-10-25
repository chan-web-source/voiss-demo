import type { ReviewAnalytics } from '../types/review';

export const mockAnalyticsData: ReviewAnalytics = {
 totalReviews: 108,
 averageRating: 4.6,
 ratingDistribution: {
  "1": 1,
  "2": 2,
  "3": 5,
  "4": 12,
  "5": 15,
  "6": 18,
  "7": 25,
  "8": 20,
  "9": 8,
  "10": 2
 },
 categoryAverages: {
  cleanliness: 8.7,
  communication: 8.2,
  location: 9.1,
  checkin: 8.5,
  accuracy: 8.3,
  value: 8.0
 },
 channelBreakdown: {
  "The Flex": 108
 },
 monthlyTrends: [
  { month: "Jul", count: 8, averageRating: 4.2 },
  { month: "Aug", count: 12, averageRating: 4.4 },
  { month: "Sep", count: 18, averageRating: 4.5 },
  { month: "Oct", count: 22, averageRating: 4.6 },
  { month: "Nov", count: 20, averageRating: 4.7 },
  { month: "Dec", count: 28, averageRating: 4.6 }
 ],
 topProperties: [
  { name: "2B N1 A - 29 Shoreditch Heights", count: 24, averageRating: 4.8 },
  { name: "1B E1 B - 15 Canary Wharf Tower", count: 18, averageRating: 4.7 },
  { name: "3B Champs-Élysées - 15 Avenue", count: 15, averageRating: 4.5 },
  { name: "Studio W1 C - 42 Fitzrovia Square", count: 12, averageRating: 4.3 },
  { name: "2B Algiers Center - 8 Rue Didouche", count: 8, averageRating: 4.4 }
 ],
 commonIssues: [
  { issue: "Wi-Fi connectivity", count: 12, severity: "high" },
  { issue: "Noise levels", count: 8, severity: "medium" },
  { issue: "Cleaning standards", count: 6, severity: "medium" },
  { issue: "Check-in process", count: 4, severity: "low" }
 ],
 performanceAlerts: [
  {
   title: "Low Rating Alert",
   message: "Studio W1 C - 42 Fitzrovia Square has dropped below 4.5 rating",
   priority: "medium"
  },
  {
   title: "High Issue Volume",
   message: "Wi-Fi connectivity issues reported in 12 reviews this month",
   priority: "high"
  }
 ]
};
