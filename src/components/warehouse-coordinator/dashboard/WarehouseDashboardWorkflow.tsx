"use client";

import {
    CheckCircle2,
    ClipboardList,
    PackageCheck,
    Truck,
    Warehouse,
} from "lucide-react";

interface WarehouseDashboardWorkflowProps {
    pending: number;
    approved: number;
    preparing: number;
    outForDelivery: number;
    delivered: number;
    completed: number;
}

interface WorkflowStep {
    label: string;
    value: number;
    description: string;
    icon: typeof ClipboardList;
    iconClassName: string;
}

export default function WarehouseDashboardWorkflow({
    pending,
    approved,
    preparing,
    outForDelivery,
    delivered,
    completed,
}: WarehouseDashboardWorkflowProps) {
    const workflowSteps: WorkflowStep[] = [
        {
            label: "Pending",
            value: pending,
            description: "Awaiting review",
            icon: ClipboardList,
            iconClassName:
                "bg-amber-50 text-amber-600",
        },
        {
            label: "Approved",
            value: approved,
            description: "Approved requests",
            icon: CheckCircle2,
            iconClassName:
                "bg-blue-50 text-blue-600",
        },
        {
            label: "Preparing",
            value: preparing,
            description: "Being prepared",
            icon: Warehouse,
            iconClassName:
                "bg-violet-50 text-violet-600",
        },
        {
            label: "Out for Delivery",
            value: outForDelivery,
            description: "Currently in transit",
            icon: Truck,
            iconClassName:
                "bg-orange-50 text-orange-600",
        },
        {
            label: "Delivered",
            value: delivered,
            description: "Delivered to branch",
            icon: PackageCheck,
            iconClassName:
                "bg-cyan-50 text-cyan-600",
        },
        {
            label: "Completed",
            value: completed,
            description: "Completed orders",
            icon: CheckCircle2,
            iconClassName:
                "bg-emerald-50 text-emerald-600",
        },
    ];

    return (
        <section className="mt-6">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                    Purchase Order Workflow
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Track purchase orders through the warehouse
                    fulfillment process.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {workflowSteps.map((step) => {
                    const Icon = step.icon;

                    return (
                        <div
                            key={step.label}
                            className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm shadow-slate-200/40"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div
                                    className={[
                                        "flex h-9 w-9 items-center justify-center rounded-lg",
                                        step.iconClassName,
                                    ].join(" ")}
                                >
                                    <Icon className="h-4.5 w-4.5" />
                                </div>

                                <span className="text-2xl font-bold tracking-tight text-slate-900">
                                    {step.value.toLocaleString()}
                                </span>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-semibold text-slate-800">
                                    {step.label}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}