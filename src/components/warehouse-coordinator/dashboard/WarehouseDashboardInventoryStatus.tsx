"use client";

import {
    AlertTriangle,
    CheckCircle2,
    PackageX,
} from "lucide-react";

interface WarehouseDashboardInventoryStatusProps {
    inStock: number;
    lowStock: number;
    outOfStock: number;
}

interface InventoryStatusItem {
    label: string;
    value: number;
    description: string;
    icon: typeof CheckCircle2;
    iconClassName: string;
    progressClassName: string;
}

export default function WarehouseDashboardInventoryStatus({
    inStock,
    lowStock,
    outOfStock,
}: WarehouseDashboardInventoryStatusProps) {
    const total =
        inStock +
        lowStock +
        outOfStock;

    const getPercentage = (value: number) => {
        if (total === 0) {
            return 0;
        }

        return Math.round(
            (value / total) * 100
        );
    };

    const statuses: InventoryStatusItem[] = [
        {
            label: "In Stock",
            value: inStock,
            description:
                "Items with stock above reorder level",
            icon: CheckCircle2,
            iconClassName:
                "bg-emerald-50 text-emerald-600",
            progressClassName:
                "bg-emerald-500",
        },
        {
            label: "Low Stock",
            value: lowStock,
            description:
                "Items at or below reorder level",
            icon: AlertTriangle,
            iconClassName:
                "bg-amber-50 text-amber-600",
            progressClassName:
                "bg-amber-500",
        },
        {
            label: "Out of Stock",
            value: outOfStock,
            description:
                "Items with zero available stock",
            icon: PackageX,
            iconClassName:
                "bg-red-50 text-red-600",
            progressClassName:
                "bg-red-500",
        },
    ];

    return (
        <section className="mt-6">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                    Inventory Status
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Current inventory health for this warehouse.
                </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm shadow-slate-200/40">
                <div className="grid gap-6 md:grid-cols-3">
                    {statuses.map((status) => {
                        const Icon = status.icon;
                        const percentage =
                            getPercentage(
                                status.value
                            );

                        return (
                            <div
                                key={status.label}
                                className="min-w-0"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={[
                                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                                status.iconClassName,
                                            ].join(
                                                " "
                                            )}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {status.label}
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-400">
                                                {
                                                    status.description
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-2xl font-bold tracking-tight text-slate-900">
                                            {status.value.toLocaleString()}
                                        </p>

                                        <p className="text-[11px] font-medium text-slate-400">
                                            {percentage}%
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={[
                                            "h-full rounded-full transition-all duration-500",
                                            status.progressClassName,
                                        ].join(
                                            " "
                                        )}
                                        style={{
                                            width: `${percentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {total === 0 && (
                    <div className="mt-5 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-center">
                        <p className="text-sm text-slate-500">
                            No inventory records available.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}