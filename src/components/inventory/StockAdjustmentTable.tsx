"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Eye,
    MoreHorizontal,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { Input } from "@/components/ui/input";

import type {
    StockAdjustment,
} from "@/src/services/stockAdjustmentService";

import ViewStockAdjustmentDialog from "@/src/components/inventory/ViewStockAdjustmentDialog";

interface StockAdjustmentTableProps {
    stockAdjustments: StockAdjustment[];
}

const STOCK_ADJUSTMENTS_PER_PAGE = 5;

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

export default function StockAdjustmentTable({
    stockAdjustments,
}: StockAdjustmentTableProps) {
    const [currentPage, setCurrentPage] =
        useState(1);

    const [search, setSearch] =
        useState("");

    const [
        selectedStockAdjustment,
        setSelectedStockAdjustment,
    ] = useState<StockAdjustment | null>(
        null
    );

    const filteredStockAdjustments =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            return stockAdjustments.filter(
                (stockAdjustment) => {
                    if (
                        !normalizedSearch
                    ) {
                        return true;
                    }

                    const reference =
                        stockAdjustment.reference_number.toLowerCase();

                    const reason =
                        stockAdjustment.reason.toLowerCase();

                    const type =
                        stockAdjustment.type.toLowerCase();

                    const warehouse =
                        stockAdjustment.warehouse?.name.toLowerCase() ??
                        "";

                    const branch =
                        stockAdjustment.branch?.name.toLowerCase() ??
                        "";

                    const creator =
                        stockAdjustment.creator?.name.toLowerCase() ??
                        "";

                    return (
                        reference.includes(
                            normalizedSearch
                        ) ||
                        reason.includes(
                            normalizedSearch
                        ) ||
                        type.includes(
                            normalizedSearch
                        ) ||
                        warehouse.includes(
                            normalizedSearch
                        ) ||
                        branch.includes(
                            normalizedSearch
                        ) ||
                        creator.includes(
                            normalizedSearch
                        )
                    );
                }
            );
        }, [
            stockAdjustments,
            search,
        ]);

    const totalPages = Math.ceil(
        filteredStockAdjustments.length /
            STOCK_ADJUSTMENTS_PER_PAGE
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
    }, [search]);

    const startIndex =
        (currentPage - 1) *
        STOCK_ADJUSTMENTS_PER_PAGE;

    const paginatedStockAdjustments =
        filteredStockAdjustments.slice(
            startIndex,
            startIndex +
                STOCK_ADJUSTMENTS_PER_PAGE
        );

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

    const formatDateTime = (
        value: string
    ) => {
        return new Date(
            value
        ).toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const formatQuantity = (
        value: string
    ) => {
        return Number(value).toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }
        );
    };

    return (
        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white">
            {/* Header */}
            <div className="border-b border-blue-100 bg-white px-4 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Stock Adjustment History
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            View previously recorded inventory adjustments.
                        </p>
                    </div>

                    <Input
                        type="search"
                        placeholder="Search adjustments..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        className="w-full border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-300 focus-visible:ring-0 md:w-72"
                    />
                </div>
            </div>

            {/* Result Count */}
            <div className="border-b border-blue-50 px-4 py-2.5">
                <p className="text-xs text-slate-500">
                    Showing{" "}
                    <span className="font-medium text-slate-700">
                        {filteredStockAdjustments.length ===
                        0
                            ? 0
                            : startIndex + 1}
                        –
                        {Math.min(
                            startIndex +
                                paginatedStockAdjustments.length,
                            filteredStockAdjustments.length
                        )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-700">
                        {
                            filteredStockAdjustments.length
                        }
                    </span>{" "}
                    adjustments
                </p>
            </div>

            {/* Empty State */}
            {filteredStockAdjustments.length ===
            0 ? (
                <div className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-700">
                        No stock adjustments found.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Try adjusting your search.
                    </p>
                </div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-blue-100 bg-blue-50 hover:bg-blue-50">
                                <TableHead className="text-blue-900">
                                    Reference
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Adjusted At
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Type
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Reason
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Location
                                </TableHead>

                                <TableHead className="text-center text-blue-900">
                                    Items
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Created By
                                </TableHead>

                                <TableHead className="w-16 text-right text-blue-900">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedStockAdjustments.map(
                                (
                                    stockAdjustment
                                ) => (
                                    <TableRow
                                        key={
                                            stockAdjustment.id
                                        }
                                        className="border-slate-200 hover:bg-slate-50"
                                    >
                                        <TableCell>
                                            <span className="font-mono text-sm font-medium text-slate-800">
                                                {
                                                    stockAdjustment.reference_number
                                                }
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-sm text-slate-600">
                                            {formatDateTime(
                                                stockAdjustment.adjusted_at
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {stockAdjustment.type ===
                                            "increase" ? (
                                                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                    Increase
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                                                    Decrease
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <span className="text-sm text-slate-700">
                                                {
                                                    stockAdjustment.reason
                                                }
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            {stockAdjustment.warehouse ? (
                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {
                                                            stockAdjustment
                                                                .warehouse
                                                                .name
                                                        }
                                                    </p>
                                                    
                                                    <p className="text-xs text-slate-500">
                                                        Warehouse ·{" "}
                                                        {
                                                            stockAdjustment
                                                                .warehouse
                                                                .code
                                                        }
                                                    </p>
                                                </div>
                                            ) : stockAdjustment.branch ? (
                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {
                                                            stockAdjustment
                                                                .branch
                                                                .name
                                                        }
                                                    </p>
                                                    
                                                    <p className="text-xs text-slate-500">
                                                        Branch ·{" "}
                                                        {
                                                            stockAdjustment
                                                                .branch
                                                                .code
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            <span className="font-medium text-slate-700">
                                                {
                                                    stockAdjustment
                                                        .items
                                                        .length
                                                }
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            {stockAdjustment.creator ? (
                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {
                                                            stockAdjustment
                                                                .creator
                                                                .name
                                                        }
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {
                                                            stockAdjustment
                                                                .creator
                                                                .email
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    render={
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                                                        />
                                                    }
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />

                                                    <span className="sr-only">
                                                        Open stock adjustment actions
                                                    </span>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setSelectedStockAdjustment(
                                                                stockAdjustment
                                                            )
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />

                                                        View
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>

                    {/*
                    |----------------------------------------------------------------------
                    | Pagination
                    |----------------------------------------------------------------------
                    */}

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

            <ViewStockAdjustmentDialog
                stockAdjustment={
                    selectedStockAdjustment
                }
                open={
                    selectedStockAdjustment !==
                    null
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setSelectedStockAdjustment(
                            null
                        );
                    }
                }}
            />
        </div>
    );
}