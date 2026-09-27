"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import type {
    Warehouse,
} from "@/src/services/warehouseService";

interface ViewWarehouseDialogProps {
    warehouse: Warehouse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ViewWarehouseDialog({
    warehouse,
    open,
    onOpenChange,
}: ViewWarehouseDialogProps) {
    if (!warehouse) {
        return null;
    }

    const areaLabels: Record<
        Warehouse["area"],
        string
    > = {
        luzon: "Luzon",
        visayas: "Visayas",
        mindanao: "Mindanao",
    };

    const statusConfig = {
        active: {
            label: "Active",
            className:
                "border-green-200 bg-green-50 text-green-700",
        },
        inactive: {
            label: "Inactive",
            className:
                "border-slate-200 bg-slate-100 text-slate-600",
        },
    } as const;

    const status =
        statusConfig[warehouse.status];

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="border-blue-100 bg-white text-slate-900 sm:max-w-md">
                <DialogHeader className="border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Warehouse Details
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        View warehouse location and status
                        information.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    {/* Warehouse Name */}
                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Warehouse Name
                        </p>

                        <p className="mt-1.5 text-sm font-semibold text-slate-900">
                            {warehouse.name}
                        </p>
                    </div>

                    {/* Warehouse Code */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Warehouse Code
                        </p>

                        <p className="mt-1.5 text-sm font-medium text-slate-900">
                            {warehouse.code}
                        </p>
                    </div>

                    {/* Area */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Area
                        </p>

                        <p className="mt-1.5 text-sm font-medium text-slate-900">
                            {areaLabels[warehouse.area]}
                        </p>
                    </div>

                    {/* Address */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Exact Address
                        </p>

                        <p className="mt-1.5 text-sm text-slate-700">
                            {warehouse.address}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Status
                        </p>

                        <div className="mt-2">
                            <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                            >
                                <span
                                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                        warehouse.status ===
                                        "active"
                                            ? "bg-green-500"
                                            : "bg-slate-400"
                                    }`}
                                />

                                {status.label}
                            </span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}