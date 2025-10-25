"use client";

import { MessageSquare } from "lucide-react";

export const dynamic = 'force-dynamic';

interface DisplayInfoProps {
  showAllReviews: boolean;
}

export default function DisplayInfo({ showAllReviews }: DisplayInfoProps) {
  if (showAllReviews) return null;

  return (
    <div className="bg-blue-50 shadow-sm rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-blue-600" />
        <p className="text-sm text-blue-800">
          <strong>Display Mode:</strong> Only showing approved and public reviews that are displayed on the website.
          Check "Show all reviews (admin view)" to see all reviews for management.
        </p>
      </div>
    </div>
  );
}
