"use client";

import { useMemo, useState } from "react";

import {
    RotateCcw,
} from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { useBranches } from "@/src/hooks/branches/useBranches";
import { useWarehouses } from "@/src/hooks/warehouse/useWarehouses";
import { useInventory } from "@/src/hooks/inventory/useInventory";

import InventoryTable from "@/src/components/inventory/InventoryTable";

type LocationType =
    | "branch"
    | "warehouse";

export default function InventoryPage() {
    const [
        locationType,
        setLocationType,
    ] = useState<LocationType | "">("");

    const [
        selectedArea,
        setSelectedArea,
    ] = useState("");

    const [
        selectedBranchId,
        setSelectedBranchId,
    ] = useState("");

    const [
        selectedWarehouseId,
        setSelectedWarehouseId,
    ] = useState("");

    const {
        branches,
        loading: branchesLoading,
        error: branchesError,
    } = useBranches();

    const {
        warehouses,
        loading: warehousesLoading,
        error: warehousesError,
    } = useWarehouses();

    const handleResetFilters = () => {
        setLocationType("");
        setSelectedArea("");
        setSelectedBranchId("");
        setSelectedWarehouseId("");
    };

    const inventoryFilters = useMemo(() => {
        if (locationType === "branch") {
            if (!selectedBranchId) {
                return {
                    locationType:
                        "branch" as const,
                };
            }

            return {
                locationType:
                    "branch" as const,
                area:
                    selectedArea || undefined,
                branchId:
                    Number(
                        selectedBranchId
                    ),
            };
        }

        if (
            locationType ===
            "warehouse"
        ) {
            if (
                !selectedWarehouseId
            ) {
                return {
                    locationType:
                        "warehouse" as const,
                };
            }

            return {
                locationType:
                    "warehouse" as const,
                warehouseId:
                    Number(
                        selectedWarehouseId
                    ),
            };
        }

        return undefined;
    }, [
        locationType,
        selectedArea,
        selectedBranchId,
        selectedWarehouseId,
    ]);

    const {
        inventory,
        loading,
        error,
    } = useInventory(
        inventoryFilters
    );

    /*
    |--------------------------------------------------------------------------
    | Areas
    |--------------------------------------------------------------------------
    */

    const areas = useMemo(() => {
        return Array.from(
            new Set(
                branches.map(
                    (branch) =>
                        branch.area
                )
            )
        ).sort();
    }, [branches]);

    /*
    |--------------------------------------------------------------------------
    | Branches filtered by area
    |--------------------------------------------------------------------------
    */

    const filteredBranches =
        useMemo(() => {
            if (!selectedArea) {
                return [];
            }

            return branches.filter(
                (branch) =>
                    branch.area ===
                    selectedArea
            );
        }, [
            branches,
            selectedArea,
        ]);

    /*
    |--------------------------------------------------------------------------
    | Handlers
    |--------------------------------------------------------------------------
    */

    const handleLocationTypeChange = (
        value: string | null
    ) => {
        if (
            value !== "branch" &&
            value !== "warehouse"
        ) {
            return;
        }

        setLocationType(value);

        setSelectedArea("");
        setSelectedBranchId("");
        setSelectedWarehouseId("");
    };

    const handleAreaChange = (
        value: string | null
    ) => {
        if (!value) {
            return;
        }

        setSelectedArea(value);
        setSelectedBranchId("");
    };

    const handleBranchChange = (
        value: string | null
    ) => {
        if (!value) {
            return;
        }

        setSelectedBranchId(value);
    };

    const handleWarehouseChange = (
        value: string | null
    ) => {
        if (!value) {
            return;
        }

        setSelectedWarehouseId(value);
    };

    const hasLocationSelected =
        locationType === "branch"
            ? Boolean(
                  selectedBranchId
              )
            : locationType ===
              "warehouse"
              ? Boolean(
                    selectedWarehouseId
                )
              : false;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Inventory
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    View and monitor current
                    inventory across all
                    branches and warehouses.
                </p>
            </div>

            {/* Filters */}
            <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {/* Location Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Location Type
                        </label>

                        <Select
                            value={
                                locationType
                            }
                            onValueChange={(
                                value
                            ) => {
                                handleLocationTypeChange(
                                    value
                                );
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue>
                                    {locationType === "branch"
                                        ? "Branch"
                                        : locationType === "warehouse"
                                          ? "Warehouse"
                                          : "Select location type"}
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="branch">
                                    Branch
                                </SelectItem>

                                <SelectItem value="warehouse">
                                    Warehouse
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Branch Filters */}
                    {locationType ===
                        "branch" && (
                        <>
                            {/* Area */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Area
                                </label>

                                <Select
                                    value={
                                        selectedArea
                                    }
                                    onValueChange={(
                                        value
                                    ) => {
                                        handleAreaChange(
                                            value
                                        );
                                    }}
                                    disabled={
                                        branchesLoading ||
                                        branches.length ===
                                            0
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue>
                                            {selectedArea
                                                ? selectedArea
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  selectedArea.slice(1)
                                                : branchesLoading
                                                  ? "Loading areas..."
                                                  : "Select area"}
                                        </SelectValue>
                                    </SelectTrigger>

                                    <SelectContent>
                                        {areas.map(
                                            (
                                                area
                                            ) => (
                                                <SelectItem
                                                    key={
                                                        area
                                                    }
                                                    value={
                                                        area
                                                    }
                                                >
                                                    {area
                                                        .charAt(
                                                            0
                                                        )
                                                        .toUpperCase() +
                                                        area.slice(
                                                            1
                                                        )}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Branch */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Branch
                                </label>

                                <Select
                                    value={
                                        selectedBranchId
                                    }
                                    onValueChange={(
                                        value
                                    ) => {
                                        handleBranchChange(
                                            value
                                        );
                                    }}
                                    disabled={
                                        !selectedArea ||
                                        filteredBranches.length ===
                                            0
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue>
                                            {selectedBranchId
                                                ? filteredBranches.find(
                                                      (branch) =>
                                                          String(branch.id) ===
                                                          selectedBranchId
                                                  )?.name || "Select branch"
                                                : "Select branch"}
                                        </SelectValue>
                                    </SelectTrigger>

                                    <SelectContent>
                                        {filteredBranches.map(
                                            (
                                                branch
                                            ) => (
                                                <SelectItem
                                                    key={
                                                        branch.id
                                                    }
                                                    value={String(
                                                        branch.id
                                                    )}
                                                >
                                                    {branch.name}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                    )}

                    {/* Warehouse Filter */}
                    {locationType ===
                        "warehouse" && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                Warehouse
                            </label>

                            <Select
                                value={
                                    selectedWarehouseId
                                }
                                onValueChange={(
                                    value
                                ) => {
                                    handleWarehouseChange(
                                        value
                                    );
                                }}
                                disabled={
                                    warehousesLoading ||
                                    warehouses.length ===
                                        0
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue>
                                        {selectedWarehouseId
                                            ? warehouses.find(
                                                  (warehouse) =>
                                                      String(warehouse.id) ===
                                                      selectedWarehouseId
                                              )?.name || "Select warehouse"
                                            : warehousesLoading
                                              ? "Loading warehouses..."
                                              : "Select warehouse"}
                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    {warehouses.map(
                                        (
                                            warehouse
                                        ) => (
                                            <SelectItem
                                                key={
                                                    warehouse.id
                                                }
                                                value={String(
                                                    warehouse.id
                                                )}
                                            >
                                                {
                                                    warehouse.name
                                                }
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>

                            
                        </div>
                        
                    )}

                    {/* Reset Filters */}
                    <div className="flex items-end justify-end xl:col-start-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                handleResetFilters
                            }
                            disabled={
                                !locationType &&
                                !selectedArea &&
                                !selectedBranchId &&
                                !selectedWarehouseId
                            }
                            className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 xl:w-auto"
                        >
                            <RotateCcw className="h-4 w-4" />
                        
                            Reset Filters
                        </Button>
                    </div>
                </div>                

                {/* Filter Errors */}
                {branchesError && (
                    <p
                        className="mt-3 text-sm text-red-600"
                        role="alert"
                    >
                        {branchesError}
                    </p>
                )}

                {warehousesError && (
                    <p
                        className="mt-3 text-sm text-red-600"
                        role="alert"
                    >
                        {warehousesError}
                    </p>
                )}
            </div>

            {/* Inventory */}
            {!locationType ? (
                <div className="rounded-lg border border-blue-100 bg-white px-6 py-12 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Select a location type
                        to view inventory.
                    </p>
                </div>
            ) : !hasLocationSelected ? (
                <div className="rounded-lg border border-blue-100 bg-white px-6 py-12 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Select a specific
                        location to view
                        inventory.
                    </p>
                </div>
            ) : loading ? (
                <div className="rounded-lg border border-blue-100 bg-white px-6 py-12 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Loading inventory...
                    </p>
                </div>
            ) : error ? (
                <div
                    className="rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center"
                    role="alert"
                >
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                </div>
            ) : (
                <InventoryTable
                    inventory={inventory}
                />
            )}
        </div>
    );
}