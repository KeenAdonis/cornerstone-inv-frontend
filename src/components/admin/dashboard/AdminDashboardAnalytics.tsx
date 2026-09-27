"use client";

import { useMemo } from "react";

import type { Inventory } from "@/src/services/inventoryService";

interface AdminDashboardAnalyticsProps {
    inventory: Inventory[];
    loading: boolean;
}

interface AnalyticsItem {
    label: string;
    value: number;
}

export default function AdminDashboardAnalytics({
    inventory,
    loading,
}: AdminDashboardAnalyticsProps) {
    /*
    |--------------------------------------------------------------------------
    | Stock by Location
    |--------------------------------------------------------------------------
    */

    const stockByLocation =
        useMemo<AnalyticsItem[]>(() => {
            const locationMap =
                new Map<string, number>();

            inventory.forEach((item) => {
                const quantity =
                    Number(item.quantity || 0);

                let locationName = "Unassigned";

                if (item.branch) {
                    locationName =
                        `Branch — ${item.branch.name}`;
                } else if (item.warehouse) {
                    locationName =
                        `Warehouse — ${item.warehouse.name}`;
                }

                locationMap.set(
                    locationName,
                    (locationMap.get(locationName) || 0) +
                        quantity
                );
            });

            return Array.from(
                locationMap.entries()
            )
                .map(
                    ([label, value]) => ({
                        label,
                        value,
                    })
                )
                .sort(
                    (a, b) =>
                        b.value - a.value
                )
                .slice(0, 8);
        }, [inventory]);

    /*
    |--------------------------------------------------------------------------
    | Stock by Category
    |--------------------------------------------------------------------------
    */

    const stockByCategory =
        useMemo<AnalyticsItem[]>(() => {
            const categoryMap =
                new Map<string, number>();

            inventory.forEach((item) => {
                const quantity =
                    Number(item.quantity || 0);

                const categoryName =
                    item.product?.category?.name ||
                    "Uncategorized";

                categoryMap.set(
                    categoryName,
                    (categoryMap.get(
                        categoryName
                    ) || 0) + quantity
                );
            });

            return Array.from(
                categoryMap.entries()
            )
                .map(
                    ([label, value]) => ({
                        label,
                        value,
                    })
                )
                .sort(
                    (a, b) =>
                        b.value - a.value
                )
                .slice(0, 8);
        }, [inventory]);

    /*
    |--------------------------------------------------------------------------
    | Top Products by Stock
    |--------------------------------------------------------------------------
    */

    const topProducts =
        useMemo<AnalyticsItem[]>(() => {
            const productMap =
                new Map<string, number>();

            inventory.forEach((item) => {
                const quantity =
                    Number(item.quantity || 0);

                const productName =
                    item.product?.name ||
                    "Unknown Product";

                productMap.set(
                    productName,
                    (productMap.get(
                        productName
                    ) || 0) + quantity
                );
            });

            return Array.from(
                productMap.entries()
            )
                .map(
                    ([label, value]) => ({
                        label,
                        value,
                    })
                )
                .sort(
                    (a, b) =>
                        b.value - a.value
                )
                .slice(0, 5);
        }, [inventory]);

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    const getMaxValue = (
        items: AnalyticsItem[]
    ) => {
        return Math.max(
            ...items.map(
                (item) => item.value
            ),
            1
        );
    };

    const formatNumber = (
        value: number
    ) => {
        return value.toLocaleString(
            "en-PH",
            {
                maximumFractionDigits: 2,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <section className="rounded-xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
            {/* Section Header */}
            <div className="border-b border-blue-50 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">
                    Inventory Analytics
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    System-wide inventory distribution
                    and stock insights.
                </p>
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-2">
                {/* --------------------------------------------------------- */}
                {/* Stock by Location */}
                {/* --------------------------------------------------------- */}

                <div className="rounded-xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-semibold text-slate-900">
                            Stock by Location
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Inventory distribution across
                            branches and warehouses.
                        </p>
                    </div>

                    <div className="space-y-4 p-4">
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(
                                    (item) => (
                                        <div
                                            key={item}
                                            className="animate-pulse"
                                        >
                                            <div className="h-3 w-32 rounded bg-slate-100" />

                                            <div className="mt-2 h-2 rounded-full bg-slate-100" />
                                        </div>
                                    )
                                )}
                            </div>
                        ) : stockByLocation.length ===
                          0 ? (
                            <div className="py-8 text-center">
                                <p className="text-sm text-slate-400">
                                    No location inventory
                                    data available.
                                </p>
                            </div>
                        ) : (
                            stockByLocation.map(
                                (item) => {
                                    const max =
                                        getMaxValue(
                                            stockByLocation
                                        );

                                    const percentage =
                                        (item.value /
                                            max) *
                                        100;

                                    return (
                                        <div
                                            key={
                                                item.label
                                            }
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="min-w-0 truncate text-xs font-medium text-slate-700">
                                                    {
                                                        item.label
                                                    }
                                                </p>

                                                <p className="shrink-0 text-xs font-semibold text-slate-900">
                                                    {formatNumber(
                                                        item.value
                                                    )}
                                                </p>
                                            </div>

                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-blue-500 transition-all"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        )}
                    </div>
                </div>

                {/* --------------------------------------------------------- */}
                {/* Stock by Category */}
                {/* --------------------------------------------------------- */}

                <div className="rounded-xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-semibold text-slate-900">
                            Stock by Category
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Total inventory quantity grouped
                            by product category.
                        </p>
                    </div>

                    <div className="space-y-4 p-4">
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(
                                    (item) => (
                                        <div
                                            key={item}
                                            className="animate-pulse"
                                        >
                                            <div className="h-3 w-28 rounded bg-slate-100" />

                                            <div className="mt-2 h-2 rounded-full bg-slate-100" />
                                        </div>
                                    )
                                )}
                            </div>
                        ) : stockByCategory.length ===
                          0 ? (
                            <div className="py-8 text-center">
                                <p className="text-sm text-slate-400">
                                    No category data
                                    available.
                                </p>
                            </div>
                        ) : (
                            stockByCategory.map(
                                (item) => {
                                    const max =
                                        getMaxValue(
                                            stockByCategory
                                        );

                                    const percentage =
                                        (item.value /
                                            max) *
                                        100;

                                    return (
                                        <div
                                            key={
                                                item.label
                                            }
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="min-w-0 truncate text-xs font-medium text-slate-700">
                                                    {
                                                        item.label
                                                    }
                                                </p>

                                                <p className="shrink-0 text-xs font-semibold text-slate-900">
                                                    {formatNumber(
                                                        item.value
                                                    )}
                                                </p>
                                            </div>

                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-indigo-500 transition-all"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        )}
                    </div>
                </div>

                {/* --------------------------------------------------------- */}
                {/* Top Products */}
                {/* --------------------------------------------------------- */}

                <div className="rounded-xl border border-slate-200 bg-white lg:col-span-2">
                    <div className="border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-semibold text-slate-900">
                            Top Products by Stock
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Products with the highest total
                            inventory quantity across the system.
                        </p>
                    </div>

                    <div className="p-4">
                        {loading ? (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                                {[1, 2, 3, 4, 5].map(
                                    (item) => (
                                        <div
                                            key={item}
                                            className="animate-pulse rounded-lg bg-slate-50 p-4"
                                        >
                                            <div className="h-3 w-24 rounded bg-slate-200" />

                                            <div className="mt-3 h-6 w-16 rounded bg-slate-200" />
                                        </div>
                                    )
                                )}
                            </div>
                        ) : topProducts.length ===
                          0 ? (
                            <div className="py-8 text-center">
                                <p className="text-sm text-slate-400">
                                    No product inventory
                                    data available.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                                {topProducts.map(
                                    (
                                        item,
                                        index
                                    ) => {
                                        const max =
                                            getMaxValue(
                                                topProducts
                                            );

                                        const percentage =
                                            (item.value /
                                                max) *
                                            100;

                                        return (
                                            <div
                                                key={
                                                    item.label
                                                }
                                                className="rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-xs font-semibold text-blue-600">
                                                        {index +
                                                            1}
                                                    </span>

                                                    <span className="text-xs font-semibold text-slate-900">
                                                        {formatNumber(
                                                            item.value
                                                        )}
                                                    </span>
                                                </div>

                                                <p className="mt-3 truncate text-sm font-medium text-slate-800">
                                                    {
                                                        item.label
                                                    }
                                                </p>

                                                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                                                    <div
                                                        className="h-full rounded-full bg-blue-500"
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}