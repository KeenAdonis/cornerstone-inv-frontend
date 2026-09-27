"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getStockMovements,
    type StockMovement,
    type StockMovementFilters,
} from "@/src/services/stockMovementService";

interface UseStockMovementsOptions {
    enabled?: boolean;
}

export function useStockMovements(
    filters?: StockMovementFilters,
    options: UseStockMovementsOptions = {}
) {
    const {
        enabled = true,
    } = options;

    const [
        stockMovements,
        setStockMovements,
    ] = useState<StockMovement[]>([]);

    const [loading, setLoading] =
        useState(enabled);

    const [error, setError] =
        useState<string | null>(null);

    const fetchStockMovements =
        useCallback(async () => {
            if (!enabled) {
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const data =
                    await getStockMovements(
                        filters
                    );

                setStockMovements(data);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to load stock movement history.";

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

        fetchStockMovements();
    }, [
        enabled,
        fetchStockMovements,
    ]);

    return {
        stockMovements,
        loading,
        error,
        refetch: fetchStockMovements,
    };
}