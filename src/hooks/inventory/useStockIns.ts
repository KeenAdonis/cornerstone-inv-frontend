"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getStockIns,
    type StockIn,
} from "@/src/services/stockInService";

export function useStockIns() {
    const [stockIns, setStockIns] =
        useState<StockIn[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchStockIns =
        useCallback(async () => {
            try {
                setLoading(true);
                setError(null);

                const data =
                    await getStockIns();

                setStockIns(data);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to load stock-in transactions.";

                setError(message);
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        fetchStockIns();
    }, [fetchStockIns]);

    return {
        stockIns,
        loading,
        error,
        refetch: fetchStockIns,
    };
}