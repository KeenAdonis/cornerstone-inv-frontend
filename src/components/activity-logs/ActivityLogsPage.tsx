"use client";

import {
    useMemo,
    useState,
} from "react";

import {
    RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    useActivityLogs,
} from "@/src/hooks/activity-log/useActivityLogs";

import type {
    ActivityLog,
    ActivityLogFilters,
} from "@/src/services/activityLogService";

import ActivityLogToolbar from "@/src/components/activity-logs/ActivityLogToolbar";

import ActivityLogTable from "@/src/components/activity-logs/ActivityLogTable";

import ActivityLogDetails from "@/src/components/activity-logs/ActivityLogDetails";

export default function ActivityLogsPage() {
    const [
        search,
        setSearch,
    ] = useState("");

    const [
        filters,
        setFilters,
    ] = useState<ActivityLogFilters>({});

    const [
        selectedLog,
        setSelectedLog,
    ] = useState<ActivityLog | null>(
        null
    );

    const [
        detailsOpen,
        setDetailsOpen,
    ] = useState(false);

    const {
        activityLogs,
        loading,
        error,
        refetch,
    } = useActivityLogs(filters);

    /*
    |--------------------------------------------------------------------------
    | Client-Side Search
    |--------------------------------------------------------------------------
    */

    const filteredLogs = useMemo(() => {
        const normalizedSearch =
            search
                .trim()
                .toLowerCase();

        if (!normalizedSearch) {
            return activityLogs;
        }

        return activityLogs.filter(
            (log) => {
                const values = [
                    log.description,
                    log.action,
                    log.module,
                    log.user?.name,
                    log.user?.email,
                    log.branch?.name,
                    log.branch?.code,
                    log.warehouse?.name,
                    log.warehouse?.code,
                ];

                return values.some(
                    (value) =>
                        value
                            ?.toLowerCase()
                            .includes(
                                normalizedSearch
                            )
                );
            }
        );
    }, [
        activityLogs,
        search,
    ]);

    /*
    |--------------------------------------------------------------------------
    | View Details
    |--------------------------------------------------------------------------
    */

    const handleViewDetails = (
        log: ActivityLog
    ) => {
        setSelectedLog(log);
        setDetailsOpen(true);
    };

    const handleDetailsOpenChange = (
        open: boolean
    ) => {
        setDetailsOpen(open);

        if (!open) {
            setSelectedLog(null);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Reset Filters
    |--------------------------------------------------------------------------
    */

    const handleResetFilters = () => {
        setSearch("");
        setFilters({});
    };

    const hasFilters =
        Boolean(search) ||
        Boolean(filters.module) ||
        Boolean(filters.action) ||
        Boolean(filters.date_from) ||
        Boolean(filters.date_to);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Activity Logs
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    View and monitor system
                    activities and user actions.
                </p>
            </div>

            {/* Activity Logs */}
            <div className="overflow-hidden rounded-sm border border-slate-200 bg-white">
                <ActivityLogToolbar
                    search={search}
                    filters={filters}
                    currentPage={1}
                    itemsPerPage={10}
                    totalItems={
                        filteredLogs.length
                    }
                    onSearchChange={
                        setSearch
                    }
                    onFiltersChange={
                        setFilters
                    }
                />

                {/* Error */}
                {error ? (
                    <div
                        className="px-6 py-12 text-center"
                        role="alert"
                    >
                        <p className="text-sm text-red-600">
                            {error}
                        </p>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={refetch}
                            className="mt-4 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <ActivityLogTable
                        logs={filteredLogs}
                        loading={loading}
                        onViewDetails={
                            handleViewDetails
                        }
                    />
                )}
            </div>

            {/* Reset Filters */}
            {hasFilters && (
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={
                            handleResetFilters
                        }
                        className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <RotateCcw className="h-4 w-4" />

                        Reset Filters
                    </Button>
                </div>
            )}

            {/* Activity Details */}
            <ActivityLogDetails
                log={selectedLog}
                open={detailsOpen}
                onOpenChange={
                    handleDetailsOpenChange
                }
            />
        </div>
    );
}