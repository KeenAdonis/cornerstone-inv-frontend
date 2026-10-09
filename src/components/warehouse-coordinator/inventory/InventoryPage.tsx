"use client";

import { useState } from "react";

import {
    Plus,
    SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { useInventory } from "@/src/hooks/inventory/useInventory";
import { useStockIns } from "@/src/hooks/inventory/useStockIns";
import { useStockAdjustments } from "@/src/hooks/inventory/useStockAdjustments";
import { useStockMovements } from "@/src/hooks/inventory/useStockMovements";

import InventoryTable from "@/src/components/inventory/InventoryTable";
import StockInTable from "@/src/components/inventory/StockInTable";
import StockAdjustmentTable from "@/src/components/inventory/StockAdjustmentTable";
import StockMovementTable from "@/src/components/inventory/StockMovementTable";

import StockInDialog from "@/src/components/inventory/StockInDialog";
import StockAdjustmentDialog from "@/src/components/inventory/StockAdjustmentDialog";
import ViewStockMovementDialog from "@/src/components/inventory/ViewStockMovementDialog";

import type {
    StockMovement,
} from "@/src/services/stockMovementService";

export default function InventoryPage() {
    const [stockInOpen, setStockInOpen] =
        useState(false);

    const [
        stockAdjustmentOpen,
        setStockAdjustmentOpen,
    ] = useState(false);

    const [
        selectedStockMovement,
        setSelectedStockMovement,
    ] = useState<StockMovement | null>(
        null
    );

    const {
        inventory,
        loading,
        error,
        refetch,
    } = useInventory();

    const {
        stockIns,
        loading: stockInsLoading,
        error: stockInsError,
        refetch: refetchStockIns,
    } = useStockIns();

    const {
        stockAdjustments,
        loading: stockAdjustmentsLoading,
        error: stockAdjustmentsError,
        refetch: refetchStockAdjustments,
    } = useStockAdjustments();

    const {
        stockMovements,
        loading: stockMovementsLoading,
        error: stockMovementsError,
        refetch: refetchStockMovements,
    } = useStockMovements();

    const handleStockInCreated =
        async () => {
            await Promise.all([
                refetch(),
                refetchStockIns(),
            ]);
        };

    const handleStockAdjustmentCreated =
        async () => {
            await Promise.all([
                refetch(),
                refetchStockAdjustments(),
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
                        View and monitor current inventory levels across
                        assigned locations.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
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

                    <Button
                        type="button"
                        onClick={() =>
                            setStockInOpen(true)
                        }
                        className="w-full rounded-sm bg-blue-600 text-white shadow-sm hover:bg-blue-700 sm:w-auto"
                    >
                        <Plus className="h-4 w-4" />

                        Stock In
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
                            className="h-7 rounded-none border-0 px-1 pb-3 pt-2 text-sm font-medium text-slate-500 shadow-none hover:text-slate-900 data-active:text-blue-700"
                        >
                            Current Inventory
                        </TabsTrigger>

                        <TabsTrigger
                            value="stock-in"
                            className="h-7 rounded-none border-0 px-1 pb-3 pt-2 text-sm font-medium text-slate-500 shadow-none hover:text-slate-900 data-active:text-blue-700"
                        >
                            Stock In History
                        </TabsTrigger>

                        <TabsTrigger
                            value="stock-adjustments"
                            className="h-7 rounded-none border-0 px-1 pb-3 pt-2 text-sm font-medium text-slate-500 shadow-none hover:text-slate-900 data-active:text-blue-700"
                        >
                            Stock Adjustment History
                        </TabsTrigger>

                        <TabsTrigger
                            value="stock-movements"
                            className="h-7 rounded-none border-0 px-1 pb-3 pt-2 text-sm font-medium text-slate-500 shadow-none hover:text-slate-900 data-active:text-blue-700"
                        >
                            Stock Movement History
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Current Inventory */}
                <TabsContent
                    value="inventory"
                    className="mt-6 outline-none"
                >
                    {loading ? (
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

                {/* Stock In History */}
                <TabsContent
                    value="stock-in"
                    className="mt-6 outline-none"
                >
                    {stockInsLoading ? (
                        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white px-6 py-12 text-center">
                            <p className="text-sm text-slate-500">
                                Loading stock-in history...
                            </p>
                        </div>
                    ) : stockInsError ? (
                        <div
                            className="rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center"
                            role="alert"
                        >
                            <p className="text-sm text-red-600">
                                {
                                    stockInsError
                                }
                            </p>
                        </div>
                    ) : (
                        <StockInTable
                            stockIns={
                                stockIns
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
            </Tabs>

            {/* Stock In Dialog */}
            <StockInDialog
                open={stockInOpen}
                onOpenChange={
                    setStockInOpen
                }
                onCreated={
                    handleStockInCreated
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

            {/* Stock Movement Details */}
            <ViewStockMovementDialog
                stockMovement={
                    selectedStockMovement
                }
                open={
                    selectedStockMovement !==
                    null
                }
                onOpenChange={(open) => {
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