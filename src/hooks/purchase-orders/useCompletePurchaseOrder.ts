"use client";

import { useState } from "react";

import {
    completePurchaseOrder,
} from "@/src/services/purchaseOrderService";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

interface UseCompletePurchaseOrderResult {
    complete: (
        purchaseOrderId: number
    ) => Promise<PurchaseOrder | null>;

    loading: boolean;

    error: string | null;

    resetError: () => void;
}

export function useCompletePurchaseOrder(): UseCompletePurchaseOrderResult {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const complete = async (
        purchaseOrderId: number
    ): Promise<PurchaseOrder | null> => {
        setLoading(true);
        setError(null);

        try {
            const purchaseOrder =
                await completePurchaseOrder(
                    purchaseOrderId
                );

            return purchaseOrder;
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to complete purchase order.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    const resetError = () => {
        setError(null);
    };

    return {
        complete,
        loading,
        error,
        resetError,
    };
}