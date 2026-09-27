"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getStockAdjustments,
    type StockAdjustment,
    type StockAdjustmentFilters,
} from "@/src/services/stockAdjustmentService";

interface UseStockAdjustmentsOptions {
    enabled?: boolean;
}

export function useStockAdjustments(
    filters?: StockAdjustmentFilters,
    options: UseStockAdjustmentsOptions = {}
) {
    const {
        enabled = true,
    } = options;

    const [
        stockAdjustments,
        setStockAdjustments,
    ] = useState<StockAdjustment[]>([]);

    const [loading, setLoading] =
        useState(enabled);

    const [error, setError] =
        useState<string | null>(null);

    const fetchStockAdjustments =
        useCallback(async () => {
            if (!enabled) {
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const data =
                    await getStockAdjustments(
                        filters
                    );

                setStockAdjustments(
                    data
                );
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to load stock adjustment transactions.";

                setError(message);
            } finally {
                setLoading(false);
            }
        }, [
            enabled,
            filters?.branchId,
            filters?.warehouseId,
        ]);

    useEffect(() => {
        if (!enabled) {
            setLoading(true);
            return;
        }

        fetchStockAdjustments();
    }, [
        enabled,
        fetchStockAdjustments,
    ]);

    return {
        stockAdjustments,
        loading,
        error,
        refetch:
            fetchStockAdjustments,
    };
}