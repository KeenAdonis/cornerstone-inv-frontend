"use client";

import { useAuth } from "@/src/hooks/useAuth";

import { useProducts } from "@/src/hooks/products/useProducts";
import { useInventory } from "@/src/hooks/inventory/useInventory";
import { useBranches } from "@/src/hooks/branches/useBranches";
import { useWarehouses } from "@/src/hooks/warehouse/useWarehouses";

import AdminDashboardHeader from "./AdminDashboardHeader";
import AdminInventoryAnalytics from "./AdminInventoryAnalytics";
import AdminDashboardAnalytics from "./AdminDashboardAnalytics";
import AdminProductDemandRanking from "./AdminProductDemandRanking";

import { useProductRankings } from "@/src/hooks/product-rankings/useProductRankings";
import { usePurchaseOrders } from "@/src/hooks/purchase-orders/usePurchaseOrders";

export default function AdminDashboardPage() {
    const {
        user,
        loading: authLoading,
    } = useAuth();

    const {
        products,
        loading: productsLoading,
    } = useProducts();

    const {
        inventory,
        loading: inventoryLoading,
    } = useInventory();

    const {
        branches,
        loading: branchesLoading,
    } = useBranches();

    const {
        warehouses,
        loading: warehousesLoading,
    } = useWarehouses();

    const {
        purchaseOrders,
        loading: purchaseOrdersLoading,
    } = usePurchaseOrders();

    const {
        rankings,
        loading: rankingsLoading,
    } = useProductRankings();

    const loading =
        authLoading ||
        productsLoading ||
        inventoryLoading ||
        branchesLoading ||
        warehousesLoading ||
        purchaseOrdersLoading;

    if (authLoading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-sm text-slate-400">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const activeProducts =
        products.filter(
            (product) =>
                product.status === "active"
        ).length;

    const inactiveProducts =
        products.filter(
            (product) =>
                product.status === "inactive"
        ).length;

    const totalStock =
        inventory.reduce(
            (total, item) =>
                total +
                Number(item.quantity || 0),
            0
        );

    const lowStockCount =
        inventory.filter((item) => {
            const quantity =
                Number(item.quantity || 0);

            const reorderLevel =
                Number(
                    item.reorder_level || 0
                );

            return (
                quantity > 0 &&
                quantity <= reorderLevel
            );
        }).length;

    const outOfStockCount =
        inventory.filter(
            (item) =>
                Number(item.quantity || 0) <= 0
        ).length;

    const pendingPurchaseOrders =
        purchaseOrders.filter(
            (purchaseOrder) =>
                purchaseOrder.status === "pending"
        ).length;

    const approvedPurchaseOrders =
        purchaseOrders.filter(
            (purchaseOrder) =>
                purchaseOrder.status === "approved"
        ).length;

    const preparingPurchaseOrders =
        purchaseOrders.filter(
            (purchaseOrder) =>
                purchaseOrder.status === "preparing"
        ).length;

    const outForDeliveryPurchaseOrders =
        purchaseOrders.filter(
            (purchaseOrder) =>
                purchaseOrder.status ===
                "out_for_delivery"
        ).length;

    const deliveredPurchaseOrders =
        purchaseOrders.filter(
            (purchaseOrder) =>
                purchaseOrder.status === "delivered"
        ).length;

    const completedPurchaseOrders =
        purchaseOrders.filter(
            (purchaseOrder) =>
                purchaseOrder.status === "completed"
        ).length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <AdminDashboardHeader
                user={user}
            />

            {/* Temporary dashboard data check */}
            <section className="rounded-xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
                <div className="border-b border-blue-50 px-5 py-4">
                    <h2 className="text-base font-semibold text-slate-900">
                        System Overview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Current system-wide inventory
                        and master data overview.
                    </p>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <div className="rounded-lg border border-slate-200 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Products
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : products.length}
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                            Active Products
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : activeProducts}
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Inactive Products
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : inactiveProducts}
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                            Branches
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : branches.length}
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                            Warehouses
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : warehouses.length}
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                            Total Stock
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : totalStock.toLocaleString(
                                      "en-PH",
                                      {
                                          maximumFractionDigits: 2,
                                      }
                                  )}
                        </p>
                    </div>
                </div>
            </section>

            {/* Inventory Status */}
            <section className="rounded-xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
                <div className="border-b border-blue-50 px-5 py-4">
                    <h2 className="text-base font-semibold text-slate-900">
                        Inventory Status
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        System-wide inventory availability.
                    </p>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-3">
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                            Available Stock
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : inventory.filter(
                                      (item) =>
                                          Number(
                                              item.quantity
                                          ) > 0
                                  ).length}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Inventory records with available stock
                        </p>
                    </div>

                    <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
                            Low Stock
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : lowStockCount}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Inventory records at or below reorder level
                        </p>
                    </div>

                    <div className="rounded-lg border border-red-100 bg-red-50/50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-red-600">
                            Out of Stock
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : outOfStockCount}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Inventory records with no available stock
                        </p>
                    </div>
                </div>
            </section>

            {/* Purchase Order Overview */}
            <section className="rounded-xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
                <div className="border-b border-blue-50 px-5 py-4">
                    <h2 className="text-base font-semibold text-slate-900">
                        Purchase Order Overview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Current purchase order workflow across the system.
                    </p>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
                            Pending
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : pendingPurchaseOrders}
                        </p>
                            
                        <p className="mt-1 text-xs text-slate-500">
                            Awaiting admin review
                        </p>
                    </div>
                            
                    <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                            Approved
                        </p>
                            
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : approvedPurchaseOrders}
                        </p>
                            
                        <p className="mt-1 text-xs text-slate-500">
                            Approved requests
                        </p>
                    </div>
                            
                    <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-orange-600">
                            Preparing
                        </p>
                            
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : preparingPurchaseOrders}
                        </p>
                            
                        <p className="mt-1 text-xs text-slate-500">
                            Being prepared by warehouse
                        </p>
                    </div>
                            
                    <div className="rounded-lg border border-pink-100 bg-pink-50/50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-pink-600">
                            Out for Delivery
                        </p>
                            
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : outForDeliveryPurchaseOrders}
                        </p>
                            
                        <p className="mt-1 text-xs text-slate-500">
                            Currently in transit
                        </p>
                    </div>
                            
                    <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-purple-600">
                            Delivered
                        </p>
                            
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : deliveredPurchaseOrders}
                        </p>
                            
                        <p className="mt-1 text-xs text-slate-500">
                            Awaiting completion
                        </p>
                    </div>
                            
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                            Completed
                        </p>
                            
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {loading
                                ? "—"
                                : completedPurchaseOrders}
                        </p>
                            
                        <p className="mt-1 text-xs text-slate-500">
                            Completed purchase orders
                        </p>
                    </div>
                </div>
            </section>

            {/* Inventory Analytics */}
            <AdminInventoryAnalytics
                inventory={inventory}
                loading={loading}
            />

            {/* Inventory Analytics */}
            <AdminDashboardAnalytics
                inventory={inventory}
                loading={loading}
            />

            {/* Product Demand Ranking */}
<AdminProductDemandRanking
    rankings={rankings}
    loading={rankingsLoading}
/>
        </div>
    );
}