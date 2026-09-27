"use client";

import {
    ClipboardCheck,
    Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";

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

interface InventoryCountTableProps {
    inventoryCounts: InventoryCount[];
    onView?: (
        inventoryCount: InventoryCount
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

function getTotalVariance(
    inventoryCount: InventoryCount
): number {
    return inventoryCount.items.reduce(
        (total, item) =>
            total + Number(item.variance),
        0
    );
}

export default function InventoryCountTable({
    inventoryCounts,
    onView,
}: InventoryCountTableProps) {
    if (inventoryCounts.length === 0) {
        return (
            <div className="rounded-sm border border-slate-200 bg-white px-6 py-12 text-center">
                <ClipboardCheck className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-3 text-sm font-medium text-slate-700">
                    No inventory count history
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    Completed physical inventory counts will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white">
            <div className="overflow-x-auto">
                <Table className="min-w-[760px]">
                    <TableHeader>
                        <TableRow className="border-blue-100 bg-blue-50 hover:bg-blue-50">
                            <TableHead className="h-11 px-4 font-medium text-slate-600">
                                Count Date
                            </TableHead>

                            <TableHead className="h-11 px-4 font-medium text-slate-600">
                                Counted By
                            </TableHead>

                            <TableHead className="h-11 px-4 text-center font-medium text-slate-600">
                                Items
                            </TableHead>

                            <TableHead className="h-11 px-4 text-right font-medium text-slate-600">
                                Total Variance
                            </TableHead>

                            <TableHead className="h-11 px-4 text-center font-medium text-slate-600">
                                Status
                            </TableHead>

                            <TableHead className="h-11 px-4 text-right font-medium text-slate-600">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {inventoryCounts.map(
                            (inventoryCount) => {
                                const totalVariance =
                                    getTotalVariance(
                                        inventoryCount
                                    );

                                return (
                                    <TableRow
                                        key={
                                            inventoryCount.id
                                        }
                                        className="border-slate-100 hover:bg-slate-50/70"
                                    >
                                        <TableCell className="px-4 py-3 font-medium text-slate-900">
                                            {formatDate(
                                                inventoryCount.counted_at
                                            )}
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-slate-600">
                                            {
                                                inventoryCount
                                                    .countedBy
                                                    ?.name
                                            }
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-center text-slate-600">
                                            {
                                                inventoryCount
                                                    .items
                                                    .length
                                            }
                                        </TableCell>

                                        <TableCell
                                            className={`px-4 py-3 text-right font-medium ${
                                                totalVariance <
                                                0
                                                    ? "text-red-600"
                                                    : totalVariance >
                                                      0
                                                    ? "text-emerald-600"
                                                    : "text-slate-600"
                                            }`}
                                        >
                                            {totalVariance >
                                            0
                                                ? "+"
                                                : ""}
                                            {formatQuantity(
                                                String(
                                                    totalVariance
                                                )
                                            )}
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-center">
                                            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                Completed
                                            </span>
                                        </TableCell>

                                        <TableCell className="px-4 py-3 text-right">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    onView?.(
                                                        inventoryCount
                                                    )
                                                }
                                                className="text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                                            >
                                                <Eye className="h-4 w-4" />

                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}