"use client";

import { useCallback, useState } from "react";

import {
    createInventoryCount,
    getInventoryCounts,
    type CreateInventoryCountData,
    type InventoryCount,
} from "@/src/services/inventoryCountService";

export function useInventoryCount() {
    const [inventoryCount, setInventoryCount] =
        useState<InventoryCount | null>(null);

    const [inventoryCounts, setInventoryCounts] =
        useState<InventoryCount[]>([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const submitInventoryCount = async (
        countData: CreateInventoryCountData
    ): Promise<InventoryCount | null> => {
        try {
            setLoading(true);
            setError(null);

            const data = await createInventoryCount(countData);

            setInventoryCount(data);

            return data;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to complete inventory count.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    const fetchInventoryCounts = useCallback(
        async (branchId?: number) => {
            try {
                setLoading(true);
                setError(null);

                const data = await getInventoryCounts(branchId);

                setInventoryCounts(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load inventory count history."
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const reset = () => {
        setInventoryCount(null);
        setError(null);
    };

    return {
        inventoryCount,
        inventoryCounts,
        loading,
        error,
        submitInventoryCount,
        fetchInventoryCounts,
        reset,
    };
}