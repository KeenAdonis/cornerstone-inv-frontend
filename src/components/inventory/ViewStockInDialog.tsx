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
    StockIn,
} from "@/src/services/stockInService";

interface ViewStockInDialogProps {
    stockIn: StockIn | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ViewStockInDialog({
    stockIn,
    open,
    onOpenChange,
}: ViewStockInDialogProps) {
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
            <DialogContent className="border-blue-100 bg-white text-slate-900 sm:max-w-2xl">
                <DialogHeader className="border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Stock In Details
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        View the details of this stock-in transaction.
                    </DialogDescription>
                </DialogHeader>

                {stockIn && (
                    <div className="space-y-5">
                        {/* Transaction Information */}
                        <div className="rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Reference Number
                                    </p>

                                    <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                                        {
                                            stockIn.reference_number
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Received At
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {formatDateTime(
                                            stockIn.received_at
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Warehouse
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {
                                            stockIn
                                                .warehouse
                                                ?.name ??
                                            "—"
                                        }
                                    </p>

                                    {stockIn.warehouse && (
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {
                                                stockIn
                                                    .warehouse
                                                    .code
                                            }
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Created By
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {
                                            stockIn
                                                .creator
                                                ?.name ??
                                            "—"
                                        }
                                    </p>

                                    {stockIn.creator && (
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {
                                                stockIn
                                                    .creator
                                                    .email
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div>
                            <div className="mb-3">
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Products Received
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    {stockIn.items.length}{" "}
                                    {stockIn.items.length ===
                                    1
                                        ? "product"
                                        : "products"}{" "}
                                    included in this transaction.
                                </p>
                            </div>

                            <div className="overflow-hidden rounded-lg border border-slate-200">
                                <table className="w-full text-sm">
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
                                        {stockIn.items.map(
                                            (item) => (
                                                <tr
                                                    key={
                                                        item.id
                                                    }
                                                    className="border-b border-slate-200 last:border-b-0"
                                                >
                                                    <td className="px-4 py-3 font-medium text-slate-900">
                                                        {
                                                            item
                                                                .product
                                                                ?.name ??
                                                            "Unknown Product"
                                                        }
                                                    </td>

                                                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                                                        {
                                                            item
                                                                .product
                                                                ?.sku ??
                                                            "—"
                                                        }
                                                    </td>

                                                    <td className="px-4 py-3 text-slate-600">
                                                        {
                                                            item
                                                                .product
                                                                ?.unit ??
                                                            "—"
                                                        }
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

                        {/* Notes */}
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Notes
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                                {stockIn.notes ||
                                    "No notes provided."}
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter className="border-t border-blue-100 bg-blue-50/60 pt-5">
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