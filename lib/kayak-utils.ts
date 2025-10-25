import type { KayakReview } from '../types/review';
import type { ReviewData } from '../types/dashboard';

/**
 * Converts a Kayak review to our internal ReviewData format
 */
export const convertKayakReviewToInternal = (kayakReview: KayakReview, propertyName: string): ReviewData => {
 // Convert score (0-100) to rating (1-5)
 const rating = Math.round((kayakReview.score / 100) * 5 * 10) / 10; // Round to 1 decimal place

 // Combine positive and negative comments
 const comment = `${kayakReview.positiveComment} ${kayakReview.negativeComment}`.trim();

 // Determine if review should be approved based on score
 const isApproved = kayakReview.score >= 60; // Approve reviews with 60+ score

 // Determine if review should be public based on score
 const isPublic = kayakReview.score >= 70; // Make public reviews with 70+ score

 return {
  id: `kayak-${kayakReview.id}`,
  propertyId: `prop-${kayakReview.id}`,
  propertyName,
  guestName: kayakReview.author,
  rating,
  comment,
  channel: 'The Flex', // Map to our single platform
  category: 'Cleanliness', // Default category, can be enhanced later
  submittedAt: new Date().toISOString(), // Use current date as fallback
  isApproved,
  isPublic
 };
};

/**
 * Converts multiple Kayak reviews to internal format
 */
export const convertKayakReviewsToInternal = (kayakReviews: KayakReview[], propertyName: string): ReviewData[] => {
 return kayakReviews.map(review => convertKayakReviewToInternal(review, propertyName));
};

/**
 * Gets the site name from Kayak review
 */
export const getSiteName = (kayakReview: KayakReview): string => {
 return kayakReview.siteName || 'Unknown';
};

/**
 * Gets the review source URL
 */
export const getReviewUrl = (kayakReview: KayakReview): string => {
 return kayakReview.siteLink || '#';
};
