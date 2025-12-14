
// ========================================
// STATS MODULE (APPLICATION COUNTS)
// ========================================

import { fetchApplicationCountsAPI } from './api.js';

/**
 * Update metric card values from counts object
 * @param {Object} counts 
 */
export function updateMetricCards(counts) {
    // Update Total Applications
    const totalCard = document.querySelector('.metric-card.total .metric-value');
    if (totalCard) {
        totalCard.textContent = counts.total || 0;
    }

    // Update Accepted Applications
    const acceptedCard = document.querySelector('.metric-card.active .metric-value');
    if (acceptedCard) {
        acceptedCard.textContent = counts.accepted || 0;
    }

    // Update Under Review
    const reviewCard = document.querySelector('.metric-card.review .metric-value');
    if (reviewCard) {
        reviewCard.textContent = counts.under_review || 0;
    }

    // Update Rejected Applications
    const rejectedCard = document.querySelector('.metric-card.offers .metric-value');
    if (rejectedCard) {
        rejectedCard.textContent = counts.rejected || 0;
    }

    console.log('[Dashboard] Application counts updated:', counts);
}

/**
 * Fetch and update application counts
 * @param {Number} studentId 
 */
export async function initApplicationCounts(studentId) {
    if (!studentId) {
        console.error('[Dashboard] Student ID not available for counts');
        return;
    }

    try {
        const data = await fetchApplicationCountsAPI(studentId);
        console.log('[Dashboard] Application counts API response:', data);

        if (data.status === 'success') {
            updateMetricCards(data.data);
        } else {
            console.error('[Dashboard] Failed to fetch counts:', data.message);
        }
    } catch (error) {
        console.error('[Dashboard] Error init counts:', error);
    }
}
