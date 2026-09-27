"use client";

import {
    useCallback,
    useState,
} from "react";

import {
    updateInventoryStockLevels,
    type Inventory,
    type UpdateInventoryStockLevelsData,
} from "@/src/services/inventoryService";

export function useUpdateInventoryStockLevels() {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const update = useCallback(
        async (
            inventoryId: number,
            stockLevelData: UpdateInventoryStockLevelsData
        ): Promise<Inventory | null> => {
            try {
                setLoading(true);
                setError(null);

                const inventory =
                    await updateInventoryStockLevels(
                        inventoryId,
                        stockLevelData
                    );

                return inventory;
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to update inventory stock levels.";

                setError(message);

                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        update,
        loading,
        error,
    };
}