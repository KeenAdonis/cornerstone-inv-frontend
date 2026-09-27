"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getPurchaseOrders,
    type PurchaseOrder,
} from "@/src/services/purchaseOrderService";

import {
    useActiveLocationContext,
} from "@/src/context/ActiveLocationContext";

export function usePurchaseOrders() {
    const [
        purchaseOrders,
        setPurchaseOrders,
    ] = useState<PurchaseOrder[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const {
        activeLocation,
        initialized: locationInitialized,
    } = useActiveLocationContext();

    const branchId =
        locationInitialized &&
        activeLocation?.type === "branch"
            ? activeLocation.id
            : undefined;

    const warehouseId =
        locationInitialized &&
        activeLocation?.type === "warehouse"
            ? activeLocation.id
            : undefined;

    const fetchPurchaseOrders =
        useCallback(async () => {
            if (!locationInitialized) {
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const data =
                    await getPurchaseOrders({
                        branchId,
                        warehouseId,
                    });

                setPurchaseOrders(data);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to load purchase orders.";

                setError(message);
            } finally {
                setLoading(false);
            }
        }, [
            locationInitialized,
            branchId,
            warehouseId,
        ]);

    useEffect(() => {
        if (!locationInitialized) {
            setLoading(true);
            return;
        }

        fetchPurchaseOrders();
    }, [
        locationInitialized,
        fetchPurchaseOrders,
    ]);

    return {
        purchaseOrders,
        loading,
        error,
        refetch:
            fetchPurchaseOrders,
    };
}