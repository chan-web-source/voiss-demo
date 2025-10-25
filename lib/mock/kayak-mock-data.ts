import type { KayakReviewsResponse } from "../../types/review";

/**
 * Mock data for Kayak reviews when API fails
 */
export const KAYAK_MOCK_DATA: KayakReviewsResponse = {
 reviewCount: 5,
 reviews: [
  {
   id: 'mock-1',
   author: 'John D.',
   score: 80,
   localizedRatingCategory: 'Good',
   positiveComment: 'Great location and clean rooms',
   negativeComment: 'Nothing',
   siteName: '',
   localizedMonthYear: 'October 2025',
   siteLink: '',
   siteLogo: 'https://logos-world.net/wp-content/uploads/2021/02/Booking-Logo.png',
   internal: false,
   localizedScore: '8.0'
  },
  {
   id: 'mock-2',
   author: 'Sarah M.',
   score: 90,
   localizedRatingCategory: 'Excellent',
   positiveComment: 'Amazing service and beautiful property',
   negativeComment: 'Nothing',
   siteName: '',
   localizedMonthYear: 'October 2025',
   siteLink: '',
   siteLogo: 'https://logos-world.net/wp-content/uploads/2021/02/Agoda-Logo.png',
   internal: false,
   localizedScore: '9.0'
  },
  {
   id: 'mock-3',
   author: 'Mike R.',
   score: 70,
   localizedRatingCategory: 'Good',
   positiveComment: 'Nice place to stay',
   negativeComment: 'WiFi was slow',
   siteName: '',
   localizedMonthYear: 'October 2025',
   siteLink: '',
   siteLogo: 'https://logos-world.net/wp-content/uploads/2021/02/Kayak-Logo.png',
   internal: false,
   localizedScore: '7.0'
  },
  {
   id: 'mock-4',
   author: 'Emma L.',
   score: 85,
   localizedRatingCategory: 'Very Good',
   positiveComment: 'Excellent value for money',
   negativeComment: 'Breakfast could be better',
   siteName: '',
   localizedMonthYear: 'October 2025',
   siteLink: '',
   siteLogo: 'https://logos-world.net/wp-content/uploads/2021/02/Priceline-Logo.png',
   internal: false,
   localizedScore: '8.5'
  },
  {
   id: 'mock-5',
   author: 'David K.',
   score: 95,
   localizedRatingCategory: 'Excellent',
   positiveComment: 'Perfect stay, highly recommended',
   negativeComment: 'Nothing',
   siteName: '',
   localizedMonthYear: 'October 2025',
   siteLink: '',
   siteLogo: 'https://logos-world.net/wp-content/uploads/2021/02/HotelsCombined-Logo.png',
   internal: false,
   localizedScore: '9.5'
  }
 ]
};
