"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getInventory,
    type Inventory,
    type InventoryFilters,
} from "@/src/services/inventoryService";

interface UseInventoryOptions {
    enabled?: boolean;
}

const EMPTY_INVENTORY: Inventory[] = [];

export function useInventory(
    filters?: InventoryFilters,
    options: UseInventoryOptions = {}
) {
    const {
        enabled = true,
    } = options;

    const [
        inventory,
        setInventory,
    ] = useState<Inventory[]>([]);

    const [
        loadedFilterKey,
        setLoadedFilterKey,
    ] = useState<string | null>(null);

    const [loading, setLoading] =
        useState(enabled);

    const [error, setError] =
        useState<string | null>(null);

    const filterKey = JSON.stringify({
        locationType:
            filters?.locationType ?? null,

        area:
            filters?.area ?? null,

        branchId:
            filters?.branchId ?? null,

        warehouseId:
            filters?.warehouseId ?? null,
    });

    const fetchInventory =
        useCallback(async () => {
            if (!enabled) {
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const data =
                    await getInventory(filters);

                setInventory(data);

                setLoadedFilterKey(
                    filterKey
                );
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load inventory."
                );
            } finally {
                setLoading(false);
            }
        }, [
            enabled,
            filterKey,
            filters?.locationType,
            filters?.area,
            filters?.branchId,
            filters?.warehouseId,
        ]);

    useEffect(() => {
        if (!enabled) {
            setLoading(false);
            setInventory([]);
            setLoadedFilterKey(null);
            return;
        }

        setLoading(true);

        fetchInventory();
    }, [
        enabled,
        fetchInventory,
    ]);

    const isCurrentInventory =
        loadedFilterKey ===
        filterKey;

    return {
        inventory:
            enabled &&
            isCurrentInventory
                ? inventory
                : EMPTY_INVENTORY,

        loading:
            loading ||
            (enabled &&
                !isCurrentInventory),

        error,

        refetch: fetchInventory,
    };
}