"use client";

import { useEffect, useState } from "react";

import {
    ClipboardCheck,
    SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import {
    useActiveLocationContext,
} from "@/src/context/ActiveLocationContext";

import { useAuth } from "@/src/hooks/useAuth";

import { useInventory } from "@/src/hooks/inventory/useInventory";
import { useInventoryCount } from "@/src/hooks/inventory/useInventoryCount";
import { useStockAdjustments } from "@/src/hooks/inventory/useStockAdjustments";
import { useStockMovements } from "@/src/hooks/inventory/useStockMovements";

import InventoryTable from "@/src/components/inventory/InventoryTable";
import InventoryCountTable from "@/src/components/inventory/InventoryCountTable";
import StockAdjustmentTable from "@/src/components/inventory/StockAdjustmentTable";
import StockMovementTable from "@/src/components/inventory/StockMovementTable";

import InventoryCountDialog from "@/src/components/inventory/InventoryCountDialog";
import StockAdjustmentDialog from "@/src/components/inventory/StockAdjustmentDialog";
import ViewInventoryCountDialog from "@/src/components/inventory/ViewInventoryCountDialog";
import ViewStockMovementDialog from "@/src/components/inventory/ViewStockMovementDialog";

import type {
    InventoryCount,
} from "@/src/services/inventoryCountService";

import type {
    StockMovement,
} from "@/src/services/stockMovementService";

export default function InventoryPage() {
    const [
        stockAdjustmentOpen,
        setStockAdjustmentOpen,
    ] = useState(false);

    const [
        inventoryCountOpen,
        setInventoryCountOpen,
    ] = useState(false);

    const [
        selectedStockMovement,
        setSelectedStockMovement,
    ] = useState<StockMovement | null>(
        null
    );

    const [
        selectedInventoryCount,
        setSelectedInventoryCount,
    ] = useState<InventoryCount | null>(
        null
    );

    const { user } = useAuth();

    const {
        activeLocation,
        initialized: locationInitialized,
    } = useActiveLocationContext();

    const isBranchCoordinator =
        user?.role ===
        "branch_coordinator";

    const activeBranchId =
        isBranchCoordinator &&
        locationInitialized &&
        activeLocation?.type === "branch"
            ? activeLocation.id
            : undefined;

    const {
        inventory,
        loading,
        error,
        refetch,
    } = useInventory(
        isBranchCoordinator &&
            locationInitialized &&
            activeBranchId
            ? {
                  branchId:
                      activeBranchId,
              }
            : undefined,
        {
            enabled:
                !!user &&
                (
                    !isBranchCoordinator ||
                    locationInitialized
                ),
        }
    );

    const {
        inventoryCounts,
        loading:
            inventoryCountsLoading,
        error:
            inventoryCountsError,
        fetchInventoryCounts,
    } = useInventoryCount();

    const {
        stockAdjustments,
        loading: stockAdjustmentsLoading,
        error: stockAdjustmentsError,
        refetch: refetchStockAdjustments,
    } = useStockAdjustments(
        isBranchCoordinator &&
            locationInitialized &&
            activeBranchId
            ? {
                  branchId:
                      activeBranchId,
              }
            : undefined,
        {
            enabled:
                !!user &&
                (
                    !isBranchCoordinator ||
                    locationInitialized
                ),
        }
    );

    const {
        stockMovements,
        loading: stockMovementsLoading,
        error: stockMovementsError,
    } = useStockMovements(
        isBranchCoordinator &&
            locationInitialized &&
            activeBranchId
            ? {
                  branchId:
                      activeBranchId,
              }
            : undefined,
        {
            enabled:
                !!user &&
                (
                    !isBranchCoordinator ||
                    locationInitialized
                ),
        }
    );

    useEffect(() => {
        if (
            !isBranchCoordinator ||
            !locationInitialized ||
            !activeBranchId
        ) {
            return;
        }

        fetchInventoryCounts(
            activeBranchId
        );
    }, [
        isBranchCoordinator,
        locationInitialized,
        activeBranchId,
        fetchInventoryCounts,
    ]);

    const handleStockAdjustmentCreated =
        async () => {
            await Promise.all([
                refetch(),
                refetchStockAdjustments(),
            ]);
        };

    const handleInventoryCountCreated =
        async () => {
            await Promise.all([
                refetch(),
                fetchInventoryCounts(
                    activeBranchId
                ),
            ]);
        };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Inventory
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        View and monitor the current inventory levels of your branch.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            setInventoryCountOpen(
                                true
                            )
                        }
                        className="w-full rounded-sm border-blue-200 bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 sm:w-auto"
                    >
                        <ClipboardCheck className="h-4 w-4" />

                        Inventory Count
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            setStockAdjustmentOpen(
                                true
                            )
                        }
                        className="w-full rounded-sm border-blue-200 bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 sm:w-auto"
                    >
                        <SlidersHorizontal className="h-4 w-4" />

                        Stock Adjustment
                    </Button>
                </div>
            </div>

            {/* Inventory Tabs */}
            <Tabs
                defaultValue="inventory"
                className="w-full"
            >
                <div className="border-b border-slate-200">
                    <TabsList
                        variant="line"
                        className="h-11 w-full justify-start gap-6 overflow-x-auto overflow-y-hidden rounded-none bg-transparent p-0 sm:w-fit"
                    >
                        <TabsTrigger
                            value="inventory"
                            className="h-7 shrink-0 rounded-none border-0 px-1 pb-3 pt-2 text-sm font-medium text-slate-500 shadow-none hover:text-slate-900 data-active:text-blue-700"
                        >
                            Current Inventory
                        </TabsTrigger>

                        <TabsTrigger
                            value="stock-adjustments"
                            className="h-7 shrink-0 rounded-none border-0 px-1 pb-3 pt-2 text-sm font-medium text-slate-500 shadow-none hover:text-slate-900 data-active:text-blue-700"
                        >
                            Stock Adjustment History
                        </TabsTrigger>

                        <TabsTrigger
                            value="stock-movements"
                            className="h-7 shrink-0 rounded-none border-0 px-1 pb-3 pt-2 text-sm font-medium text-slate-500 shadow-none hover:text-slate-900 data-active:text-blue-700"
                        >
                            Stock Movement History
                        </TabsTrigger>

                        <TabsTrigger
                            value="inventory-counts"
                            className="h-7 shrink-0 rounded-none border-0 px-1 pb-3 pt-2 text-sm font-medium text-slate-500 shadow-none hover:text-slate-900 data-active:text-blue-700"
                        >
                            Inventory Count History
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Current Inventory */}
                <TabsContent
                    value="inventory"
                    className="mt-6 outline-none"
                >
                    {!locationInitialized &&
                    isBranchCoordinator ? (
                        <div className="rounded-lg border border-blue-100 bg-white px-6 py-12 text-center shadow-sm">
                            <p className="text-sm text-slate-500">
                                Loading active branch...
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
                            inventory={
                                inventory
                            }
                        />
                    )}
                </TabsContent>

                {/* Stock Adjustment History */}
                <TabsContent
                    value="stock-adjustments"
                    className="mt-6 outline-none"
                >
                    {stockAdjustmentsLoading ? (
                        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white px-6 py-12 text-center">
                            <p className="text-sm text-slate-500">
                                Loading stock adjustment history...
                            </p>
                        </div>
                    ) : stockAdjustmentsError ? (
                        <div
                            className="rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center"
                            role="alert"
                        >
                            <p className="text-sm text-red-600">
                                {
                                    stockAdjustmentsError
                                }
                            </p>
                        </div>
                    ) : (
                        <StockAdjustmentTable
                            stockAdjustments={
                                stockAdjustments
                            }
                        />
                    )}
                </TabsContent>

                {/* Stock Movement History */}
                <TabsContent
                    value="stock-movements"
                    className="mt-6 outline-none"
                >
                    {stockMovementsLoading ? (
                        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white px-6 py-12 text-center">
                            <p className="text-sm text-slate-500">
                                Loading stock movement history...
                            </p>
                        </div>
                    ) : stockMovementsError ? (
                        <div
                            className="rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center"
                            role="alert"
                        >
                            <p className="text-sm text-red-600">
                                {
                                    stockMovementsError
                                }
                            </p>
                        </div>
                    ) : (
                        <StockMovementTable
                            stockMovements={
                                stockMovements
                            }
                            onView={
                                setSelectedStockMovement
                            }
                        />
                    )}
                </TabsContent>

                {/* Inventory Count History */}
                <TabsContent
                    value="inventory-counts"
                    className="mt-6 outline-none"
                >
                    {!locationInitialized &&
                    isBranchCoordinator ? (
                        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white px-6 py-12 text-center">
                            <p className="text-sm text-slate-500">
                                Loading active branch...
                            </p>
                        </div>
                    ) : inventoryCountsLoading ? (
                        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white px-6 py-12 text-center">
                            <p className="text-sm text-slate-500">
                                Loading inventory count history...
                            </p>
                        </div>
                    ) : inventoryCountsError ? (
                        <div
                            className="rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center"
                            role="alert"
                        >
                            <p className="text-sm text-red-600">
                                {
                                    inventoryCountsError
                                }
                            </p>
                        </div>
                    ) : (
                        <InventoryCountTable
                            inventoryCounts={
                                inventoryCounts
                            }
                            onView={
                                setSelectedInventoryCount
                            }
                        />
                    )}
                </TabsContent>
            </Tabs>

            {/* Inventory Count Dialog */}
            <InventoryCountDialog
                open={
                    inventoryCountOpen
                }
                onOpenChange={
                    setInventoryCountOpen
                }
                onCreated={
                    handleInventoryCountCreated
                }
            />

            {/* Stock Adjustment Dialog */}
            <StockAdjustmentDialog
                open={
                    stockAdjustmentOpen
                }
                onOpenChange={
                    setStockAdjustmentOpen
                }
                onCreated={
                    handleStockAdjustmentCreated
                }
            />

            {/* Inventory Count Details */}
            <ViewInventoryCountDialog
                inventoryCount={
                    selectedInventoryCount
                }
                open={
                    selectedInventoryCount !==
                    null
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setSelectedInventoryCount(
                            null
                        );
                    }
                }}
            />

            {/* Stock Movement Details */}
            <ViewStockMovementDialog
                stockMovement={
                    selectedStockMovement
                }
                open={
                    selectedStockMovement !==
                    null
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setSelectedStockMovement(
                            null
                        );
                    }
                }}
            />
        </div>
    );
}