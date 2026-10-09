"use client";

import { useState } from "react";

import {
    deletePurchaseOrder,
} from "@/src/services/purchaseOrderService";

export function useDeletePurchaseOrder() {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const handleDeletePurchaseOrder = async (
        purchaseOrderId: number
    ): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            await deletePurchaseOrder(
                purchaseOrderId
            );

            return true;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to delete purchase order.";

            setError(message);

            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleDeletePurchaseOrder,
        loading,
        error,
    };
}