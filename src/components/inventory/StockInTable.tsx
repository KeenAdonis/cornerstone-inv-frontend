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
    DataTablePagination,
} from "@/components/ui/data-table-pagination";

import { Input } from "@/components/ui/input";

import ViewStockInDialog from "@/src/components/inventory/ViewStockInDialog";

import type {
    StockIn,
} from "@/src/services/stockInService";

interface StockInTableProps {
    stockIns: StockIn[];
}

export default function StockInTable({
    stockIns,
}: StockInTableProps) {
    const [currentPage, setCurrentPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [search, setSearch] =
        useState("");

    const [
        selectedStockIn,
        setSelectedStockIn,
    ] = useState<StockIn | null>(null);

    const filteredStockIns =
        useMemo(() => {
            const normalizedSearch =
                search.trim().toLowerCase();

            return stockIns.filter(
                (stockIn) => {
                    if (
                        !normalizedSearch
                    ) {
                        return true;
                    }

                    const reference =
                        stockIn.reference_number
                            .toLowerCase();

                    const warehouse =
                        stockIn.warehouse?.name
                            .toLowerCase() ??
                        "";

                    const creator =
                        stockIn.creator?.name
                            .toLowerCase() ??
                        "";

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
                }
            );
        }, [
            stockIns,
            search,
        ]);

    const totalPages = Math.ceil(
        filteredStockIns.length /
            pageSize
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
    }, [
        search,
        pageSize,
    ]);

    const startIndex =
        (currentPage - 1) *
        pageSize;

    const paginatedStockIns =
        filteredStockIns.slice(
            startIndex,
            startIndex + pageSize
        );

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
                    {/* Table */}
                    <Table>
                        <TableHeader>
                            <TableRow className="border-blue-100 bg-blue-50 hover:bg-blue-50">
                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Reference
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Received At
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Warehouse
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-center text-xs font-semibold text-blue-900">
                                    Items
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Created By
                                </TableHead>

                                <TableHead className="w-16 whitespace-nowrap text-right text-xs font-semibold text-blue-900">
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

                                        <TableCell className="whitespace-nowrap text-sm text-slate-600">
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

                    {/* Pagination */}
                    <DataTablePagination
                        currentPage={
                            currentPage
                        }
                        totalPages={
                            totalPages
                        }
                        totalItems={
                            filteredStockIns.length
                        }
                        pageSize={
                            pageSize
                        }
                        pageSizeOptions={[
                            10,
                            25,
                            50,
                            100,
                        ]}
                        onPageChange={
                            setCurrentPage
                        }
                        onPageSizeChange={
                            setPageSize
                        }
                    />
                </>
            )}

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
        </div>
    );
}