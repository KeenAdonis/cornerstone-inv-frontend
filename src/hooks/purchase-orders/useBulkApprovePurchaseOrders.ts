"use client";

import { useState } from "react";

import {
    bulkApprovePurchaseOrders,
} from "@/src/services/purchaseOrderService";

export function useBulkApprovePurchaseOrders() {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const bulkApprove =
        async (
            purchaseOrderIds: number[]
        ) => {
            setLoading(true);
            setError(null);

            try {
                if (
                    purchaseOrderIds.length ===
                    0
                ) {
                    throw new Error(
                        "No purchase orders were selected."
                    );
                }

                const purchaseOrders =
                    await bulkApprovePurchaseOrders(
                        {
                            purchase_order_ids:
                                purchaseOrderIds,
                        }
                    );

                return purchaseOrders;
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to approve purchase orders.";

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
        bulkApprove,
        loading,
        error,
        reset,
    };
}