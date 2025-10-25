import fs from "fs/promises";
import path from "path";
import type { NormalizedReview } from "@/types/review";

const DATA_DIR = path.join(process.cwd(), "data");
const APPROVALS_FILE = path.join(DATA_DIR, "review-approvals.json");

export interface ReviewApproval {
    reviewId: number;
    isApproved: boolean;
    managerNotes?: string;
    updatedAt: string;
    updatedBy?: string;
}

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

// Load review approvals from file
export async function loadReviewApprovals(): Promise<
    Record<number, ReviewApproval>
> {
    try {
        await ensureDataDir();
        const data = await fs.readFile(APPROVALS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        // File doesn't exist or is invalid, return empty object
        return {};
    }
}

// Save review approvals to file
export async function saveReviewApprovals(
    approvals: Record<number, ReviewApproval>
): Promise<void> {
    try {
        await ensureDataDir();
        await fs.writeFile(APPROVALS_FILE, JSON.stringify(approvals, null, 2));
    } catch (error) {
        console.error("Error saving review approvals:", error);
        throw new Error("Failed to save review approvals");
    }
}

// Update approval status for a specific review
export async function updateReviewApproval(
    reviewId: number,
    isApproved: boolean,
    managerNotes?: string,
    updatedBy?: string
): Promise<ReviewApproval> {
    const approvals = await loadReviewApprovals();

    const approval: ReviewApproval = {
        reviewId,
        isApproved,
        managerNotes,
        updatedAt: new Date().toISOString(),
        updatedBy,
    };

    approvals[reviewId] = approval;
    await saveReviewApprovals(approvals);

    return approval;
}

// Get approval status for a specific review
export async function getReviewApproval(
    reviewId: number
): Promise<ReviewApproval | null> {
    const approvals = await loadReviewApprovals();
    return approvals[reviewId] || null;
}

// Apply approval statuses to a list of reviews
export async function applyApprovalsToReviews(
    reviews: NormalizedReview[]
): Promise<NormalizedReview[]> {
    const approvals = await loadReviewApprovals();

    return reviews.map((review) => {
        const approval = approvals[review.id];
        return {
            ...review,
            isApproved: approval ? approval.isApproved : review.isApproved,
            managerNotes: approval?.managerNotes || review.managerNotes,
        };
    });
}
