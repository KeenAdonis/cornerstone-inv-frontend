"use client";

import { RefreshCw } from "lucide-react";

interface WarehouseDashboardHeaderProps {
    userName?: string;
    warehouseName?: string;
    warehouseCode?: string;
    isRefreshing?: boolean;
    onRefresh?: () => void;
}

export default function WarehouseDashboardHeader({
    userName,
    warehouseName,
    warehouseCode,
    isRefreshing = false,
    onRefresh,
}: WarehouseDashboardHeaderProps) {
    return (
        <section className="mb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Heading */}
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>Warehouse Operations</span>

                        <span className="text-slate-300">
                            /
                        </span>

                        <span>Dashboard</span>
                    </div>

                    <div className="mt-2">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Warehouse Dashboard
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Welcome back
                            {userName
                                ? `, ${userName}`
                                : ""}
                            . Here&apos;s an overview of your warehouse operations.
                        </p>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Active Warehouse */}
                    {(warehouseName ||
                        warehouseCode) && (
                        <div className="rounded-lg border border-blue-100 bg-white px-4 py-2.5 shadow-sm">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                Active Warehouse
                            </p>

                            <div className="mt-0.5 flex items-center gap-2">
                                {warehouseName && (
                                    <span className="text-sm font-semibold text-slate-800">
                                        {warehouseName}
                                    </span>
                                )}

                                {warehouseCode && (
                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                                        {warehouseCode}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Refresh */}
                    {onRefresh && (
                        <button
                            type="button"
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw
                                className={[
                                    "h-4 w-4",
                                    isRefreshing
                                        ? "animate-spin"
                                        : "",
                                ].join(" ")}
                            />

                            <span className="hidden sm:inline">
                                {isRefreshing
                                    ? "Refreshing..."
                                    : "Refresh"}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}