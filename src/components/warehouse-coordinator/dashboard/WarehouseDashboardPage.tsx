"use client";

import {
    AlertTriangle,
    ArrowDownToLine,
    ArrowUpFromLine,
    ClipboardList,
    Package,
    ShoppingCart,
} from "lucide-react";

import { useAuth } from "@/src/hooks/useAuth";

const summaryCards = [
    {
        label: "Total Products",
        value: "—",
        description: "Products in the catalog",
        icon: Package,
        iconClassName: "bg-blue-50 text-blue-600",
    },
    {
        label: "Low Stock",
        value: "—",
        description: "Items requiring attention",
        icon: AlertTriangle,
        iconClassName: "bg-amber-50 text-amber-600",
    },
    {
        label: "Pending Requests",
        value: "—",
        description: "Requests awaiting action",
        icon: ClipboardList,
        iconClassName: "bg-sky-50 text-sky-600",
    },
    {
        label: "Purchase Orders",
        value: "—",
        description: "Active purchase orders",
        icon: ShoppingCart,
        iconClassName: "bg-emerald-50 text-emerald-600",
    },
];

const activityItems = [
    {
        title: "Stock In",
        description: "Recent stock receiving activity will appear here.",
        icon: ArrowDownToLine,
        iconClassName: "bg-emerald-50 text-emerald-600",
    },
    {
        title: "Stock Out",
        description: "Recent stock release activity will appear here.",
        icon: ArrowUpFromLine,
        iconClassName: "bg-blue-50 text-blue-600",
    },
    {
        title: "Requests",
        description: "Pending branch requests will appear here.",
        icon: ClipboardList,
        iconClassName: "bg-sky-50 text-sky-600",
    },
];

export default function WarehouseDashboardPage() {
    const {
        user,
        loading,
    } = useAuth();

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
            <div>
                <p className="text-sm font-medium text-blue-600">
                    Warehouse Operations
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Welcome back, {user.name}. Here is your
                    warehouse activity overview.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
                            className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm shadow-slate-200/40"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {card.label}
                                    </p>

                                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                                        {card.value}
                                    </p>
                                </div>

                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconClassName}`}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>

                            <p className="mt-3 text-xs text-slate-400">
                                {card.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Main Content */}
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
                {/* Inventory Overview */}
                <section className="rounded-xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
                    <div className="border-b border-blue-50 px-5 py-4">
                        <h2 className="text-base font-semibold text-slate-900">
                            Inventory Overview
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Warehouse inventory status and stock
                            activity.
                        </p>
                    </div>

                    <div className="grid gap-4 p-5 sm:grid-cols-3">
                        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                                In Stock
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                —
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Available inventory
                            </p>
                        </div>

                        <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-amber-600">
                                Low Stock
                            </p>

                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                —
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
                                —
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Currently unavailable
                            </p>
                        </div>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="rounded-xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
                    <div className="border-b border-blue-50 px-5 py-4">
                        <h2 className="text-base font-semibold text-slate-900">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Common warehouse operations.
                        </p>
                    </div>

                    <div className="space-y-3 p-5">
                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/50"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <Package className="h-4 w-4" />
                            </span>

                            <span>
                                <span className="block text-sm font-medium text-slate-800">
                                    Manage Products
                                </span>

                                <span className="block text-xs text-slate-500">
                                    View and manage product catalog
                                </span>
                            </span>
                        </button>

                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/50"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <ArrowDownToLine className="h-4 w-4" />
                            </span>

                            <span>
                                <span className="block text-sm font-medium text-slate-800">
                                    Receive Stock
                                </span>

                                <span className="block text-xs text-slate-500">
                                    Record incoming inventory
                                </span>
                            </span>
                        </button>

                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition hover:border-blue-200 hover:bg-blue-50/50"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                                <ClipboardList className="h-4 w-4" />
                            </span>

                            <span>
                                <span className="block text-sm font-medium text-slate-800">
                                    View Requests
                                </span>

                                <span className="block text-xs text-slate-500">
                                    Review branch stock requests
                                </span>
                            </span>
                        </button>
                    </div>
                </section>
            </div>

            {/* Recent Activity */}
            <section className="rounded-xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
                <div className="border-b border-blue-50 px-5 py-4">
                    <h2 className="text-base font-semibold text-slate-900">
                        Recent Activity
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Latest warehouse operations.
                    </p>
                </div>

                <div className="divide-y divide-slate-100">
                    {activityItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="flex items-center gap-4 px-5 py-4"
                            >
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.iconClassName}`}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-800">
                                        {item.title}
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}