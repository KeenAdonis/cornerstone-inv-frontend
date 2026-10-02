"use client";

import { useState } from "react";
import { bulkRejectPurchaseOrders } from "@/src/services/purchaseOrderService";

export function useBulkRejectPurchaseOrders() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const bulkReject = async (
        purchaseOrderIds: number[],
        rejectionReason: string
    ) => {
        setLoading(true);
        setError(null);

        try {
            if (purchaseOrderIds.length === 0) {
                throw new Error(
                    "No purchase orders were selected."
                );
            }

            if (!rejectionReason.trim()) {
                throw new Error(
                    "A rejection reason is required."
                );
            }

            const purchaseOrders =
                await bulkRejectPurchaseOrders({
                    purchase_order_ids: purchaseOrderIds,
                    rejection_reason: rejectionReason.trim(),
                });

            return purchaseOrders;
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to reject purchase orders.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setLoading(false);
        setError(null);
    };

    return {
        bulkReject,
        loading,
        error,
        reset,
    };
}