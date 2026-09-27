"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Eye,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import type {
    ActivityLog,
} from "@/src/services/activityLogService";

interface ActivityLogTableProps {
    logs: ActivityLog[];

    loading?: boolean;

    onViewDetails?: (
        log: ActivityLog
    ) => void;
}

const ACTIVITY_LOGS_PER_PAGE = 5;

const getPaginationPages = (
    currentPage: number,
    totalPages: number
): (number | "...")[] => {
    if (totalPages <= 7) {
        return Array.from(
            {
                length: totalPages,
            },
            (_, index) =>
                index + 1
        );
    }

    if (currentPage <= 4) {
        return [
            1,
            2,
            3,
            4,
            5,
            "...",
            totalPages,
        ];
    }

    if (
        currentPage >=
        totalPages - 3
    ) {
        return [
            1,
            "...",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
    ];
};

function formatDateTime(
    value: string
): string {
    return new Date(
        value
    ).toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function formatAction(
    action: string
): string {
    return action
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
}

function formatModule(
    module: string
): string {
    return module
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
}

function getActionBadgeClass(
    action: string
): string {
    switch (action) {
        case "created":
            return "border-green-200 bg-green-50 text-green-700";

        case "updated":
            return "border-blue-200 bg-blue-50 text-blue-700";

        case "approved":
            return "border-green-200 bg-green-50 text-green-700";

        case "rejected":
            return "border-red-200 bg-red-50 text-red-700";

        case "deleted":
            return "border-red-200 bg-red-50 text-red-700";

        case "status_changed":
            return "border-amber-200 bg-amber-50 text-amber-700";

        case "prepared":
        case "released":
            return "border-blue-200 bg-blue-50 text-blue-700";

        case "delivered":
        case "completed":
            return "border-green-200 bg-green-50 text-green-700";

        default:
            return "border-slate-200 bg-slate-50 text-slate-700";
    }
}

function getLocation(
    log: ActivityLog
): string {
    if (log.branch) {
        return log.branch.name;
    }

    if (log.warehouse) {
        return log.warehouse.name;
    }

    return "—";
}

export default function ActivityLogTable({
    logs,
    loading = false,
    onViewDetails,
}: ActivityLogTableProps) {
    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const totalPages = Math.ceil(
        logs.length /
            ACTIVITY_LOGS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage((page) =>
            Math.min(
                Math.max(page, 1),
                Math.max(
                    totalPages,
                    1
                )
            )
        );
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [logs]);

    const startIndex =
        (currentPage - 1) *
        ACTIVITY_LOGS_PER_PAGE;

    const paginatedLogs =
        useMemo(() => {
            return logs.slice(
                startIndex,
                startIndex +
                    ACTIVITY_LOGS_PER_PAGE
            );
        }, [
            logs,
            startIndex,
        ]);

    const paginationPages =
        getPaginationPages(
            currentPage,
            totalPages
        );

    const goToPreviousPage = () => {
        setCurrentPage((page) =>
            Math.max(
                page - 1,
                1
            )
        );
    };

    const goToNextPage = () => {
        setCurrentPage((page) =>
            Math.min(
                page + 1,
                totalPages
            )
        );
    };

    return (
        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white">
            {loading ? (
                <div className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-700">
                        Loading activity logs...
                    </p>
                </div>
            ) : logs.length === 0 ? (
                <div className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-700">
                        No activity logs found.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Activity records will appear here when available.
                    </p>
                </div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-blue-100 bg-blue-50 hover:bg-blue-50">
                                <TableHead className="text-blue-900">
                                    Date & Time
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    User
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Action
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Module
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Location
                                </TableHead>

                                <TableHead className="w-16 text-right text-blue-900">
                                    Details
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedLogs.map(
                                (log) => (
                                    <TableRow
                                        key={log.id}
                                        className="border-slate-200 hover:bg-slate-50"
                                    >
                                        <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                            {formatDateTime(
                                                log.created_at
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-slate-800">
                                                    {log.user?.name ?? "Unauthenticated"}
                                                </p>
                                                                                
                                                <p className="text-xs text-slate-500">
                                                    {log.user?.email ?? "No authenticated user"}
                                                </p>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getActionBadgeClass(
                                                    log.action
                                                )}`}
                                            >
                                                {formatAction(
                                                    log.action
                                                )}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                                                {formatModule(
                                                    log.module
                                                )}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-slate-800">
                                                    {getLocation(
                                                        log
                                                    )}
                                                </p>

                                                {log.branch && (
                                                    <p className="text-xs text-slate-500">
                                                        Branch ·{" "}
                                                        {
                                                            log
                                                                .branch
                                                                .code
                                                        }
                                                    </p>
                                                )}

                                                {log.warehouse && (
                                                    <p className="text-xs text-slate-500">
                                                        Warehouse ·{" "}
                                                        {
                                                            log
                                                                .warehouse
                                                                .code
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                                                onClick={() =>
                                                    onViewDetails?.(
                                                        log
                                                    )
                                                }
                                                disabled={
                                                    !onViewDetails
                                                }
                                            >
                                                <Eye className="h-4 w-4" />

                                                <span className="sr-only">
                                                    View activity details
                                                </span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>

                    {totalPages > 1 && (
                        <div className="border-t border-blue-100 bg-white px-4 py-3">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(
                                                event
                                            ) => {
                                                event.preventDefault();

                                                goToPreviousPage();
                                            }}
                                            aria-disabled={
                                                currentPage ===
                                                1
                                            }
                                            className={
                                                currentPage ===
                                                1
                                                    ? "pointer-events-none opacity-50"
                                                    : ""
                                            }
                                        />
                                    </PaginationItem>

                                    {paginationPages.map(
                                        (
                                            page,
                                            index
                                        ) => {
                                            if (
                                                page ===
                                                "..."
                                            ) {
                                                return (
                                                    <PaginationItem
                                                        key={`ellipsis-${index}`}
                                                    >
                                                        <span className="flex h-9 w-9 items-center justify-center text-sm text-slate-400">
                                                            ...
                                                        </span>
                                                    </PaginationItem>
                                                );
                                            }

                                            return (
                                                <PaginationItem
                                                    key={
                                                        page
                                                    }
                                                >
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={
                                                            page ===
                                                            currentPage
                                                        }
                                                        onClick={(
                                                            event
                                                        ) => {
                                                            event.preventDefault();

                                                            setCurrentPage(
                                                                page
                                                            );
                                                        }}
                                                    >
                                                        {
                                                            page
                                                        }
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        }
                                    )}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(
                                                event
                                            ) => {
                                                event.preventDefault();

                                                goToNextPage();
                                            }}
                                            aria-disabled={
                                                currentPage ===
                                                totalPages
                                            }
                                            className={
                                                currentPage ===
                                                totalPages
                                                    ? "pointer-events-none opacity-50"
                                                    : ""
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}