"use client";

import { useCallback, useState } from "react";

import {
    reviewPurchaseOrder,
    type PurchaseOrder,
    type ReviewPurchaseOrderPayload,
} from "@/src/services/purchaseOrderService";

export function useReviewPurchaseOrder() {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const review = useCallback(
        async (
            purchaseOrderId: number,
            payload: ReviewPurchaseOrderPayload
        ): Promise<PurchaseOrder | null> => {
            try {
                setLoading(true);
                setError(null);

                const purchaseOrder =
                    await reviewPurchaseOrder(
                        purchaseOrderId,
                        payload
                    );

                return purchaseOrder;
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to review purchase order.";

                setError(message);

                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        review,
        loading,
        error,
    };
}