"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
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
import { Switch } from "@/components/ui/switch";

import { DataTablePagination } from "@/components/ui/data-table-pagination";

import type {
    Warehouse,
} from "@/src/services/warehouseService";

import {
    useToggleWarehouseStatus,
} from "@/src/hooks/warehouse/useToggleWarehouseStatus";

import WarehouseTableToolbar from "@/src/components/admin/warehouse/WarehouseTableToolbar";
import EditWarehouseDialog from "@/src/components/admin/warehouse/EditWarehouseDialog";
import ViewWarehouseDialog from "@/src/components/admin/warehouse/ViewWarehouseDialog";
import DeleteWarehouseDialog from "@/src/components/admin/warehouse/DeleteWarehouseDialog";

type WarehouseArea =
    | "luzon"
    | "visayas"
    | "mindanao";

type WarehouseStatus =
    | "active"
    | "inactive";

interface WarehouseTableProps {
    warehouses: Warehouse[];
    onWarehouseUpdated: () => void;
}

const areaLabels: Record<
    WarehouseArea,
    string
> = {
    luzon: "Luzon",
    visayas: "Visayas",
    mindanao: "Mindanao",
};

export default function WarehouseTable({
    warehouses,
    onWarehouseUpdated,
}: WarehouseTableProps) {
    const {
        handleToggleWarehouseStatus,
        loading: statusLoading,
    } = useToggleWarehouseStatus();

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const [
        pageSize,
        setPageSize,
    ] = useState(10);

    const [search, setSearch] =
        useState("");

    const [area, setArea] =
        useState<WarehouseArea | "all">(
            "all"
        );

    const [status, setStatus] =
        useState<WarehouseStatus | "all">(
            "all"
        );

    const [
        selectedWarehouse,
        setSelectedWarehouse,
    ] = useState<Warehouse | null>(null);

    const [
        editingWarehouse,
        setEditingWarehouse,
    ] = useState<Warehouse | null>(null);

    const [
        deletingWarehouse,
        setDeletingWarehouse,
    ] = useState<Warehouse | null>(null);

    const filteredWarehouses =
        useMemo(() => {
            const normalizedSearch =
                search.trim().toLowerCase();

            return warehouses.filter(
                (warehouse) => {
                    const matchesSearch =
                        !normalizedSearch ||
                        warehouse.name
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        warehouse.code
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        warehouse.area
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        warehouse.address
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            );

                    const matchesArea =
                        area === "all" ||
                        warehouse.area ===
                            area;

                    const matchesStatus =
                        status === "all" ||
                        warehouse.status ===
                            status;

                    return (
                        matchesSearch &&
                        matchesArea &&
                        matchesStatus
                    );
                }
            );
        }, [
            warehouses,
            search,
            area,
            status,
        ]);

    const totalPages = Math.ceil(
        filteredWarehouses.length /
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
        area,
        status,
        pageSize,
    ]);

    const startIndex =
        (currentPage - 1) *
        pageSize;

    const paginatedWarehouses =
        filteredWarehouses.slice(
            startIndex,
            startIndex + pageSize
        );

    return (
        <div className="mt-6 overflow-hidden rounded-sm border border-slate-200 bg-white">
            <WarehouseTableToolbar
                search={search}
                area={area}
                status={status}
                currentPage={currentPage}
                itemsPerPage={pageSize}
                totalItems={
                    filteredWarehouses.length
                }
                onSearchChange={setSearch}
                onAreaChange={setArea}
                onStatusChange={setStatus}
            />

            {filteredWarehouses.length ===
            0 ? (
                <div className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-700">
                        No warehouses found.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Try adjusting your search or filters.
                    </p>
                </div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-blue-100 bg-blue-50 hover:bg-blue-50">
                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Warehouse Name
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Code
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Area
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Address
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Status
                                </TableHead>

                                <TableHead className="w-16 whitespace-nowrap text-right text-xs font-semibold text-blue-900">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedWarehouses.map(
                                (warehouse) => (
                                    <TableRow
                                        key={
                                            warehouse.id
                                        }
                                        className="border-slate-200 hover:bg-slate-50"
                                    >
                                        <TableCell className="font-medium text-slate-900">
                                            {
                                                warehouse.name
                                            }
                                        </TableCell>

                                        <TableCell className="text-slate-600">
                                            {
                                                warehouse.code
                                            }
                                        </TableCell>

                                        <TableCell className="text-slate-600">
                                            {
                                                areaLabels[
                                                    warehouse.area
                                                ]
                                            }
                                        </TableCell>

                                        <TableCell className="text-slate-600">
                                            {
                                                warehouse.address
                                            }
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Switch
                                                    checked={
                                                        warehouse.status ===
                                                        "active"
                                                    }
                                                    disabled={
                                                        statusLoading
                                                    }
                                                    aria-label={`Toggle ${warehouse.name} status`}
                                                    onCheckedChange={async () => {
                                                        const response =
                                                            await handleToggleWarehouseStatus(
                                                                warehouse.id
                                                            );

                                                        if (
                                                            !response
                                                        ) {
                                                            return;
                                                        }

                                                        onWarehouseUpdated();
                                                    }}
                                                />

                                                <span className="text-sm capitalize text-slate-600">
                                                    {
                                                        warehouse.status
                                                    }
                                                </span>
                                            </div>
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
                                                        Open actions
                                                    </span>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setSelectedWarehouse(
                                                                warehouse
                                                            )
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setEditingWarehouse(
                                                                warehouse
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setDeletingWarehouse(
                                                                warehouse
                                                            )
                                                        }
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
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
                            filteredWarehouses.length
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

            {/* View Warehouse Dialog */}
            <ViewWarehouseDialog
                warehouse={
                    selectedWarehouse
                }
                open={
                    selectedWarehouse !==
                    null
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setSelectedWarehouse(
                            null
                        );
                    }
                }}
            />

            {/* Edit Warehouse Dialog */}
            <EditWarehouseDialog
                warehouse={
                    editingWarehouse
                }
                open={
                    editingWarehouse !==
                    null
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setEditingWarehouse(
                            null
                        );
                    }
                }}
                onUpdated={
                    onWarehouseUpdated
                }
            />

            {/* Delete Warehouse Dialog */}
            <DeleteWarehouseDialog
                warehouse={
                    deletingWarehouse
                }
                open={
                    deletingWarehouse !==
                    null
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setDeletingWarehouse(
                            null
                        );
                    }
                }}
                onDeleted={
                    onWarehouseUpdated
                }
            />
        </div>
    );
}