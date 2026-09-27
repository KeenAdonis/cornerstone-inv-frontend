"use client";

import {
    ArrowDownToLine,
    ArrowUpFromLine,
    ClipboardCheck,
    Package,
} from "lucide-react";

export interface DashboardActivity {
    id: number;
    type:
        | "stock_in"
        | "stock_out"
        | "adjustment"
        | "delivery";

    title: string;
    description: string;
    quantity?: number;
    date: string;
}

interface DashboardRecentActivityProps {
    activities: DashboardActivity[];
    loading: boolean;
}

const activityConfig = {
    stock_in: {
        icon: ArrowDownToLine,
        iconClassName:
            "bg-emerald-50 text-emerald-600",
    },

    stock_out: {
        icon: ArrowUpFromLine,
        iconClassName:
            "bg-blue-50 text-blue-600",
    },

    adjustment: {
        icon: ClipboardCheck,
        iconClassName:
            "bg-amber-50 text-amber-600",
    },

    delivery: {
        icon: Package,
        iconClassName:
            "bg-sky-50 text-sky-600",
    },
};

export default function DashboardRecentActivity({
    activities,
    loading,
}: DashboardRecentActivityProps) {
    return (
        <section className="rounded-xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
            <div className="border-b border-blue-50 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">
                    Recent Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Recent inventory activity for your
                    branch.
                </p>
            </div>

            <div className="divide-y divide-slate-100">
                {loading ? (
                    <div className="px-5 py-8 text-center">
                        <p className="text-sm text-slate-400">
                            Loading recent activity...
                        </p>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                        <p className="text-sm font-medium text-slate-600">
                            No recent activity
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Inventory activity will appear
                            here once available.
                        </p>
                    </div>
                ) : (
                    activities.map((activity) => {
                        const config =
                            activityConfig[
                                activity.type
                            ];

                        const Icon =
                            config.icon;

                        return (
                            <div
                                key={activity.id}
                                className="flex items-center gap-4 px-5 py-4"
                            >
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.iconClassName}`}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-slate-800">
                                        {activity.title}
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-slate-500">
                                        {activity.description}
                                    </p>
                                </div>

                                <div className="shrink-0 text-right">
                                    {activity.quantity !==
                                        undefined && (
                                        <p className="text-sm font-semibold text-slate-800">
                                            {activity.quantity >
                                            0
                                                ? `+${activity.quantity}`
                                                : activity.quantity}
                                        </p>
                                    )}

                                    <p className="mt-0.5 text-xs text-slate-400">
                                        {activity.date}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}