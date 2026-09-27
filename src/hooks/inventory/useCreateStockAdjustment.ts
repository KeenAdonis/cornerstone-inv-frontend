"use client";

import {
    useCallback,
    useState,
} from "react";

import {
    createStockAdjustment,
    type CreateStockAdjustmentPayload,
    type StockAdjustment,
} from "@/src/services/stockAdjustmentService";

export function useCreateStockAdjustment() {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const create = useCallback(
        async (
            payload: CreateStockAdjustmentPayload
        ): Promise<StockAdjustment | null> => {
            try {
                setLoading(true);
                setError(null);

                const stockAdjustment =
                    await createStockAdjustment(
                        payload
                    );

                return stockAdjustment;
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to create stock adjustment.";

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