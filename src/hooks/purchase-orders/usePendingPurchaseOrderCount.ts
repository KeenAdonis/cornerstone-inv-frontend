"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getPendingPurchaseOrderCount,
} from "@/src/services/purchaseOrderService";

const REFRESH_INTERVAL = 30_000;

export function usePendingPurchaseOrderCount(
    enabled = true
) {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState<string | null>(
        null
    );

    const refetch = useCallback(
        async (silent = false) => {
            if (!enabled) {
                setCount(0);
                setLoading(false);
                setError(null);
                return;
            }

            if (!silent) {
                setLoading(true);
            }

            try {
                const pendingCount =
                    await getPendingPurchaseOrderCount();

                setCount(pendingCount);
                setError(null);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch pending purchase order count."
                );
            } finally {
                if (!silent) {
                    setLoading(false);
                }
            }
        },
        [enabled]
    );

    /*
     * ============================================================
     * INITIAL FETCH
     * ============================================================
     */

    useEffect(() => {
        refetch();
    }, [refetch]);

    /*
     * ============================================================
     * AUTOMATIC REFRESH
     * ============================================================
     */

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const interval = window.setInterval(() => {
            refetch(true);
        }, REFRESH_INTERVAL);

        return () => {
            window.clearInterval(interval);
        };
    }, [enabled, refetch]);

    /*
     * ============================================================
     * REFRESH WHEN TAB BECOMES ACTIVE
     * ============================================================
     */

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                refetch(true);
            }
        };

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [enabled, refetch]);

    return {
        count,
        loading,
        error,
        refetch,
    };
}