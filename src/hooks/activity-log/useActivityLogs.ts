"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getActivityLogs,
    type ActivityLog,
    type ActivityLogFilters,
} from "@/src/services/activityLogService";

interface UseActivityLogsOptions {
    enabled?: boolean;
}

const EMPTY_ACTIVITY_LOGS: ActivityLog[] = [];

export function useActivityLogs(
    filters?: ActivityLogFilters,
    options: UseActivityLogsOptions = {}
) {
    const {
        enabled = true,
    } = options;

    const [
        activityLogs,
        setActivityLogs,
    ] = useState<ActivityLog[]>([]);

    const [
        loadedFilterKey,
        setLoadedFilterKey,
    ] = useState<string | null>(null);

    const [loading, setLoading] =
        useState(enabled);

    const [error, setError] =
        useState<string | null>(null);

    const filterKey = JSON.stringify({
        userId:
            filters?.user_id ?? null,

        branchId:
            filters?.branch_id ?? null,

        warehouseId:
            filters?.warehouse_id ?? null,

        module:
            filters?.module ?? null,

        action:
            filters?.action ?? null,

        dateFrom:
            filters?.date_from ?? null,

        dateTo:
            filters?.date_to ?? null,
    });

    const fetchActivityLogs =
        useCallback(async () => {
            if (!enabled) {
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const data =
                    await getActivityLogs(
                        filters
                    );

                setActivityLogs(data);

                setLoadedFilterKey(
                    filterKey
                );
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load activity logs."
                );
            } finally {
                setLoading(false);
            }
        }, [
            enabled,
            filterKey,
            filters?.user_id,
            filters?.branch_id,
            filters?.warehouse_id,
            filters?.module,
            filters?.action,
            filters?.date_from,
            filters?.date_to,
        ]);

    useEffect(() => {
        if (!enabled) {
            setLoading(false);
            setActivityLogs([]);
            setLoadedFilterKey(null);
            return;
        }

        setLoading(true);

        fetchActivityLogs();
    }, [
        enabled,
        fetchActivityLogs,
    ]);

    const isCurrentActivityLogs =
        loadedFilterKey ===
        filterKey;

    return {
        activityLogs:
            enabled &&
            isCurrentActivityLogs
                ? activityLogs
                : EMPTY_ACTIVITY_LOGS,

        loading:
            loading ||
            (enabled &&
                !isCurrentActivityLogs),

        error,

        refetch: fetchActivityLogs,
    };
}