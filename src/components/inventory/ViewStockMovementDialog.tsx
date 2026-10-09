"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import type {
    StockMovement,
} from "@/src/services/stockMovementService";

interface ViewStockMovementDialogProps {
    stockMovement: StockMovement | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const getMovementTypeLabel = (
    type: StockMovement["movement_type"]
): string => {
    const labels: Record<
        StockMovement["movement_type"],
        string
    > = {
        stock_in: "Stock In",
        stock_out: "Stock Out",
        transfer: "Transfer",
        adjustment: "Adjustment",
    };

    return labels[type];
};

const getMovementTypeClassName = (
    type: StockMovement["movement_type"]
): string => {
    const classes: Record<
        StockMovement["movement_type"],
        string
    > = {
        stock_in:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

        stock_out:
            "border-red-200 bg-red-50 text-red-700",

        transfer:
            "border-blue-200 bg-blue-50 text-blue-700",

        adjustment:
            "border-amber-200 bg-amber-50 text-amber-700",
    };

    return classes[type];
};

const formatDateTime = (
    value: string
): string => {
    return new Date(
        value
    ).toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const formatQuantity = (
    value: string
): string => {
    return Number(value).toLocaleString(
        "en-PH",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }
    );
};

const getLocationName = (
    warehouse?: {
        id: number;
        name: string;
        code: string;
    },
    branch?: {
        id: number;
        name: string;
        code: string;
    }
): string => {
    if (warehouse) {
        return warehouse.name;
    }

    if (branch) {
        return branch.name;
    }

    return "—";
};

const getLocationCode = (
    warehouse?: {
        id: number;
        name: string;
        code: string;
    },
    branch?: {
        id: number;
        name: string;
        code: string;
    }
): string | null => {
    if (warehouse) {
        return warehouse.code;
    }

    if (branch) {
        return branch.code;
    }

    return null;
};

export default function ViewStockMovementDialog({
    stockMovement,
    open,
    onOpenChange,
}: ViewStockMovementDialogProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="flex max-h-[90dvh] flex-col overflow-hidden border-blue-100 bg-white text-slate-900 sm:max-w-2xl">
                <DialogHeader className="border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Stock Movement Details
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        View the details of this inventory movement.
                    </DialogDescription>
                </DialogHeader>

                {stockMovement && (
                    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain pr-1">
                        {/* Movement Information */}
                        <div className="rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Movement Type
                                    </p>

                                    <span
                                        className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getMovementTypeClassName(
                                            stockMovement.movement_type
                                        )}`}
                                    >
                                        {getMovementTypeLabel(
                                            stockMovement.movement_type
                                        )}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Moved At
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {formatDateTime(
                                            stockMovement.moved_at
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Product
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {
                                            stockMovement
                                                .product
                                                ?.name ??
                                            "Unknown Product"
                                        }
                                    </p>

                                    {stockMovement.product && (
                                        <p className="mt-0.5 font-mono text-xs text-slate-500">
                                            {
                                                stockMovement
                                                    .product
                                                    .sku
                                            }
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Quantity
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {formatQuantity(
                                            stockMovement.quantity
                                        )}

                                        {stockMovement
                                            .product
                                            ?.unit && (
                                            <span className="ml-1 text-xs font-normal text-slate-500">
                                                {
                                                    stockMovement
                                                        .product
                                                        .unit
                                                }
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div>
                            <div className="mb-3">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Location Information
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Source and destination of the stock movement.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        From
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {getLocationName(
                                            stockMovement.from_warehouse,
                                            stockMovement.from_branch
                                        )}
                                    </p>

                                    {getLocationCode(
                                        stockMovement.from_warehouse,
                                        stockMovement.from_branch
                                    ) && (
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {getLocationCode(
                                                stockMovement.from_warehouse,
                                                stockMovement.from_branch
                                            )}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        To
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {getLocationName(
                                            stockMovement.to_warehouse,
                                            stockMovement.to_branch
                                        )}
                                    </p>

                                    {getLocationCode(
                                        stockMovement.to_warehouse,
                                        stockMovement.to_branch
                                    ) && (
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {getLocationCode(
                                                stockMovement.to_warehouse,
                                                stockMovement.to_branch
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Reference Information */}
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Reference
                                    </p>

                                    <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                                        {stockMovement
                                            .purchase_order
                                            ?.reference_number ??
                                            "—"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Created By
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {
                                            stockMovement
                                                .creator
                                                ?.name ??
                                            "—"
                                        }
                                    </p>

                                    {stockMovement.creator && (
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {
                                                stockMovement
                                                    .creator
                                                    .email
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Notes
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                                {stockMovement.notes ||
                                    "No notes provided."}
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter className="shrink-0 border-t border-blue-100 bg-blue-50/60 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            onOpenChange(false)
                        }
                        className="border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}