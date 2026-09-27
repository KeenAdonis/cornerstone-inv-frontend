"use client";

import {
    useCallback,
    useState,
} from "react";

import {
    processPurchaseOrder,
    type PurchaseOrder,
} from "@/src/services/purchaseOrderService";

export function useProcessPurchaseOrder() {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const process = useCallback(
        async (
            purchaseOrderId: number
        ): Promise<PurchaseOrder | null> => {
            try {
                setLoading(true);
                setError(null);

                const purchaseOrder =
                    await processPurchaseOrder(
                        purchaseOrderId
                    );

                return purchaseOrder;
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to process purchase order.";

                setError(message);

                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        process,
        loading,
        error,
    };
}