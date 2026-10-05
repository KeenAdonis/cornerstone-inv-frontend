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

import { useAuth } from "@/src/hooks/useAuth";

const REFRESH_INTERVAL = 30_000;

export function usePurchaseOrders() {
    const [
        purchaseOrders,
        setPurchaseOrders,
    ] = useState<PurchaseOrder[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const { user } = useAuth();

    const {
        activeLocation,
        initialized: locationInitialized,
    } = useActiveLocationContext();

    const isAdmin =
        user?.role === "admin";

    /*
     * Admins can see all purchase orders.
     *
     * Branch and warehouse coordinators remain
     * scoped to their active location.
     */
    const branchId =
        !isAdmin &&
        locationInitialized &&
        activeLocation?.type === "branch"
            ? activeLocation.id
            : undefined;

    const warehouseId =
        !isAdmin &&
        locationInitialized &&
        activeLocation?.type === "warehouse"
            ? activeLocation.id
            : undefined;

    const fetchPurchaseOrders =
        useCallback(
            async (silent = false) => {
                if (!locationInitialized) {
                    return;
                }

                try {
                    if (!silent) {
                        setLoading(true);
                    }

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
                    if (!silent) {
                        setLoading(false);
                    }
                }
            },
            [
                locationInitialized,
                branchId,
                warehouseId,
            ],
        );

    /*
     * Initial fetch
     */
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

    /*
     * Automatically refresh purchase orders
     * every 30 seconds without showing the
     * loading state.
     */
    useEffect(() => {
        if (!locationInitialized) {
            return;
        }

        const interval =
            window.setInterval(() => {
                fetchPurchaseOrders(true);
            }, REFRESH_INTERVAL);

        return () => {
            window.clearInterval(interval);
        };
    }, [
        locationInitialized,
        fetchPurchaseOrders,
    ]);

    /*
     * Refresh when the user returns to the tab.
     */
    useEffect(() => {
        if (!locationInitialized) {
            return;
        }

        const handleVisibilityChange = () => {
            if (
                document.visibilityState ===
                "visible"
            ) {
                fetchPurchaseOrders(true);
            }
        };

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange,
        );

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
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