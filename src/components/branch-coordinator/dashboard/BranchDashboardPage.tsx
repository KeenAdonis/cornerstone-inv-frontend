"use client";

import Link from "next/link";

import {
    AlertTriangle,
    ArrowDownToLine,
    ClipboardList,
    Package,
    Send,
} from "lucide-react";

import { useAuth } from "@/src/hooks/useAuth";

import { useInventory } from "@/src/hooks/inventory/useInventory";

import { usePurchaseOrders } from "@/src/hooks/purchase-orders/usePurchaseOrders";

import { useActiveLocationContext } from "@/src/context/ActiveLocationContext";

import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";


export default function BranchDashboardPage() {

    const {
        user,
        loading,
    } = useAuth();

    const {
        activeLocation,
        initialized,
    } = useActiveLocationContext();

    const activeBranchId =
        activeLocation?.type === "branch"
            ? activeLocation.id
            : undefined;

    const {
        inventory,
        loading: inventoryLoading,
    } = useInventory(
        {
            locationType: "branch",
            branchId: activeBranchId,
        },
        {
            enabled:
                initialized &&
                activeBranchId !== undefined,
        }
    );

    const {
        purchaseOrders,
        loading: purchaseOrdersLoading,
    } = usePurchaseOrders();

    const pendingRequests =
        purchaseOrders.filter(
            (purchaseOrder) =>
                purchaseOrder.status === "pending"
        ).length;

    const processingRequests =
        purchaseOrders.filter(
            (purchaseOrder) =>
                purchaseOrder.status === "preparing"
        ).length;

    const incomingRequests =
        purchaseOrders.filter(
            (purchaseOrder) =>
                purchaseOrder.status ===
                    "out_for_delivery"
        ).length;

    if (loading) {
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

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <DashboardHeader user={user} />

            {/* Dashboard Statistics */}
            <DashboardStats
                inventory={inventory}
                loading={inventoryLoading}
            />

            {/* Inventory + Requests */}
            <div className="grid gap-6 xl:grid-cols-2">
                <section className="rounded-xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
                    <div className="border-b border-blue-50 px-5 py-4">
                        <h2 className="text-base font-semibold text-slate-900">
                            Branch Inventory
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Current inventory status for your
                            assigned branch.
                        </p>
                    </div>

                    <div className="grid gap-4 p-5 sm:grid-cols-3">
                        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                                Available
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {inventoryLoading
                                    ? "—"
                                    : inventory.filter(
                                          (item) =>
                                              Number(
                                                  item.quantity
                                              ) > 0
                                      ).length}
                            </p>
                                  
                            <p className="mt-1 text-xs text-slate-500">
                                Products with available stock
                            </p>
                        </div>
                                  
                        <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
                                Low Stock
                            </p>
                                  
                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {inventoryLoading
                                    ? "—"
                                    : inventory.filter(
                                          (item) => {
                                              const quantity =
                                                  Number(
                                                      item.quantity
                                                  );
                                              
                                              return (
                                                  quantity > 0 &&
                                                  quantity <= 10
                                              );
                                          }
                                      ).length}
                            </p>
                                  
                            <p className="mt-1 text-xs text-slate-500">
                                Needs replenishment
                            </p>
                        </div>
                                  
                        <div className="rounded-lg border border-red-100 bg-red-50/50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-red-600">
                                Out of Stock
                            </p>
                                  
                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                {inventoryLoading
                                    ? "—"
                                    : inventory.filter(
                                          (item) =>
                                              Number(
                                                  item.quantity
                                              ) <= 0
                                      ).length}
                            </p>
                                  
                            <p className="mt-1 text-xs text-slate-500">
                                Currently unavailable
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
                    <div className="border-b border-blue-50 px-5 py-4">
                        <h2 className="text-base font-semibold text-slate-900">
                            Request Status
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Overview of your branch stock requests.
                        </p>
                    </div>

                    <div className="space-y-3 p-5">
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                    <ClipboardList className="h-4 w-4" />
                                </span>

                                <div>
                                    <p className="text-sm font-medium text-slate-800">
                                        Pending
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Awaiting warehouse action
                                    </p>
                                </div>
                            </div>

                            <span className="text-lg font-semibold text-slate-900">
                                {purchaseOrdersLoading
                                    ? "—"
                                    : pendingRequests}
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <Send className="h-4 w-4" />
                                </span>

                                <div>
                                    <p className="text-sm font-medium text-slate-800">
                                        Processing
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Currently being prepared
                                    </p>
                                </div>
                            </div>

                            <span className="text-lg font-semibold text-slate-900">
                                {purchaseOrdersLoading
                                    ? "—"
                                    : processingRequests}
                            </span>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    <ArrowDownToLine className="h-4 w-4" />
                                </span>

                                <div>
                                    <p className="text-sm font-medium text-slate-800">
                                        Ready / Incoming
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Stock ready for receiving
                                    </p>
                                </div>
                            </div>

                            <span className="text-lg font-semibold text-slate-900">
                                {purchaseOrdersLoading
                                    ? "—"
                                    : incomingRequests}
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Quick Actions */}
            <section className="rounded-xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
                <div className="border-b border-blue-50 px-5 py-4">
                    <h2 className="text-base font-semibold text-slate-900">
                        Quick Actions
                    </h2>
                                            
                    <p className="mt-1 text-sm text-slate-500">
                        Common branch inventory operations.
                    </p>
                </div>
                                            
                <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Link
                        href="/branch-coordinator/inventory"
                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/50"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Package className="h-4 w-4" />
                        </span>
                                            
                        <span>
                            <span className="block text-sm font-medium text-slate-800">
                                View Inventory
                            </span>
                                            
                            <span className="block text-xs text-slate-500">
                                Check current branch stock
                            </span>
                        </span>
                    </Link>
                                            
                    <Link
                        href="/branch-coordinator/purchase-orders"
                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/50"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                            <ClipboardList className="h-4 w-4" />
                        </span>
                                            
                        <span>
                            <span className="block text-sm font-medium text-slate-800">
                                Request Stock
                            </span>
                                            
                            <span className="block text-xs text-slate-500">
                                Create or manage a stock request
                            </span>
                        </span>
                    </Link>
                                            
                    <Link
                        href="/branch-coordinator/purchase-orders"
                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/50"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                            <ArrowDownToLine className="h-4 w-4" />
                        </span>
                                            
                        <span>
                            <span className="block text-sm font-medium text-slate-800">
                                Incoming Deliveries
                            </span>
                                            
                            <span className="block text-xs text-slate-500">
                                View stock currently being delivered
                            </span>
                        </span>
                    </Link>
                </div>
            </section>
        </div>
    );
}