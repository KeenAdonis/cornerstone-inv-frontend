"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import type {
    InventoryCount,
} from "@/src/services/inventoryCountService";

interface ViewInventoryCountDialogProps {
    inventoryCount: InventoryCount | null;
    open: boolean;
    onOpenChange: (
        open: boolean
    ) => void;
}

function formatDate(
    value: string
): string {
    const match =
        value.match(
            /^(\d{4}-\d{2}-\d{2})/
        );

    if (!match) {
        return "—";
    }

    const date = new Date(
        `${match[1]}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    ).format(date);
}

function formatQuantity(
    value: string
): string {
    const quantity =
        Number(value);

    if (Number.isNaN(quantity)) {
        return "0";
    }

    return new Intl.NumberFormat(
        "en-US",
        {
            maximumFractionDigits: 2,
        }
    ).format(quantity);
}

export default function ViewInventoryCountDialog({
    inventoryCount,
    open,
    onOpenChange,
}: ViewInventoryCountDialogProps) {
    if (!inventoryCount) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onOpenChange={
                onOpenChange
            }
        >
            <DialogContent className="flex max-h-[94vh] flex-col border-blue-100 bg-white text-slate-900 sm:max-w-5xl">
                {/* Header */}
                <DialogHeader className="shrink-0 border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Inventory Count Details
                    </DialogTitle>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {/* Count Information */}
                    <div className="grid gap-4 rounded-sm border border-blue-100 bg-blue-50/50 p-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Count Date
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {formatDate(
                                    inventoryCount.counted_at
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Counted By
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {
                                    inventoryCount
                                        .countedBy
                                        ?.name
                                }
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Branch
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {
                                    inventoryCount
                                        .branch
                                        ?.name
                                }
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Status
                            </p>

                            <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                Completed
                            </span>
                        </div>
                    </div>

                    {/* Notes */}
                    {inventoryCount.notes && (
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Notes
                            </p>

                            <p className="mt-1 rounded-sm border border-slate-200 bg-white p-3 text-sm text-slate-700">
                                {
                                    inventoryCount.notes
                                }
                            </p>
                        </div>
                    )}

                    {/* Count Items */}
                    <div>
                        <p className="mb-3 text-sm font-semibold text-slate-900">
                            Counted Items
                        </p>

                        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white">
                            <div className="overflow-x-auto">
                                <Table className="min-w-[760px]">
                                    <TableHeader>
                                        <TableRow className="border-blue-100 bg-blue-50 hover:bg-blue-50">
                                            <TableHead className="h-11 px-4 font-medium text-slate-600">
                                                Product
                                            </TableHead>

                                            <TableHead className="h-11 px-4 font-medium text-slate-600">
                                                SKU
                                            </TableHead>

                                            <TableHead className="h-11 px-4 text-right font-medium text-slate-600">
                                                System Qty
                                            </TableHead>

                                            <TableHead className="h-11 px-4 text-right font-medium text-slate-600">
                                                Physical Count
                                            </TableHead>

                                            <TableHead className="h-11 px-4 text-right font-medium text-slate-600">
                                                Variance
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {inventoryCount.items.map(
                                            (item) => {
                                                const variance =
                                                    Number(
                                                        item.variance
                                                    );

                                                return (
                                                    <TableRow
                                                        key={
                                                            item.id
                                                        }
                                                        className="border-slate-100"
                                                    >
                                                        <TableCell className="px-4 py-3 font-medium text-slate-900">
                                                            {
                                                                item
                                                                    .product
                                                                    ?.name
                                                            }
                                                        </TableCell>

                                                        <TableCell className="px-4 py-3 font-mono text-xs text-slate-600">
                                                            {
                                                                item
                                                                    .product
                                                                    ?.sku
                                                            }
                                                        </TableCell>

                                                        <TableCell className="px-4 py-3 text-right text-slate-700">
                                                            {formatQuantity(
                                                                item.system_quantity
                                                            )}
                                                        </TableCell>

                                                        <TableCell className="px-4 py-3 text-right font-medium text-slate-900">
                                                            {formatQuantity(
                                                                item.counted_quantity
                                                            )}
                                                        </TableCell>

                                                        <TableCell
                                                            className={`px-4 py-3 text-right font-medium ${
                                                                variance <
                                                                0
                                                                    ? "text-red-600"
                                                                    : variance >
                                                                      0
                                                                    ? "text-emerald-600"
                                                                    : "text-slate-600"
                                                            }`}
                                                        >
                                                            {variance >
                                                            0
                                                                ? "+"
                                                                : ""}
                                                            {formatQuantity(
                                                                item.variance
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}