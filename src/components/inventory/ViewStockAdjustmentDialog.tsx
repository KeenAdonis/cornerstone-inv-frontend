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
    StockAdjustment,
} from "@/src/services/stockAdjustmentService";

interface ViewStockAdjustmentDialogProps {
    stockAdjustment: StockAdjustment | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ViewStockAdjustmentDialog({
    stockAdjustment,
    open,
    onOpenChange,
}: ViewStockAdjustmentDialogProps) {
    const formatDateTime = (
        value: string
    ) => {
        return new Date(
            value
        ).toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const formatQuantity = (
        value: string
    ) => {
        return Number(value).toLocaleString(
            "en-PH",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
            }
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="flex max-h-[90dvh] flex-col overflow-hidden border-blue-100 bg-white text-slate-900 sm:max-w-2xl">
                <DialogHeader className="border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Stock Adjustment Details
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        View the details of this inventory adjustment.
                    </DialogDescription>
                </DialogHeader>

                {stockAdjustment && (
                    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain pr-1">
                        <div className="rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Reference Number
                                    </p>

                                    <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                                        {
                                            stockAdjustment.reference_number
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Adjustment Type
                                    </p>

                                    <div className="mt-1">
                                        {stockAdjustment.type ===
                                        "increase" ? (
                                            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                Increase
                                            </span>
                                        ) : (
                                            <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                                                Decrease
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Adjusted At
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {formatDateTime(
                                            stockAdjustment.adjusted_at
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Reason
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {
                                            stockAdjustment.reason
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Location
                                    </p>
                                                                    
                                    {stockAdjustment.warehouse ? (
                                        <>
                                            <p className="mt-1 text-sm font-medium text-slate-900">
                                                {
                                                    stockAdjustment
                                                        .warehouse
                                                        .name
                                                }
                                            </p>
                                            
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                Warehouse ·{" "}
                                                {
                                                    stockAdjustment
                                                        .warehouse
                                                        .code
                                                }
                                            </p>
                                        </>
                                    ) : stockAdjustment.branch ? (
                                        <>
                                            <p className="mt-1 text-sm font-medium text-slate-900">
                                                {
                                                    stockAdjustment
                                                        .branch
                                                        .name
                                                }
                                            </p>
                                            
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                Branch ·{" "}
                                                {
                                                    stockAdjustment
                                                        .branch
                                                        .code
                                                }
                                            </p>
                                        </>
                                    ) : (
                                        <p className="mt-1 text-sm font-medium text-slate-900">
                                            —
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Created By
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {stockAdjustment
                                            .creator
                                            ?.name ??
                                            "—"}
                                    </p>

                                    {stockAdjustment.creator && (
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {
                                                stockAdjustment
                                                    .creator
                                                    .email
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-3">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Adjusted Products
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    {
                                        stockAdjustment
                                            .items
                                            .length
                                    }{" "}
                                    {stockAdjustment
                                        .items
                                        .length ===
                                    1
                                        ? "product"
                                        : "products"}{" "}
                                    included in this adjustment.
                                </p>
                            </div>

                            <div className="w-full min-w-0 overflow-x-auto rounded-lg border border-slate-200">
                                <table className="w-full min-w-[600px] text-sm">
                                    <thead>
                                        <tr className="border-b border-blue-100 bg-blue-50">
                                            <th className="px-4 py-3 text-left font-medium text-blue-900">
                                                Product
                                            </th>

                                            <th className="px-4 py-3 text-left font-medium text-blue-900">
                                                SKU
                                            </th>

                                            <th className="px-4 py-3 text-left font-medium text-blue-900">
                                                Unit
                                            </th>

                                            <th className="px-4 py-3 text-right font-medium text-blue-900">
                                                Quantity
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {stockAdjustment.items.map(
                                            (
                                                item
                                            ) => (
                                                <tr
                                                    key={
                                                        item.id
                                                    }
                                                    className="border-b border-slate-200 last:border-b-0"
                                                >
                                                    <td className="px-4 py-3 font-medium text-slate-900">
                                                        {item
                                                            .product
                                                            ?.name ??
                                                            "Unknown Product"}
                                                    </td>

                                                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                                                        {item
                                                            .product
                                                            ?.sku ??
                                                            "—"}
                                                    </td>

                                                    <td className="px-4 py-3 text-slate-600">
                                                        {item
                                                            .product
                                                            ?.unit ??
                                                            "—"}
                                                    </td>

                                                    <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                                        {formatQuantity(
                                                            item.quantity
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Notes
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                                {stockAdjustment
                                    .notes ||
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