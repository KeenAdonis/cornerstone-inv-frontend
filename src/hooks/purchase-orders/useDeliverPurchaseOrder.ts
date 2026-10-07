"use client";

import { useState } from "react";

import {
    deliverPurchaseOrder,
} from "@/src/services/purchaseOrderService";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

interface UseDeliverPurchaseOrderResult {
    deliver: (
        purchaseOrderId: number,
        deliveryPhotos: File[],
        dateOfArrival: string
    ) => Promise<PurchaseOrder | null>;

    loading: boolean;

    error: string | null;

    resetError: () => void;
}

export function useDeliverPurchaseOrder(): UseDeliverPurchaseOrderResult {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const deliver = async (
        purchaseOrderId: number,
        deliveryPhotos: File[],
        dateOfArrival: string
    ): Promise<PurchaseOrder | null> => {
        setLoading(true);
        setError(null);

        try {
            const purchaseOrder =
                await deliverPurchaseOrder(
                    purchaseOrderId,
                    deliveryPhotos,
                    dateOfArrival
                );

            return purchaseOrder;
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to mark purchase order as delivered.";

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
        deliver,
        loading,
        error,
        resetError,
    };
}