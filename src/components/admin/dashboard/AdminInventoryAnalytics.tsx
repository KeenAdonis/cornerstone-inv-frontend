"use client";

import {
    BarChart3,
    Building2,
    Warehouse as WarehouseIcon,
} from "lucide-react";

import type { Inventory } from "@/src/services/inventoryService";

interface AdminInventoryAnalyticsProps {
    inventory: Inventory[];
    loading: boolean;
}

type Area = "luzon" | "visayas" | "mindanao";

interface AreaSummary {
    label: string;
    stock: number;
    records: number;
}

export default function AdminInventoryAnalytics({
    inventory,
    loading,
}: AdminInventoryAnalyticsProps) {
    const areas: Area[] = [
        "luzon",
        "visayas",
        "mindanao",
    ];

    const areaLabels: Record<Area, string> = {
        luzon: "Luzon",
        visayas: "Visayas",
        mindanao: "Mindanao",
    };

    /*
     * Calculate stock per area.
     *
     * An inventory record may belong to either:
     * - a branch
     * - a warehouse
     *
     * Both branch and warehouse contain an area.
     */
    const areaSummary: AreaSummary[] =
        areas.map((area) => {
            const areaInventory =
                inventory.filter((item) => {
                    const itemArea =
                        item.branch?.area ??
                        undefined;

                    /*
                     * InventoryWarehouse currently
                     * does not expose area in the
                     * frontend interface.
                     *
                     * Therefore, warehouse inventory
                     * cannot yet be assigned to an area
                     * from the current response shape.
                     */
                    if (itemArea) {
                        return (
                            itemArea === area
                        );
                    }

                    return false;
                });

            return {
                label:
                    areaLabels[area],
                stock:
                    areaInventory.reduce(
                        (total, item) =>
                            total +
                            Number(
                                item.quantity ||
                                    0
                            ),
                        0
                    ),
                records:
                    areaInventory.length,
            };
        });

    /*
     * Branch vs Warehouse inventory.
     */
    const branchStock =
        inventory
            .filter(
                (item) =>
                    item.branch_id !==
                    null
            )
            .reduce(
                (total, item) =>
                    total +
                    Number(
                        item.quantity || 0
                    ),
                0
            );

    const warehouseStock =
        inventory
            .filter(
                (item) =>
                    item.warehouse_id !==
                    null
            )
            .reduce(
                (total, item) =>
                    total +
                    Number(
                        item.quantity || 0
                    ),
                0
            );

    const totalDistributedStock =
        branchStock +
        warehouseStock;

    const branchPercentage =
        totalDistributedStock > 0
            ? (branchStock /
                  totalDistributedStock) *
              100
            : 0;

    const warehousePercentage =
        totalDistributedStock > 0
            ? (warehouseStock /
                  totalDistributedStock) *
              100
            : 0;

    const maxAreaStock =
        Math.max(
            ...areaSummary.map(
                (area) => area.stock
            ),
            0
        );

    const formatNumber = (
        value: number
    ) =>
        value.toLocaleString(
            "en-PH",
            {
                maximumFractionDigits: 2,
            }
        );

    return (
        <section className="rounded-xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
            {/* Header */}
            <div className="border-b border-blue-50 px-5 py-4">
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <BarChart3 className="h-4 w-4" />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Inventory Analytics
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            System-wide stock distribution
                            across operational locations.
                        </p>
                    </div>
                </div>
            </div>

            {/* Analytics */}
            <div className="grid gap-6 p-5 xl:grid-cols-2">
                {/* Stock by Area */}
                <div className="rounded-lg border border-slate-200">
                    <div className="border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-semibold text-slate-900">
                            Stock by Area
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            Inventory currently assigned
                            to branches by area.
                        </p>
                    </div>

                    <div className="space-y-5 p-4">
                        {areaSummary.map(
                            (area) => {
                                const percentage =
                                    maxAreaStock >
                                    0
                                        ? (area.stock /
                                              maxAreaStock) *
                                          100
                                        : 0;

                                return (
                                    <div
                                        key={
                                            area.label
                                        }
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">
                                                    {
                                                        area.label
                                                    }
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    {
                                                        area.records
                                                    }{" "}
                                                    inventory{" "}
                                                    {area.records ===
                                                    1
                                                        ? "record"
                                                        : "records"}
                                                </p>
                                            </div>

                                            <p className="text-sm font-semibold text-slate-900">
                                                {loading
                                                    ? "—"
                                                    : formatNumber(
                                                          area.stock
                                                      )}
                                            </p>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                                style={{
                                                    width: loading
                                                        ? "0%"
                                                        : `${percentage}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* Inventory Distribution */}
                <div className="rounded-lg border border-slate-200">
                    <div className="border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-semibold text-slate-900">
                            Inventory Distribution
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            Current stock distribution between
                            branches and warehouses.
                        </p>
                    </div>

                    <div className="space-y-5 p-4">
                        {/* Branch */}
                        <div>
                            <div className="mb-2 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <Building2 className="h-4 w-4" />
                                    </span>

                                    <div>
                                        <p className="text-sm font-medium text-slate-800">
                                            Branch Inventory
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Stock held by branches
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {loading
                                            ? "—"
                                            : formatNumber(
                                                  branchStock
                                              )}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {loading
                                            ? "—"
                                            : `${branchPercentage.toFixed(
                                                  1
                                              )}%`}
                                    </p>
                                </div>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                                    style={{
                                        width: loading
                                            ? "0%"
                                            : `${branchPercentage}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Warehouse */}
                        <div>
                            <div className="mb-2 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <WarehouseIcon className="h-4 w-4" />
                                    </span>

                                    <div>
                                        <p className="text-sm font-medium text-slate-800">
                                            Warehouse Inventory
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Stock held by warehouses
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {loading
                                            ? "—"
                                            : formatNumber(
                                                  warehouseStock
                                              )}
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {loading
                                            ? "—"
                                            : `${warehousePercentage.toFixed(
                                                  1
                                              )}%`}
                                    </p>
                                </div>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                                    style={{
                                        width: loading
                                            ? "0%"
                                            : `${warehousePercentage}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Total */}
                        <div className="border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Total Distributed Stock
                                </p>

                                <p className="text-lg font-bold text-slate-900">
                                    {loading
                                        ? "—"
                                        : formatNumber(
                                              totalDistributedStock
                                          )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}