"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    MoreHorizontal,
    Pencil,
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import type {
    Inventory,
} from "@/src/services/inventoryService";

import InventoryTableToolbar, {
    type InventoryStockStatus,
} from "@/src/components/inventory/InventoryTableToolbar";

import EditInventoryLevelsDialog from "@/src/components/inventory/EditInventoryLevelsDialog";

interface InventoryTableProps {
    inventory: Inventory[];
    onUpdated?: () => void;
}

const INVENTORY_PER_PAGE = 5;

export default function InventoryTable({
    inventory,
    onUpdated,
}: InventoryTableProps) {
    const [currentPage, setCurrentPage] =
        useState(1);

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState<InventoryStockStatus>("all");

    const [
        selectedInventory,
        setSelectedInventory,
    ] = useState<Inventory | null>(null);

    const [
        editLevelsOpen,
        setEditLevelsOpen,
    ] = useState(false);

    const getStockStatus = (
        quantity: string,
        reorderLevel: string
    ) => {
        const value = Number(quantity);

        const threshold =
            Number(reorderLevel);

        if (value <= 0) {
            return {
                label: "Out of Stock",
                value: "out_of_stock" as const,
                className:
                    "border-red-200 bg-red-50 text-red-700",
            };
        }

        if (value <= threshold) {
            return {
                label: "Low Stock",
                value: "low_stock" as const,
                className:
                    "border-amber-200 bg-amber-50 text-amber-700",
            };
        }

        return {
            label: "In Stock",
            value: "in_stock" as const,
            className:
                "border-green-200 bg-green-50 text-green-700",
        };
    };

    const filteredInventory = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return inventory.filter((item) => {
            const matchesSearch =
                !normalizedSearch ||
                item.product.name
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                item.product.sku
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                (
                    item.product.category?.name ??
                    ""
                )
                    .toLowerCase()
                    .includes(normalizedSearch);

            const stockStatus =
                getStockStatus(
                    item.quantity,
                    item.reorder_level
                );

            const matchesStatus =
                status === "all" ||
                stockStatus.value === status;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        inventory,
        search,
        status,
    ]);

    const totalPages = Math.ceil(
        filteredInventory.length /
            INVENTORY_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage((page) =>
            Math.min(
                Math.max(page, 1),
                Math.max(totalPages, 1)
            )
        );
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        status,
    ]);

    const paginatedInventory = useMemo(() => {
        const startIndex =
            (currentPage - 1) *
            INVENTORY_PER_PAGE;

        return filteredInventory.slice(
            startIndex,
            startIndex +
                INVENTORY_PER_PAGE
        );
    }, [
        filteredInventory,
        currentPage,
    ]);

    const formatQuantity = (
        quantity: string
    ) => {
        return Number(
            quantity
        ).toLocaleString("en-PH", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    };

    const openEditLevels = (
        item: Inventory
    ) => {
        setSelectedInventory(item);
        setEditLevelsOpen(true);
    };

    const handleEditLevelsOpenChange = (
        open: boolean
    ) => {
        setEditLevelsOpen(open);

        if (!open) {
            setSelectedInventory(null);
        }
    };

    const handleUpdated = async () => {
        onUpdated?.();
    };

    const goToPreviousPage = () => {
        setCurrentPage((page) =>
            Math.max(page - 1, 1)
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
        <>
            <div className="mt-6 overflow-hidden rounded-sm border border-slate-200 bg-white">
                <InventoryTableToolbar
                    search={search}
                    status={status}
                    currentPage={currentPage}
                    itemsPerPage={
                        INVENTORY_PER_PAGE
                    }
                    totalItems={
                        filteredInventory.length
                    }
                    onSearchChange={
                        setSearch
                    }
                    onStatusChange={
                        setStatus
                    }
                />

                {/* Filtered Empty State */}
                {filteredInventory.length ===
                0 ? (
                    <div className="px-6 py-12 text-center">
                        <p className="text-sm font-medium text-slate-700">
                            No inventory records found.
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Try adjusting your search or filters.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <Table>
                            <TableHeader>
                                <TableRow className="border-blue-100 bg-blue-50 hover:bg-blue-50">
                                    <TableHead className="text-blue-900">
                                        Product
                                    </TableHead>

                                    <TableHead className="text-blue-900">
                                        SKU
                                    </TableHead>

                                    <TableHead className="text-blue-900">
                                        Category
                                    </TableHead>

                                    <TableHead className="text-blue-900">
                                        Location
                                    </TableHead>

                                    <TableHead className="text-right text-blue-900">
                                        Quantity
                                    </TableHead>

                                    <TableHead className="text-right text-blue-900">
                                        PAR Level
                                    </TableHead>

                                    <TableHead className="text-right text-blue-900">
                                        Reorder Level
                                    </TableHead>

                                    <TableHead className="text-blue-900">
                                        Status
                                    </TableHead>

                                    <TableHead className="w-12 text-right text-blue-900">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {paginatedInventory.map(
                                    (
                                        item
                                    ) => {
                                        const stockStatus =
                                            getStockStatus(
                                                item.quantity,
                                                item.reorder_level
                                            );

                                        return (
                                            <TableRow
                                                key={
                                                    item.id
                                                }
                                                className="border-slate-200 hover:bg-slate-50"
                                            >
                                                <TableCell className="font-medium text-slate-900">
                                                    <div>
                                                        <p className="font-medium text-slate-900">
                                                            {
                                                                item
                                                                    .product
                                                                    .name
                                                            }
                                                        </p>

                                                        <p className="text-xs text-slate-500">
                                                            {
                                                                item
                                                                    .product
                                                                    .unit
                                                            }
                                                        </p>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="font-mono text-sm text-slate-600">
                                                    {
                                                        item
                                                            .product
                                                            .sku
                                                    }
                                                </TableCell>

                                                <TableCell className="text-slate-600">
                                                    {
                                                        item
                                                            .product
                                                            .category
                                                            ?.name ??
                                                        "Uncategorized"
                                                    }
                                                </TableCell>

                                                <TableCell>
                                                    {item.warehouse ? (
                                                        <div>
                                                            <p className="font-medium text-slate-800">
                                                                {
                                                                    item
                                                                        .warehouse
                                                                        .name
                                                                }
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                {
                                                                    item
                                                                        .warehouse
                                                                        .code
                                                                }
                                                            </p>
                                                        </div>
                                                    ) : item.branch ? (
                                                        <div>
                                                            <p className="font-medium text-slate-800">
                                                                {
                                                                    item
                                                                        .branch
                                                                        .name
                                                                }
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                {
                                                                    item
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

                                                <TableCell className="text-right">
                                                    <span className="font-semibold text-slate-900">
                                                        {formatQuantity(
                                                            item.quantity
                                                        )}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <span className="font-medium text-slate-700">
                                                        {formatQuantity(
                                                            item.par_level
                                                        )}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <span className="font-medium text-slate-700">
                                                        {formatQuantity(
                                                            item.reorder_level
                                                        )}
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            stockStatus.className
                                                        }
                                                    >
                                                        {
                                                            stockStatus.label
                                                        }
                                                    </Badge>
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
                                                                Open inventory actions
                                                            </span>
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-48"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    openEditLevels(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="mr-2 h-4 w-4" />

                                                                Edit Stock Levels
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }
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

                                        {Array.from(
                                            {
                                                length: totalPages,
                                            },
                                            (
                                                _,
                                                index
                                            ) =>
                                                index +
                                                1
                                        ).map(
                                            (
                                                page
                                            ) => (
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
                                            )
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

            <EditInventoryLevelsDialog
                open={editLevelsOpen}
                inventory={
                    selectedInventory
                }
                onOpenChange={
                    handleEditLevelsOpenChange
                }
                onUpdated={
                    handleUpdated
                }
            />
        </>
    );
}