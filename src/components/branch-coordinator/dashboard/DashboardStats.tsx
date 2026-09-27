"use client";

import {
    AlertTriangle,
    Package,
    PackageCheck,
    PackageX,
} from "lucide-react";

import type { Inventory } from "@/src/services/inventoryService";

interface DashboardStatsProps {
    inventory: Inventory[];
    loading: boolean;
}

export default function DashboardStats({
    inventory,
    loading,
}: DashboardStatsProps) {
    const totalProducts =
        inventory.length;

    const totalStock =
        inventory.reduce(
            (total, item) =>
                total +
                Number(item.quantity || 0),
            0
        );

    /*
     * Low-stock threshold will temporarily use
     * quantity <= 10 until the inventory/product
     * response exposes a dedicated minimum-stock
     * value.
     */
    const lowStockCount =
        inventory.filter(
            (item) =>
                Number(item.quantity || 0) > 0 &&
                Number(item.quantity || 0) <= 10
        ).length;

    const outOfStockCount =
        inventory.filter(
            (item) =>
                Number(item.quantity || 0) <= 0
        ).length;

    const stats = [
        {
            label: "Total Products",
            value: totalProducts,
            description:
                "Products currently tracked in this branch",
            icon: Package,
            iconClassName:
                "bg-blue-50 text-blue-600",
        },
        {
            label: "Total Stock",
            value: totalStock.toLocaleString(
                "en-PH",
                {
                    maximumFractionDigits: 2,
                }
            ),
            description:
                "Total quantity across all products",
            icon: PackageCheck,
            iconClassName:
                "bg-emerald-50 text-emerald-600",
        },
        {
            label: "Low Stock",
            value: lowStockCount,
            description:
                "Products requiring replenishment",
            icon: AlertTriangle,
            iconClassName:
                "bg-amber-50 text-amber-600",
        },
        {
            label: "Out of Stock",
            value: outOfStockCount,
            description:
                "Products currently unavailable",
            icon: PackageX,
            iconClassName:
                "bg-red-50 text-red-600",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.label}
                        className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm shadow-slate-200/40"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    {stat.label}
                                </p>

                                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                    {loading
                                        ? "—"
                                        : stat.value}
                                </p>
                            </div>

                            <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconClassName}`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                        </div>

                        <p className="mt-3 text-xs text-slate-400">
                            {stat.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}