import type { KayakReviewsResponse, FetchKayakReviewsParams } from "../../types/review";
import { KAYAK_MOCK_DATA } from "../../lib/mock/kayak-mock-data";

/**
 * Fetches reviews from Kayak API
 * @param params - Query parameters for the Kayak API
 * @returns Promise<KayakReviewsResponse>
 */
const apiURL = process.env.NEXT_PUBLIC_API_URL || 'https://www.kayak.com/i/api/seo/reviews/v3';



export const fetchReviews = async (params: FetchKayakReviewsParams): Promise<KayakReviewsResponse> => {
 try {
  // Use the Next.js API route instead of direct Kayak API call
  const queryParams = new URLSearchParams({
   travelerTypes: params.travelerTypes || '',
   months: params.months || '',
   tagClusterName: params.tagClusterName || '',
   searchText: params.searchText || '',
   reviewSources: params.reviewSources || '',
   sortType: params.sortType || '',
   includeReviewLink: (params.includeReviewLink ?? true).toString(),
   reviewType: params.reviewType || '',
   objectId: params.objectId || '',
   includeObjectId: (params.includeObjectId ?? false).toString(),
   startIndex: (params.startIndex ?? 0).toString(),
   amount: (params.amount ?? 10).toString()
  });

  const url = `${apiURL}/filtered?${queryParams}`;

  const res = await fetch(url, {
   method: 'GET',
   headers: {
    'Accept': 'application/json',
   }
  });

  if (!res.ok) {
   throw new Error(`HTTP error! status: ${res.status}`);
  }

  let data: any;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
   data = await res.json();
  } else {
   const text = await res.text();
   try {
    data = JSON.parse(text);
   } catch {
    data = text;
   }
  }

  return data as KayakReviewsResponse;
 } catch (error) {
  return KAYAK_MOCK_DATA;
 }
};
