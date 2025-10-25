"use client";

import { useState, useEffect } from "react";

export const dynamic = 'force-dynamic';
import { FlexHeader } from "@/components/flex-header";
import { FlexPanel } from "@/components/flex-panel";
import { FlexFooter } from "@/components/flex-footer";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";
import ReviewsFilters from "./filters/page";
import ReviewsGrid from "./grid/page";
import ReviewsStats from "./stats/page";
import DisplayInfo from "./display/page";
import RecentReviews from "./recentReview/page";
import { mockReviews } from "../../lib/mock-dashboard-data";
import type { ReviewData } from "../../types/dashboard";
import { fetchReviews } from "../api/get-reviews";
import type { FetchKayakReviewsParams, KayakReview } from "../../types/review";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>(mockReviews);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showOnlyPublic, setShowOnlyPublic] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Kayak reviews state
  const [kayakReviews, setKayakReviews] = useState<KayakReview[]>([]);
  const [kayakLoading, setKayakLoading] = useState(false);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // Fetch Kayak reviews on component mount
  useEffect(() => {
    // Call refresh function on mount
    handleRefresh();
  }, []); // Empty dependency array means this runs once on mount

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      const matchesSearch = review.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProperty = selectedProperty === "all" || review.propertyName === selectedProperty;
      const matchesStatus = selectedStatus === "all" ||
        (selectedStatus === "approved" && review.isApproved) ||
        (selectedStatus === "pending" && !review.isApproved);
      const matchesPublic = !showOnlyPublic || review.isPublic;

      // If not showing all reviews, only show approved and public reviews
      const matchesDisplayCriteria = showAllReviews || (review.isApproved && review.isPublic);

      return matchesSearch && matchesProperty && matchesStatus && matchesPublic && matchesDisplayCriteria;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "date":
          aValue = new Date(a.submittedAt).getTime();
          bValue = new Date(b.submittedAt).getTime();
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "property":
          aValue = a.propertyName;
          bValue = b.propertyName;
          break;
        default:
          aValue = new Date(a.submittedAt).getTime();
          bValue = new Date(b.submittedAt).getTime();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleRefresh = async () => {
    setRefreshing(true);
    setKayakLoading(true);
    setLoading(true);

    try {
      // Use sample params for imported fetchReviews function
      const kayakParams: FetchKayakReviewsParams = {
        travelerTypes: '',
        months: '',
        tagClusterName: '',
        searchText: '',
        reviewSources: 'BOOKING,AGODA,PRICELINE,HOTELSCOMBINED,KAYAK',
        sortType: 'recent',
        includeReviewLink: true,
        reviewType: 'hotel',
        objectId: '12222',
        includeObjectId: false,
        startIndex: 0,
        amount: 10
      };
      const kayakData = await fetchReviews(kayakParams);
      console.log('🔄 Refresh Kayak API Response:', kayakData);

      // Set Kayak reviews state
      if (kayakData.reviews && Array.isArray(kayakData.reviews)) {
        setKayakReviews(kayakData.reviews);
        console.log('✅ Updated Kayak reviews:', kayakData.reviews.length, 'reviews');
      }

    } catch (error) {
      console.error('❌ Error fetching Kayak reviews:', error);
    } finally {
      setRefreshing(false);
      setKayakLoading(false);
      setLoading(false);
    }
  };

  const handleReviewToggle = (reviewId: string, isPublic: boolean) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId ? { ...review, isPublic } : review
    ));
  };

  const handleReviewApprove = (reviewId: string, approved: boolean) => {
    setReviews(prev => prev.map(review =>
      review.id === reviewId ? { ...review, isApproved: approved } : review
    ));
  };

  const handleAddReview = (newReview: Partial<KayakReview>) => {
    if (newReview.id) {
      setKayakReviews(prev => [newReview as KayakReview, ...prev]);
    }
  };


  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      <FlexHeader onMenuToggle={toggleSidebar} />

      <div className="flex">
        {/* Sidebar */}
        <FlexPanel isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen
          ? 'ml-0 md:ml-64 lg:ml-64'
          : 'ml-0'
          }`}>
          {/* Page Header */}
          <div className="bg-[#fffdf6] shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
                  <p className="text-sm text-gray-600 mt-1">Manage and moderate guest reviews. Only approved and public reviews are displayed on the website.</p>
                </div>
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-[#fffdf6]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Filters and Search */}
              <ReviewsFilters
                reviews={reviews}
                searchQuery={searchQuery}
                selectedProperty={selectedProperty}
                selectedStatus={selectedStatus}
                sortBy={sortBy}
                sortOrder={sortOrder}
                showOnlyPublic={showOnlyPublic}
                showAllReviews={showAllReviews}
                onSearchChange={setSearchQuery}
                onPropertyChange={setSelectedProperty}
                onStatusChange={setSelectedStatus}
                onSortByChange={setSortBy}
                onSortOrderChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                onShowOnlyPublicChange={setShowOnlyPublic}
                onShowAllReviewsChange={setShowAllReviews}
              />

              {/* Display Info */}
              <DisplayInfo showAllReviews={showAllReviews} />

              {/* Reviews Grid */}
              <ReviewsGrid
                reviews={filteredReviews}
                onReviewToggle={handleReviewToggle}
                onReviewApprove={handleReviewApprove}
              />

              {/* Stats Summary */}
              <ReviewsStats reviews={reviews} />

              {/* Recent Reviews Section */}
              <RecentReviews
                kayakReviews={kayakReviews}
                loading={loading}
                kayakLoading={kayakLoading}
                onAddReview={handleAddReview}
              />
            </div>
          </div>

          <FlexFooter />
        </div>
      </div>
    </div>
  );
}
