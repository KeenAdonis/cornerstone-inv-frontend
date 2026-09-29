"use client";

import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
    BadgeCheck,
    CalendarDays,
    PackageCheck,
    Printer,
    Truck,
} from "lucide-react";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

import PurchaseOrderPrintView from "@/src/components/purchase-orders/PurchaseOrderPrintView";
import PurchaseOrderDeliveryReceiptPrintView from "@/src/components/purchase-orders/PurchaseOrderDeliveryReceiptPrintView";

interface ViewPurchaseOrderDialogProps {
    purchaseOrder: PurchaseOrder | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;

    onProcess?: () => void;
    processing?: boolean;

    onRelease?: () => void;
    releasing?: boolean;

    onComplete?: () => void;
    completing?: boolean;

    showPrint?: boolean;
}

type PrintMode =
    | "po"
    | "delivery-receipt"
    | null;

const getStatusLabel = (
    status: PurchaseOrder["status"]
): string => {
    const labels: Record<
        PurchaseOrder["status"],
        string
    > = {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        preparing: "Preparing",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        completed: "Completed",
        cancelled: "Cancelled",
    };

    return labels[status];
};

const getStatusClassName = (
    status: PurchaseOrder["status"]
): string => {
    const classes: Record<
        PurchaseOrder["status"],
        string
    > = {
        pending:
            "border-amber-200 bg-amber-50 text-amber-700",

        approved:
            "border-green-200 bg-green-50 text-green-700",

        rejected:
            "border-red-200 bg-red-50 text-red-700",

        preparing:
            "border-blue-200 bg-blue-50 text-blue-700",

        out_for_delivery:
            "border-indigo-200 bg-indigo-50 text-indigo-700",

        delivered:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

        completed:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

        cancelled:
            "border-slate-200 bg-slate-50 text-slate-600",
    };

    return classes[status];
};

const formatDateTime = (
    value: string | null
): string => {
    if (!value) {
        return "—";
    }

    return new Date(
        value
    ).toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const getDeliveryTypeLabel = (
    deliveryType: PurchaseOrder["delivery_type"]
): string => {
    const labels: Record<
        NonNullable<PurchaseOrder["delivery_type"]>,
        string
    > = {
        in_house: "In-House",
        trucking: "Trucking",
        bus: "Bus (Victory D&G)",
        air_cargo: "Air Cargo (A-Best)",
        forwarding: "Forwarding (Southsea)",
    };

    if (!deliveryType) {
        return "—";
    }

    return labels[deliveryType];
};

const formatDate = (
    value: string | null
): string => {
    if (!value) {
        return "—";
    }

    const match = value.match(
        /^(\d{4})-(\d{2})-(\d{2})/
    );

    if (!match) {
        return "—";
    }

    const [
        ,
        year,
        month,
        day,
    ] = match;

    return new Intl.DateTimeFormat(
        "en-PH",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    ).format(
        new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        )
    );
};

