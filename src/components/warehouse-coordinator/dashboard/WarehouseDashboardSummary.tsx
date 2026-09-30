"use client";

import {
    AlertTriangle,
    ClipboardList,
    Package,
    ShoppingCart,
} from "lucide-react";

export interface WarehouseDashboardStats {
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
    pendingRequests: number;
    approvedRequests: number;
    preparing: number;
    outForDelivery: number;
    delivered: number;
    completed: number;
}

interface WarehouseDashboardSummaryProps {
    stats: WarehouseDashboardStats;
}

interface SummaryCard {
    label: string;
    value: number;
    description: string;
    icon: typeof Package;
    iconClassName: string;
    valueClassName?: string;
}

export default function WarehouseDashboardSummary({
    stats,
}: WarehouseDashboardSummaryProps) {
    const summaryCards: SummaryCard[] = [
        {
            label: "Total Products",
            value: stats.totalProducts,
            description:
                "Products currently assigned to this warehouse",
            icon: Package,
            iconClassName:
                "bg-blue-50 text-blue-600",
        },

        {
            label: "Low Stock",
            value: stats.lowStock,
            description:
                "Items at or below reorder level",
            icon: AlertTriangle,
            iconClassName:
                "bg-amber-50 text-amber-600",
            valueClassName:
                stats.lowStock > 0
                    ? "text-amber-600"
                    : undefined,
        },

        {
            label: "Pending Requests",
            value: stats.pendingRequests,
            description:
                "Branch requests awaiting review",
            icon: ClipboardList,
            iconClassName:
                "bg-sky-50 text-sky-600",
            valueClassName:
                stats.pendingRequests > 0
                    ? "text-sky-600"
                    : undefined,
        },

        {
            label: "Active Purchase Orders",
            value:
                stats.approvedRequests +
                stats.preparing +
                stats.outForDelivery,
            description:
                "Purchase orders currently in progress",
            icon: ShoppingCart,
            iconClassName:
                "bg-emerald-50 text-emerald-600",
        },
    ];

    return (
        <section>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
                            className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm shadow-slate-200/40"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-500">
                                        {card.label}
                                    </p>

                                    <p
                                        className={[
                                            "mt-2 text-3xl font-bold tracking-tight text-slate-900",
                                            card.valueClassName ??
                                                "",
                                        ].join(
                                            " "
                                        )}
                                    >
                                        {card.value.toLocaleString()}
                                    </p>
                                </div>

                                <div
                                    className={[
                                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                        card.iconClassName,
                                    ].join(
                                        " "
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>

                            <p className="mt-3 text-xs leading-5 text-slate-400">
                                {card.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}