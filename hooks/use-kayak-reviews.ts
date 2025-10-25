import { useState, useEffect } from 'react';
import type { KayakReviewsResponse, FetchKayakReviewsParams } from '../types/review';

interface UseKayakReviewsReturn {
 data: KayakReviewsResponse | null;
 loading: boolean;
 error: string | null;
 refetch: () => void;
}

export const useKayakReviews = (params: FetchKayakReviewsParams): UseKayakReviewsReturn => {
 const [data, setData] = useState<KayakReviewsResponse | null>(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const fetchReviews = async () => {
  setLoading(true);
  setError(null);

  try {
   const queryParams = new URLSearchParams();

   // Add all parameters to query string
   Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
     queryParams.append(key, value.toString());
    }
   });

   const response = await fetch(`/api/kayak-reviews?${queryParams.toString()}`);

   if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
   }

   const result = await response.json();
   setData(result);
  } catch (err) {
   setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
   setLoading(false);
  }
 };

 const refetch = () => {
  fetchReviews();
 };

 useEffect(() => {
  fetchReviews();
 }, [JSON.stringify(params)]);

 return { data, loading, error, refetch };
};