export default function ViewPurchaseOrderDialog({
    purchaseOrder,
    open,
    onOpenChange,
    onProcess,
    processing = false,
    onRelease,
    releasing = false,
    onComplete,
    completing = false,
    showPrint = false,
}: ViewPurchaseOrderDialogProps) {
    const [
        printMode,
        setPrintMode,
    ] = useState<PrintMode>(null);

    useEffect(() => {
        if (!printMode) {
            return;
        }

        const handleAfterPrint = () => {
            setPrintMode(null);
        };

        const timer = window.setTimeout(() => {
            window.print();
        }, 150);

        window.addEventListener(
            "afterprint",
            handleAfterPrint
        );

        return () => {
            window.clearTimeout(timer);

            window.removeEventListener(
                "afterprint",
                handleAfterPrint
            );
        };
    }, [printMode]);

    if (!purchaseOrder) {
        return null;
    }

    const actionLoading =
        processing ||
        releasing ||
        completing;

    const showProcessAction =
        onProcess &&
        purchaseOrder.status ===
            "approved";

    const showReleaseAction =
        onRelease &&
        purchaseOrder.status ===
            "preparing";

    const showCompleteAction =
        onComplete &&
        purchaseOrder.status ===
            "delivered";

    const showDeliveryReceipt =
        [
            "out_for_delivery",
            "delivered",
            "completed",
        ].includes(
            purchaseOrder.status
        );

    const handlePrintPO = () => {
        setPrintMode("po");
    };
    
    const handlePrintDeliveryReceipt = () => {
        setPrintMode("delivery-receipt");
    };

    return (
        <>
            <Dialog
                open={open}
                onOpenChange={onOpenChange}
            >
                <DialogContent className="flex max-h-[94vh] flex-col border-blue-100 bg-white text-slate-900 sm:max-w-4xl">
                    {/* Header */}
                    <DialogHeader className="shrink-0 border-b border-blue-100 pb-4">
                        <div className="flex flex-col gap-2 pr-8 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <DialogTitle className="font-mono text-lg text-slate-900">
                                    {
                                        purchaseOrder.reference_number
                                    }
                                </DialogTitle>

                                <DialogDescription className="text-slate-500">
                                    Purchase order details and request information.
                                </DialogDescription>
                            </div>

                            <span
                                className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClassName(
                                    purchaseOrder.status
                                )}`}
                            >
                                {getStatusLabel(
                                    purchaseOrder.status
                                )}
                            </span>
                        </div>
                    </DialogHeader>

                    {/* Scrollable Content */}
                    <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {/* Request Information */}
                        <section>
                            <h3 className="mb-3 text-sm font-semibold text-slate-900">
                                Request Information
                            </h3>

                            <div className="grid gap-4 rounded-md border border-slate-200 bg-slate-50/50 p-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Requested At
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-800">
                                        {formatDateTime(
                                            purchaseOrder.requested_at
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Created By
                                    </p>

                                    {purchaseOrder.creator ? (
                                        <div className="mt-1">
                                            <p className="text-sm font-medium text-slate-800">
                                                {
                                                    purchaseOrder
                                                        .creator
                                                        .name
                                                }
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {
                                                    purchaseOrder
                                                        .creator
                                                        .email
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="mt-1 text-sm text-slate-400">
                                            —
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Branch
                                    </p>

                                    {purchaseOrder.branch ? (
                                        <div className="mt-1">
                                            <p className="text-sm font-medium text-slate-800">
                                                {
                                                    purchaseOrder
                                                        .branch
                                                        .name
                                                }
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {
                                                    purchaseOrder
                                                        .branch
                                                        .code
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="mt-1 text-sm text-slate-400">
                                            —
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Warehouse
                                    </p>

                                    {purchaseOrder.warehouse ? (
                                        <div className="mt-1">
                                            <p className="text-sm font-medium text-slate-800">
                                                {
                                                    purchaseOrder
                                                        .warehouse
                                                        .name
                                                }
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {
                                                    purchaseOrder
                                                        .warehouse
                                                        .code
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="mt-1 text-sm text-slate-400">
                                            —
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Review Information */}
                        {(purchaseOrder.approved_by ||
                            purchaseOrder.approved_at ||
                            purchaseOrder.rejection_reason) && (
                            <section>
                                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                                    Review Information
                                </h3>

                                <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4">
                                    {purchaseOrder.approver && (
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Reviewed By
                                            </p>

                                            <div className="mt-1">
                                                <p className="text-sm font-medium text-slate-800">
                                                    {
                                                        purchaseOrder
                                                            .approver
                                                            .name
                                                    }
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    {
                                                        purchaseOrder
                                                            .approver
                                                            .email
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {purchaseOrder.approved_at && (
                                        <div className="mt-4">
                                            <p className="text-xs text-slate-500">
                                                Reviewed At
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-slate-800">
                                                {formatDateTime(
                                                    purchaseOrder.approved_at
                                                )}
                                            </p>
                                        </div>
                                    )}

                                    {purchaseOrder.rejection_reason && (
                                        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
                                            <p className="text-xs font-medium text-red-700">
                                                Rejection Reason
                                            </p>

                                            <p className="mt-1 whitespace-pre-wrap text-sm text-red-800">
                                                {
                                                    purchaseOrder.rejection_reason
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Requested Items */}
                        <section>
                            <h3 className="mb-3 text-sm font-semibold text-slate-900">
                                Requested Items
                            </h3>

                            <div className="overflow-hidden rounded-md border border-slate-200">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-blue-100 bg-blue-50">
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900">
                                                    Product
                                                </th>

                                                <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900">
                                                    SKU
                                                </th>

                                                <th className="px-4 py-3 text-left text-xs font-semibold text-blue-900">
                                                    Unit
                                                </th>

                                                <th className="px-4 py-3 text-right text-xs font-semibold text-blue-900">
                                                    Quantity
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {purchaseOrder.items.map(
                                                (
                                                    item
                                                ) => (
                                                    <tr
                                                        key={
                                                            item.id
                                                        }
                                                        className="border-b border-slate-200 last:border-b-0"
                                                    >
                                                        <td className="px-4 py-3 font-medium text-slate-800">
                                                            {item
                                                                .product
                                                                ?.name ??
                                                                "—"}
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

                                                        <td className="px-4 py-3 text-right font-medium text-slate-800">
                                                            {
                                                                item.quantity
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        {/* Delivery Information */}
                        {(
                            purchaseOrder.delivery_type ||
                            purchaseOrder.ship_out_date ||
                            purchaseOrder.date_of_arrival
                        ) && (
                            <section>
                                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                                    <CalendarDays className="h-4 w-4 text-blue-600" />

                                    Delivery Information
                                </h3>

                                <div className="grid gap-4 rounded-md border border-blue-100 bg-blue-50/40 p-4 sm:grid-cols-3">
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Delivery Type
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {getDeliveryTypeLabel(
                                                purchaseOrder.delivery_type
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Ship Out Date
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {formatDate(
                                                purchaseOrder.ship_out_date
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Date of Arrival
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {formatDate(
                                                purchaseOrder.date_of_arrival
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Proof of Delivery */}
                        {purchaseOrder.delivery_photo_url && (
                            <section>
                                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                                    Proof of Delivery
                                </h3>

                                <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4">
                                    <p className="text-sm text-slate-600">
                                        A proof of delivery has been uploaded for this purchase order.
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* Notes */}
                        {purchaseOrder.notes && (
                            <section>
                                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                                    Notes
                                </h3>

                                <div className="rounded-md border border-slate-200 bg-slate-50/50 p-4">
                                    <p className="whitespace-pre-wrap text-sm text-slate-700">
                                        {
                                            purchaseOrder.notes
                                        }
                                    </p>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Actions */}
                    <DialogFooter className="shrink-0 border-t border-blue-100 bg-blue-50/60 pt-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                onOpenChange(
                                    false
                                )
                            }
                            disabled={
                                actionLoading
                            }
                            className="rounded-sm border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        >
                            Close
                        </Button>

                        {showPrint && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={
                                    handlePrintPO
                                }
                                disabled={
                                    actionLoading
                                }
                                className="rounded-sm border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                            >
                                <Printer className="h-4 w-4" />
                                Print PO
                            </Button>
                        )}

                        {showDeliveryReceipt && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={
                                    handlePrintDeliveryReceipt
                                }
                                disabled={
                                    actionLoading
                                }
                                className="rounded-sm border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                            >
                                <Printer className="h-4 w-4" />
                                Print Delivery Receipt
                            </Button>
                        )}

                        {showProcessAction && (
                            <Button
                                type="button"
                                onClick={
                                    onProcess
                                }
                                disabled={
                                    actionLoading
                                }
                                className="rounded-sm bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <PackageCheck className="h-4 w-4" />

                                {processing
                                    ? "Preparing..."
                                    : "Prepare Purchase Order"}
                            </Button>
                        )}

                        {showReleaseAction && (
                            <Button
                                type="button"
                                onClick={
                                    onRelease
                                }
                                disabled={
                                    actionLoading
                                }
                                className="rounded-sm bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <Truck className="h-4 w-4" />

                                {releasing
                                    ? "Releasing..."
                                    : "Out for Delivery"}
                            </Button>
                        )}

                        {showCompleteAction && (
                            <Button
                                type="button"
                                onClick={
                                    onComplete
                                }
                                disabled={
                                    actionLoading
                                }
                                className="rounded-sm bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                <BadgeCheck className="h-4 w-4" />

                                {completing
                                    ? "Completing..."
                                    : "Complete Purchase Order"}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ===================================================== */}
            {/* PRINT VIEWS */}
            {/* ===================================================== */}

            {printMode === "po" && (
                <PurchaseOrderPrintView
                    purchaseOrder={purchaseOrder}
                    printMode="po"
                />
            )}
            
            {printMode === "delivery-receipt" && (
                <PurchaseOrderDeliveryReceiptPrintView
                    purchaseOrder={purchaseOrder}
                    printMode="delivery-receipt"
                />
            )}
        </>
    );
}