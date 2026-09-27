"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getWarehouses,
    type Warehouse,
} from "@/src/services/warehouseService";

export function useWarehouses() {
    const [warehouses, setWarehouses] =
        useState<Warehouse[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchWarehouses = useCallback(
        async () => {
            try {
                setLoading(true);
                setError(null);

                const data =
                    await getWarehouses();

                setWarehouses(data);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Unable to retrieve warehouses.";

                setError(message);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchWarehouses();
    }, [fetchWarehouses]);

    return {
        warehouses,
        loading,
        error,
        refetch: fetchWarehouses,
    };
}