/**
 * Utility script to dynamically update review status for testing
 * This demonstrates how the PublicReviewsSection now responds to real-time changes
 */

// This would be called from your admin panel or review management system
async function updateReviewStatus(
    reviewId: number,
    newStatus: "PUBLISHED" | "REJECTED" | "PENDING",
    isApproved: boolean
) {
    try {
        const response = await fetch("/api/reviews/update-status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reviewId,
                status: newStatus,
                isApproved,
            }),
        });

        const result = await response.json();

        if (result.success) {
            console.log(
                `✅ Review ${reviewId} status updated to ${newStatus} (approved: ${isApproved})`
            );
            console.log(
                "🔄 PublicReviewsSection will automatically update within 30 seconds"
            );
        } else {
            console.error("❌ Failed to update review status:", result.error);
        }

        return result;
    } catch (error) {
        console.error("❌ Error updating review status:", error);
        throw error;
    }
}

// Example usage:
// updateReviewStatus(1, 'REJECTED', false); // Reject James Wilson's review
// updateReviewStatus(1, 'PUBLISHED', true); // Re-approve James Wilson's review

export { updateReviewStatus };
