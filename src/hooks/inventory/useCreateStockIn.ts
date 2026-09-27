"use client";

import { useCallback, useState } from "react";

import {
    createStockIn,
    type CreateStockInPayload,
    type StockIn,
} from "@/src/services/stockInService";

export function useCreateStockIn() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = useCallback(
        async (payload: CreateStockInPayload): Promise<StockIn | null> => {
            try {
                setLoading(true);
                setError(null);

                const stockIn = await createStockIn(payload);

                return stockIn;
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to create stock-in transaction.";

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