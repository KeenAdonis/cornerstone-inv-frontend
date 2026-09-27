"use client";

import { useCallback, useState } from "react";

import {
    createPurchaseOrder,
    type CreatePurchaseOrderPayload,
    type PurchaseOrder,
} from "@/src/services/purchaseOrderService";

export function useCreatePurchaseOrder() {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const create = useCallback(
        async (
            payload: CreatePurchaseOrderPayload
        ): Promise<PurchaseOrder | null> => {
            try {
                setLoading(true);
                setError(null);

                const purchaseOrder =
                    await createPurchaseOrder(
                        payload
                    );

                return purchaseOrder;
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to create purchase order.";

                setError(message);

                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        create,
        loading,
        error,
    };
}