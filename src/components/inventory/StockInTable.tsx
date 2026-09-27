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

import ViewStockInDialog from "@/src/components/inventory/ViewStockInDialog";

import type {
    StockIn,
} from "@/src/services/stockInService";

interface StockInTableProps {
    stockIns: StockIn[];
}

const STOCK_INS_PER_PAGE = 5;

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

export default function StockInTable({
    stockIns,
}: StockInTableProps) {
    const [currentPage, setCurrentPage] =
        useState(1);

    const [search, setSearch] =
        useState("");

    const [selectedStockIn, setSelectedStockIn] =
        useState<StockIn | null>(null);

    const filteredStockIns = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return stockIns.filter((stockIn) => {
            if (!normalizedSearch) {
                return true;
            }

            const reference =
                stockIn.reference_number
                    .toLowerCase();

            const warehouse =
                stockIn.warehouse?.name
                    .toLowerCase() ?? "";

            const creator =
                stockIn.creator?.name
                    .toLowerCase() ?? "";

            return (
                reference.includes(
                    normalizedSearch
                ) ||
                warehouse.includes(
                    normalizedSearch
                ) ||
                creator.includes(
                    normalizedSearch
                )
            );
        });
    }, [
        stockIns,
        search,
    ]);

    const totalPages = Math.ceil(
        filteredStockIns.length /
            STOCK_INS_PER_PAGE
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
        STOCK_INS_PER_PAGE;

    const paginatedStockIns =
        filteredStockIns.slice(
            startIndex,
            startIndex +
                STOCK_INS_PER_PAGE
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

    return (
        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white">
            {/* Header */}
            <div className="border-b border-blue-100 bg-white px-4 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Stock In History
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            View previously recorded stock-in transactions.
                        </p>
                    </div>

                    <Input
                        type="search"
                        placeholder="Search stock-in..."
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
                        {filteredStockIns.length ===
                        0
                            ? 0
                            : startIndex + 1}
                        –
                        {Math.min(
                            startIndex +
                                paginatedStockIns.length,
                            filteredStockIns.length
                        )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-700">
                        {
                            filteredStockIns.length
                        }
                    </span>{" "}
                    stock-in transactions
                </p>
            </div>

            {/* Empty State */}
            {filteredStockIns.length ===
            0 ? (
                <div className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-700">
                        No stock-in transactions found.
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
                                    Received At
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Warehouse
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
                            {paginatedStockIns.map(
                                (stockIn) => (
                                    <TableRow
                                        key={
                                            stockIn.id
                                        }
                                        className="border-slate-200 hover:bg-slate-50"
                                    >
                                        <TableCell>
                                            <span className="font-mono text-sm font-medium text-slate-800">
                                                {
                                                    stockIn.reference_number
                                                }
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-sm text-slate-600">
                                            {formatDateTime(
                                                stockIn.received_at
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {stockIn.warehouse ? (
                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {
                                                            stockIn
                                                                .warehouse
                                                                .name
                                                        }
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {
                                                            stockIn
                                                                .warehouse
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
                                                    stockIn
                                                        .items
                                                        .length
                                                }
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            {stockIn.creator ? (
                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {
                                                            stockIn
                                                                .creator
                                                                .name
                                                        }
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {
                                                            stockIn
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
                                                        Open stock-in actions
                                                    </span>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setSelectedStockIn(
                                                                stockIn
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

                    {/* View Stock In */}
                    <ViewStockInDialog
                        stockIn={
                            selectedStockIn
                        }
                        open={
                            selectedStockIn !==
                            null
                        }
                        onOpenChange={(
                            open
                        ) => {
                            if (!open) {
                                setSelectedStockIn(
                                    null
                                );
                            }
                        }}
                    />

                    {/* Pagination */}
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