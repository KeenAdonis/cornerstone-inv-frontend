"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { AlertTriangle } from "lucide-react";

import { useAuth } from "@/src/hooks/useAuth";
import { useActiveLocationContext } from "@/src/context/ActiveLocationContext";

import {
    getInventory,
    type Inventory,
} from "@/src/services/inventoryService";

import {
    getPurchaseOrders,
    type PurchaseOrder,
} from "@/src/services/purchaseOrderService";

import {
    getStockMovements,
    type StockMovement,
} from "@/src/services/stockMovementService";

import WarehouseDashboardHeader from "./WarehouseDashboardHeader";

import WarehouseDashboardSummary, {
    type WarehouseDashboardStats,
} from "./WarehouseDashboardSummary";

import WarehouseDashboardWorkflow from "./WarehouseDashboardWorkflow";

import WarehouseDashboardAttention from "./WarehouseDashboardAttention";

import WarehouseDashboardInventoryStatus from "./WarehouseDashboardInventoryStatus";

import WarehouseDashboardActivity from "./WarehouseDashboardActivity";

export default function WarehouseDashboardPage() {
    const { user, loading: authLoading } =
        useAuth();

    const {
        activeLocation,
        initialized: locationInitialized,
    } = useActiveLocationContext();

    const [inventory, setInventory] = useState<
        Inventory[]
    >([]);

    const [purchaseOrders, setPurchaseOrders] =
        useState<PurchaseOrder[]>([]);

    const [stockMovements, setStockMovements] =
        useState<StockMovement[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isRefreshing, setIsRefreshing] =
        useState(false);

    const [error, setError] = useState<
        string | null
    >(null);

    /**
     * Load all dashboard data
     * for the currently active warehouse.
     */
    const loadDashboard = useCallback(
        async (refresh = false) => {
            if (
                !locationInitialized ||
                !activeLocation ||
                activeLocation.type !==
                    "warehouse"
            ) {
                return;
            }

            try {
                if (refresh) {
                    setIsRefreshing(true);
                } else {
                    setIsLoading(true);
                }

                setError(null);

                const warehouseId =
                    activeLocation.id;

                const [
                    inventoryData,
                    purchaseOrderData,
                    stockMovementData,
                ] = await Promise.all([
                    getInventory({
                        locationType:
                            "warehouse",
                        warehouseId,
                    }),

                    getPurchaseOrders({
                        warehouseId,
                    }),

                    getStockMovements({
                        warehouseId,
                    }),
                ]);

                setInventory(
                    inventoryData
                );

                setPurchaseOrders(
                    purchaseOrderData
                );

                setStockMovements(
                    stockMovementData
                );
            } catch (err) {
                console.error(
                    "Failed to load warehouse dashboard:",
                    err
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load warehouse dashboard."
                );
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [
            activeLocation,
            locationInitialized,
        ]
    );

    /**
     * Load dashboard when the active
     * warehouse becomes available or changes.
     */
    useEffect(() => {
        if (
            authLoading ||
            !locationInitialized
        ) {
            return;
        }

        if (
            !activeLocation ||
            activeLocation.type !==
                "warehouse"
        ) {
            setIsLoading(false);
            return;
        }

        loadDashboard();
    }, [
        authLoading,
        locationInitialized,
        activeLocation,
        loadDashboard,
    ]);

    /**
     * Inventory statistics
     */
    const inventoryStats = useMemo(() => {
        let inStock = 0;
        let lowStock = 0;
        let outOfStock = 0;

        inventory.forEach((item) => {
            const quantity = Number(
                item.quantity ?? 0
            );

            const reorderLevel = Number(
                item.reorder_level ?? 0
            );

            if (quantity <= 0) {
                outOfStock++;
                return;
            }

            if (quantity <= reorderLevel) {
                lowStock++;
                return;
            }

            inStock++;
        });

        return {
            inStock,
            lowStock,
            outOfStock,
        };
    }, [inventory]);

    /**
     * Purchase order statistics
     */
    const stats: WarehouseDashboardStats =
        useMemo(
            () => ({
                totalProducts:
                    inventory.length,

                lowStock:
                    inventoryStats.lowStock,

                outOfStock:
                    inventoryStats.outOfStock,

                pendingRequests:
                    purchaseOrders.filter(
                        (purchaseOrder) =>
                            purchaseOrder.status ===
                            "pending"
                    ).length,

                approvedRequests:
                    purchaseOrders.filter(
                        (purchaseOrder) =>
                            purchaseOrder.status ===
                            "approved"
                    ).length,

                preparing:
                    purchaseOrders.filter(
                        (purchaseOrder) =>
                            purchaseOrder.status ===
                            "preparing"
                    ).length,

                outForDelivery:
                    purchaseOrders.filter(
                        (purchaseOrder) =>
                            purchaseOrder.status ===
                            "out_for_delivery"
                    ).length,

                delivered:
                    purchaseOrders.filter(
                        (purchaseOrder) =>
                            purchaseOrder.status ===
                            "delivered"
                    ).length,

                completed:
                    purchaseOrders.filter(
                        (purchaseOrder) =>
                            purchaseOrder.status ===
                            "completed"
                    ).length,
            }),
            [
                inventory.length,
                inventoryStats.lowStock,
                inventoryStats.outOfStock,
                purchaseOrders,
            ]
        );

    /**
     * Purchase orders currently requiring attention.
     */
    const attentionPurchaseOrders =
        useMemo(() => {
            return purchaseOrders
                .filter((purchaseOrder) =>
                    [
                        "approved",
                        "preparing",
                        "out_for_delivery",
                    ].includes(
                        purchaseOrder.status
                    )
                )
                .sort(
                    (a, b) =>
                        new Date(
                            b.updated_at
                        ).getTime() -
                        new Date(
                            a.updated_at
                        ).getTime()
                )
                .slice(0, 5);
        }, [purchaseOrders]);

    /**
     * Latest stock movements.
     */
    const recentMovements = useMemo(() => {
        return [...stockMovements]
            .sort(
                (a, b) =>
                    new Date(
                        b.moved_at
                    ).getTime() -
                    new Date(
                        a.moved_at
                    ).getTime()
            )
            .slice(0, 5);
    }, [stockMovements]);

    /**
     * Refresh dashboard.
     */
    const handleRefresh = () => {
        loadDashboard(true);
    };

    /**
     * Purchase-order navigation.
     *
     * Keep this isolated here so the
     * presentation component stays reusable.
     */
    const handleViewAllPurchaseOrders =
        () => {
            window.location.href =
                "/warehouse-coordinator/purchase-orders";
        };

    /**
     * Authentication / location initialization.
     */
    if (
        authLoading ||
        !locationInitialized
    ) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-4 w-40 rounded bg-slate-200" />

                    <div className="mt-3 h-8 w-72 rounded bg-slate-200" />

                    <div className="mt-2 h-4 w-96 max-w-full rounded bg-slate-100" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({
                        length: 4,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className="h-32 animate-pulse rounded-xl border border-slate-100 bg-white"
                        />
                    ))}
                </div>
            </div>
        );
    }

    /**
     * The dashboard requires an active warehouse.
     */
    if (
        !activeLocation ||
        activeLocation.type !==
            "warehouse"
    ) {
        return (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <AlertTriangle className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-amber-800">
                            No active warehouse selected
                        </h2>

                        <p className="mt-1 text-sm text-amber-700">
                            Please select or assign a warehouse
                            before viewing the warehouse dashboard.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * API loading error.
     */
    if (error) {
        return (
            <div className="space-y-6">
                <WarehouseDashboardHeader
                    userName={user?.name}
                    isRefreshing={
                        isRefreshing
                    }
                    onRefresh={
                        handleRefresh
                    }
                />

                <div className="rounded-xl border border-red-100 bg-red-50 p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-red-800">
                                Unable to load warehouse dashboard
                            </h2>

                            <p className="mt-1 text-sm text-red-600">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={
                                    handleRefresh
                                }
                                className="mt-3 text-sm font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-0">
            {/* Header */}
            <WarehouseDashboardHeader
                userName={user?.name}
                isRefreshing={
                    isRefreshing
                }
                onRefresh={
                    handleRefresh
                }
            />

            {/* Summary */}
            <WarehouseDashboardSummary
                stats={stats}
            />

            {/* Purchase Order Workflow */}
            <WarehouseDashboardWorkflow
                pending={
                    stats.pendingRequests
                }
                approved={
                    stats.approvedRequests
                }
                preparing={
                    stats.preparing
                }
                outForDelivery={
                    stats.outForDelivery
                }
                delivered={
                    stats.delivered
                }
                completed={
                    stats.completed
                }
            />

            {/* Purchase Orders Requiring Attention */}
            <WarehouseDashboardAttention
                purchaseOrders={
                    attentionPurchaseOrders
                }
                onViewAll={
                    handleViewAllPurchaseOrders
                }
            />

            {/* Inventory Health */}
            <WarehouseDashboardInventoryStatus
                inStock={
                    inventoryStats.inStock
                }
                lowStock={
                    inventoryStats.lowStock
                }
                outOfStock={
                    inventoryStats.outOfStock
                }
            />

            {/* Recent Activity */}
            <WarehouseDashboardActivity
                movements={
                    recentMovements
                }
            />
        </div>
    );
}