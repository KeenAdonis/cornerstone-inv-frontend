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
    StockMovement,
} from "@/src/services/stockMovementService";

interface StockMovementTableProps {
    stockMovements: StockMovement[];
    onView: (stockMovement: StockMovement) => void;
}

const STOCK_MOVEMENTS_PER_PAGE = 5;

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

const getMovementTypeLabel = (
    type: StockMovement["movement_type"]
): string => {
    const labels: Record<
        StockMovement["movement_type"],
        string
    > = {
        stock_in: "Stock In",
        stock_out: "Stock Out",
        transfer: "Transfer",
        adjustment: "Adjustment",
    };

    return labels[type];
};

const getMovementTypeClassName = (
    type: StockMovement["movement_type"]
): string => {
    const classes: Record<
        StockMovement["movement_type"],
        string
    > = {
        stock_in:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

        stock_out:
            "border-red-200 bg-red-50 text-red-700",

        transfer:
            "border-blue-200 bg-blue-50 text-blue-700",

        adjustment:
            "border-amber-200 bg-amber-50 text-amber-700",
    };

    return classes[type];
};

const formatDateTime = (
    value: string
): string => {
    return new Date(
        value
    ).toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const formatQuantity = (
    value: string
): string => {
    return Number(value).toLocaleString(
        "en-PH",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }
    );
};

const getLocationLabel = (
    warehouse?: {
        id: number;
        name: string;
        code: string;
    },
    branch?: {
        id: number;
        name: string;
        code: string;
    }
): string => {
    if (warehouse) {
        return warehouse.name;
    }

    if (branch) {
        return branch.name;
    }

    return "—";
};

export default function StockMovementTable({
    stockMovements,
    onView,
}: StockMovementTableProps) {
    const [currentPage, setCurrentPage] =
        useState(1);

    const [search, setSearch] =
        useState("");

    const filteredStockMovements =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            return stockMovements.filter(
                (stockMovement) => {
                    if (
                        !normalizedSearch
                    ) {
                        return true;
                    }

                    const product =
                        stockMovement.product?.name.toLowerCase() ??
                        "";

                    const sku =
                        stockMovement.product?.sku.toLowerCase() ??
                        "";

                    const movementType =
                        getMovementTypeLabel(
                            stockMovement.movement_type
                        ).toLowerCase();

                    const reference =
                        stockMovement
                            .purchase_order
                            ?.reference_number.toLowerCase() ??
                        "";

                    const fromWarehouse =
                        stockMovement
                            .from_warehouse
                            ?.name.toLowerCase() ??
                        "";

                    const fromBranch =
                        stockMovement
                            .from_branch
                            ?.name.toLowerCase() ??
                        "";

                    const toWarehouse =
                        stockMovement
                            .to_warehouse
                            ?.name.toLowerCase() ??
                        "";

                    const toBranch =
                        stockMovement
                            .to_branch
                            ?.name.toLowerCase() ??
                        "";

                    const creator =
                        stockMovement.creator?.name.toLowerCase() ??
                        "";

                    return (
                        product.includes(
                            normalizedSearch
                        ) ||
                        sku.includes(
                            normalizedSearch
                        ) ||
                        movementType.includes(
                            normalizedSearch
                        ) ||
                        reference.includes(
                            normalizedSearch
                        ) ||
                        fromWarehouse.includes(
                            normalizedSearch
                        ) ||
                        fromBranch.includes(
                            normalizedSearch
                        ) ||
                        toWarehouse.includes(
                            normalizedSearch
                        ) ||
                        toBranch.includes(
                            normalizedSearch
                        ) ||
                        creator.includes(
                            normalizedSearch
                        )
                    );
                }
            );
        }, [
            stockMovements,
            search,
        ]);

    const totalPages = Math.ceil(
        filteredStockMovements.length /
            STOCK_MOVEMENTS_PER_PAGE
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
        STOCK_MOVEMENTS_PER_PAGE;

    const paginatedStockMovements =
        filteredStockMovements.slice(
            startIndex,
            startIndex +
                STOCK_MOVEMENTS_PER_PAGE
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

    return (
        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white">
            {/* Header */}
            <div className="border-b border-blue-100 bg-white px-4 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Stock Movement History
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            View recorded inventory movements across assigned locations.
                        </p>
                    </div>

                    <Input
                        type="search"
                        placeholder="Search movements..."
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
                        {filteredStockMovements.length ===
                        0
                            ? 0
                            : startIndex + 1}
                        –
                        {Math.min(
                            startIndex +
                                paginatedStockMovements.length,
                            filteredStockMovements.length
                        )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-700">
                        {
                            filteredStockMovements.length
                        }
                    </span>{" "}
                    movements
                </p>
            </div>

            {/* Empty State */}
            {filteredStockMovements.length ===
            0 ? (
                <div className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-700">
                        No stock movements found.
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
                                    Product
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Moved At
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Type
                                </TableHead>

                                <TableHead className="text-right text-blue-900">
                                    Quantity
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    From
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    To
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Reference
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
                            {paginatedStockMovements.map(
                                (
                                    stockMovement
                                ) => (
                                    <TableRow
                                        key={
                                            stockMovement.id
                                        }
                                        className="border-slate-200 hover:bg-slate-50"
                                    >
                                        <TableCell>
                                            {stockMovement.product ? (
                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {
                                                            stockMovement
                                                                .product
                                                                .name
                                                        }
                                                    </p>

                                                    <p className="font-mono text-xs text-slate-500">
                                                        {
                                                            stockMovement
                                                                .product
                                                                .sku
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap text-sm text-slate-600">
                                            {formatDateTime(
                                                stockMovement.moved_at
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <span
                                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getMovementTypeClassName(
                                                    stockMovement.movement_type
                                                )}`}
                                            >
                                                {getMovementTypeLabel(
                                                    stockMovement.movement_type
                                                )}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <span className="font-medium text-slate-800">
                                                {formatQuantity(
                                                    stockMovement.quantity
                                                )}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <span className="text-sm text-slate-700">
                                                {getLocationLabel(
                                                    stockMovement.from_warehouse,
                                                    stockMovement.from_branch
                                                )}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <span className="text-sm text-slate-700">
                                                {getLocationLabel(
                                                    stockMovement.to_warehouse,
                                                    stockMovement.to_branch
                                                )}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            {stockMovement.purchase_order ? (
                                                <span className="font-mono text-xs font-medium text-slate-700">
                                                    {
                                                        stockMovement
                                                            .purchase_order
                                                            .reference_number
                                                    }
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {stockMovement.creator ? (
                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {
                                                            stockMovement
                                                                .creator
                                                                .name
                                                        }
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {
                                                            stockMovement
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
                                                        Open stock movement actions
                                                    </span>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onView(
                                                                stockMovement
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