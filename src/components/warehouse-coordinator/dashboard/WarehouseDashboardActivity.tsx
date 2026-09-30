"use client";

import {
    ArrowDownToLine,
    ArrowLeftRight,
    ArrowUpFromLine,
    ClipboardPenLine,
    Package,
} from "lucide-react";

import type { StockMovement } from "@/src/services/stockMovementService";

interface WarehouseDashboardActivityProps {
    movements: StockMovement[];
}

function getMovementLabel(
    movementType: StockMovement["movement_type"]
) {
    switch (movementType) {
        case "stock_in":
            return "Stock In";

        case "stock_out":
            return "Stock Out";

        case "transfer":
            return "Transfer";

        case "adjustment":
            return "Adjustment";

        default:
            return "Movement";
    }
}

function getMovementIcon(
    movementType: StockMovement["movement_type"]
) {
    switch (movementType) {
        case "stock_in":
            return ArrowDownToLine;

        case "stock_out":
            return ArrowUpFromLine;

        case "transfer":
            return ArrowLeftRight;

        case "adjustment":
            return ClipboardPenLine;

        default:
            return Package;
    }
}

function getMovementStyles(
    movementType: StockMovement["movement_type"]
) {
    switch (movementType) {
        case "stock_in":
            return {
                icon: "bg-emerald-50 text-emerald-600",
                quantity: "text-emerald-600",
            };

        case "stock_out":
            return {
                icon: "bg-red-50 text-red-600",
                quantity: "text-red-600",
            };

        case "transfer":
            return {
                icon: "bg-blue-50 text-blue-600",
                quantity: "text-blue-600",
            };

        case "adjustment":
            return {
                icon: "bg-amber-50 text-amber-600",
                quantity: "text-amber-600",
            };

        default:
            return {
                icon: "bg-slate-50 text-slate-500",
                quantity: "text-slate-600",
            };
    }
}

function formatDateTime(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return parsedDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function getQuantityPrefix(
    movementType: StockMovement["movement_type"]
) {
    switch (movementType) {
        case "stock_in":
            return "+";

        case "stock_out":
            return "-";

        default:
            return "";
    }
}

export default function WarehouseDashboardActivity({
    movements,
}: WarehouseDashboardActivityProps) {
    return (
        <section className="mt-6">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                    Recent Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Latest stock movements recorded in this warehouse.
                </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm shadow-slate-200/40">
                {movements.length === 0 ? (
                    <div className="flex min-h-[180px] flex-col items-center justify-center px-6 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50">
                            <Package className="h-5 w-5 text-slate-400" />
                        </div>

                        <p className="mt-3 text-sm font-medium text-slate-700">
                            No recent activity
                        </p>

                        <p className="mt-1 max-w-md text-xs text-slate-400">
                            Stock movements will appear here once
                            inventory activity is recorded.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {movements.map((movement) => {
                            const Icon = getMovementIcon(
                                movement.movement_type
                            );

                            const styles =
                                getMovementStyles(
                                    movement.movement_type
                                );

                            const quantityPrefix =
                                getQuantityPrefix(
                                    movement.movement_type
                                );

                            return (
                                <div
                                    key={movement.id}
                                    className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    {/* Movement information */}
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div
                                            className={[
                                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                                styles.icon,
                                            ].join(" ")}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    {movement
                                                        .product
                                                        ?.name ??
                                                        "Unknown Product"}
                                                </p>

                                                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                                                    {getMovementLabel(
                                                        movement.movement_type
                                                    )}
                                                </span>
                                            </div>

                                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                                                {movement.product
                                                    ?.sku && (
                                                    <>
                                                        <span>
                                                            SKU:{" "}
                                                            {
                                                                movement
                                                                    .product
                                                                    .sku
                                                            }
                                                        </span>

                                                        <span className="text-slate-200">
                                                            •
                                                        </span>
                                                    </>
                                                )}

                                                <span>
                                                    {formatDateTime(
                                                        movement.moved_at
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                                        <div className="text-left sm:text-right">
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                                Quantity
                                            </p>

                                            <p
                                                className={[
                                                    "mt-0.5 text-sm font-bold",
                                                    styles.quantity,
                                                ].join(
                                                    " "
                                                )}
                                            >
                                                {quantityPrefix}
                                                {Number(
                                                    movement.quantity
                                                ).toLocaleString()}
                                                {movement.product
                                                    ?.unit
                                                    ? ` ${movement.product.unit}`
                                                    : ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}