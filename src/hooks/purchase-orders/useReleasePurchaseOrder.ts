"use client";

import {
    useCallback,
    useState,
} from "react";

import {
    releasePurchaseOrder,
    type PurchaseOrder,
    type ReleasePurchaseOrderPayload,
} from "@/src/services/purchaseOrderService";

export function useReleasePurchaseOrder() {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const release = useCallback(
        async (
            purchaseOrderId: number,
            data: ReleasePurchaseOrderPayload
        ): Promise<PurchaseOrder | null> => {
            try {
                setLoading(true);
                setError(null);

                const purchaseOrder =
                    await releasePurchaseOrder(
                        purchaseOrderId,
                        data
                    );

                return purchaseOrder;
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to release purchase order.";

                setError(message);

                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    return {
        release,
        loading,
        error,
        resetError,
    };
}