"use client";

import {
    ArrowRight,
    Clock3,
    Package,
    Truck,
    Warehouse,
} from "lucide-react";
import type { PurchaseOrder } from "@/src/services/purchaseOrderService";

interface WarehouseDashboardAttentionProps {
    purchaseOrders: PurchaseOrder[];
    onViewAll?: () => void;
}

function getStatusLabel(
    status: PurchaseOrder["status"]
) {
    switch (status) {
        case "approved":
            return "Approved";

        case "preparing":
            return "Preparing";

        case "out_for_delivery":
            return "Out for Delivery";

        default:
            return status;
    }
}

function getStatusClassName(
    status: PurchaseOrder["status"]
) {
    switch (status) {
        case "approved":
            return "bg-blue-50 text-blue-700 border-blue-100";

        case "preparing":
            return "bg-violet-50 text-violet-700 border-violet-100";

        case "out_for_delivery":
            return "bg-orange-50 text-orange-700 border-orange-100";

        default:
            return "bg-slate-50 text-slate-600 border-slate-100";
    }
}

function getStatusIcon(
    status: PurchaseOrder["status"]
) {
    switch (status) {
        case "approved":
            return Warehouse;

        case "preparing":
            return Package;

        case "out_for_delivery":
            return Truck;

        default:
            return Clock3;
    }
}

function formatDate(date: string | null) {
    if (!date) {
        return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
}

export default function WarehouseDashboardAttention({
    purchaseOrders,
    onViewAll,
}: WarehouseDashboardAttentionProps) {
    return (
        <section className="mt-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        Purchase Orders Requiring Attention
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Orders currently moving through the
                        warehouse fulfillment process.
                    </p>
                </div>

                {onViewAll && (
                    <button
                        type="button"
                        onClick={onViewAll}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                    >
                        View all
                        <ArrowRight className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
                {purchaseOrders.length === 0 ? (
                    <div className="flex min-h-[180px] flex-col items-center justify-center px-6 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50">
                            <Package className="h-5 w-5 text-slate-400" />
                        </div>

                        <p className="mt-3 text-sm font-medium text-slate-700">
                            No purchase orders require attention
                        </p>

                        <p className="mt-1 max-w-md text-xs text-slate-400">
                            Purchase orders that are approved,
                            being prepared, or out for delivery
                            will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {purchaseOrders.map(
                            (purchaseOrder) => {
                                const StatusIcon =
                                    getStatusIcon(
                                        purchaseOrder.status
                                    );

                                return (
                                    <div
                                        key={
                                            purchaseOrder.id
                                        }
                                        className="flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50/70 lg:flex-row lg:items-center lg:justify-between"
                                    >
                                        {/* PO Information */}
                                        <div className="flex min-w-0 items-start gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                                <StatusIcon className="h-5 w-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        {
                                                            purchaseOrder.reference_number
                                                        }
                                                    </p>

                                                    <span
                                                        className={[
                                                            "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
                                                            getStatusClassName(
                                                                purchaseOrder.status
                                                            ),
                                                        ].join(
                                                            " "
                                                        )}
                                                    >
                                                        {getStatusLabel(
                                                            purchaseOrder.status
                                                        )}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {purchaseOrder
                                                        .branch
                                                        ?.name ??
                                                        "Branch not specified"}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Requested{" "}
                                                    {formatDate(
                                                        purchaseOrder.requested_at ??
                                                            purchaseOrder.created_at
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Items / Delivery */}
                                        <div className="flex flex-wrap items-center gap-5 lg:justify-end">
                                            <div>
                                                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                    Items
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-slate-700">
                                                    {
                                                        purchaseOrder
                                                            .items
                                                            ?.length ??
                                                        0
                                                    }
                                                </p>
                                            </div>

                                            {purchaseOrder.delivery_type && (
                                                <div>
                                                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                        Delivery
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium capitalize text-slate-700">
                                                        {purchaseOrder.delivery_type.replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}