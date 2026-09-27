"use client";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

interface PurchaseOrderPrintViewProps {
    purchaseOrder: PurchaseOrder | null;
    printMode?: "po" | "delivery-receipt" | null;
}

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
            month: "long",
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

export default function PurchaseOrderPrintView({
    purchaseOrder,
    printMode = null,
}: PurchaseOrderPrintViewProps) {
    if (!purchaseOrder) {
        return null;
    }

    const isPrintTarget =
        printMode === "po";

    return (
        <>
            <div
                id="purchase-order-print"
                className={
                    isPrintTarget
                        ? "hidden bg-white text-black print:block"
                        : "hidden"
                }
            >
                {/* Document Header */}
                <header className="border-b-2 border-slate-900 pb-4">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-wide text-slate-900">
                                CORNERSTONE
                            </h1>

                            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-600">
                                Internal Inventory System
                            </p>
                        </div>

                        <div className="text-right">
                            <h2 className="text-xl font-bold uppercase text-slate-900">
                                Purchase Order Request
                            </h2>

                            <p className="mt-1 font-mono text-sm font-semibold text-slate-700">
                                {
                                    purchaseOrder.reference_number
                                }
                            </p>
                        </div>
                    </div>
                </header>

                {/* Document Information */}
                <section className="mt-5">
                    <div className="grid grid-cols-2 gap-x-10 gap-y-4 border border-slate-300 p-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                Status
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {getStatusLabel(
                                    purchaseOrder.status
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                Requested At
                            </p>

                            <p className="mt-1 text-sm text-slate-900">
                                {formatDateTime(
                                    purchaseOrder.requested_at
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                Requested By
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {
                                    purchaseOrder
                                        .creator
                                        ?.name ??
                                    "—"
                                }
                            </p>

                            {purchaseOrder.creator
                                ?.email && (
                                <p className="mt-0.5 text-xs text-slate-600">
                                    {
                                        purchaseOrder
                                            .creator
                                            .email
                                    }
                                </p>
                            )}
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                Branch
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {
                                    purchaseOrder
                                        .branch
                                        ?.name ??
                                    "—"
                                }
                            </p>

                            {purchaseOrder.branch
                                ?.code && (
                                <p className="mt-0.5 text-xs text-slate-600">
                                    {
                                        purchaseOrder
                                            .branch
                                            .code
                                    }
                                </p>
                            )}
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                Warehouse
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {
                                    purchaseOrder
                                        .warehouse
                                        ?.name ??
                                    "—"
                                }
                            </p>

                            {purchaseOrder.warehouse
                                ?.code && (
                                <p className="mt-0.5 text-xs text-slate-600">
                                    {
                                        purchaseOrder
                                            .warehouse
                                            .code
                                    }
                                </p>
                            )}
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                Printed Date
                            </p>

                            <p className="mt-1 text-sm text-slate-900">
                                {formatDate(
                                    new Date()
                                        .toISOString()
                                        .slice(
                                            0,
                                            10
                                        )
                                )}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Requested Items */}
                <section className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
                            Requested Items
                        </h3>

                        <p className="text-xs text-slate-500">
                            {
                                purchaseOrder
                                    .items
                                    .length
                            }{" "}
                            item
                            {purchaseOrder
                                .items
                                .length !==
                            1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                    <table className="w-full border-collapse border border-slate-300 text-sm">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="w-10 border border-slate-300 px-3 py-2 text-center text-xs font-bold text-slate-800">
                                    #
                                </th>

                                <th className="border border-slate-300 px-3 py-2 text-left text-xs font-bold text-slate-800">
                                    Product
                                </th>

                                <th className="w-32 border border-slate-300 px-3 py-2 text-left text-xs font-bold text-slate-800">
                                    SKU
                                </th>

                                <th className="w-20 border border-slate-300 px-3 py-2 text-left text-xs font-bold text-slate-800">
                                    Unit
                                </th>

                                <th className="w-24 border border-slate-300 px-3 py-2 text-right text-xs font-bold text-slate-800">
                                    Quantity
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {purchaseOrder.items.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <tr
                                        key={
                                            item.id
                                        }
                                    >
                                        <td className="border border-slate-300 px-3 py-2 text-center text-slate-700">
                                            {index +
                                                1}
                                        </td>

                                        <td className="border border-slate-300 px-3 py-2 font-medium text-slate-900">
                                            {item
                                                .product
                                                ?.name ??
                                                "—"}
                                        </td>

                                        <td className="border border-slate-300 px-3 py-2 font-mono text-xs text-slate-700">
                                            {item
                                                .product
                                                ?.sku ??
                                                "—"}
                                        </td>

                                        <td className="border border-slate-300 px-3 py-2 text-slate-700">
                                            {item
                                                .product
                                                ?.unit ??
                                                "—"}
                                        </td>

                                        <td className="border border-slate-300 px-3 py-2 text-right font-semibold text-slate-900">
                                            {
                                                item.quantity
                                            }
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </section>

                {/* Delivery Information */}
                {(
                    purchaseOrder.delivery_type ||
                    purchaseOrder.ship_out_date ||
                    purchaseOrder.date_of_arrival
                ) && (
                    <section className="mt-6">
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                            Delivery Information
                        </h3>

                        <div className="grid grid-cols-3 gap-5 border border-slate-300 p-4">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                    Delivery Type
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-900">
                                    {getDeliveryTypeLabel(
                                        purchaseOrder.delivery_type
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                    Ship Out Date
                                </p>

                                <p className="mt-1 text-sm text-slate-900">
                                    {formatDate(
                                        purchaseOrder.ship_out_date
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                    Date of Arrival
                                </p>

                                <p className="mt-1 text-sm text-slate-900">
                                    {formatDate(
                                        purchaseOrder.date_of_arrival
                                    )}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Notes */}
                <section className="mt-6">
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                        Notes
                    </h3>

                    <div className="min-h-16 border border-slate-300 p-3">
                        {purchaseOrder.notes ? (
                            <p className="whitespace-pre-wrap text-sm text-slate-800">
                                {
                                    purchaseOrder.notes
                                }
                            </p>
                        ) : (
                            <p className="text-sm italic text-slate-500">
                                No notes provided.
                            </p>
                        )}
                    </div>
                </section>

                {/* Review Information */}
                {(purchaseOrder.approver ||
                    purchaseOrder.approved_at ||
                    purchaseOrder.rejection_reason) && (
                    <section className="mt-6">
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                            Review Information
                        </h3>

                        <div className="border border-slate-300 p-4">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                        Reviewed By
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {
                                            purchaseOrder
                                                .approver
                                                ?.name ??
                                            "—"
                                        }
                                    </p>

                                    {purchaseOrder
                                        .approver
                                        ?.email && (
                                        <p className="mt-0.5 text-xs text-slate-600">
                                            {
                                                purchaseOrder
                                                    .approver
                                                    .email
                                            }
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                        Reviewed At
                                    </p>

                                    <p className="mt-1 text-sm text-slate-900">
                                        {formatDateTime(
                                            purchaseOrder.approved_at
                                        )}
                                    </p>
                                </div>
                            </div>

                            {purchaseOrder.rejection_reason && (
                                <div className="mt-4 border border-red-300 bg-red-50 p-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-wide text-red-700">
                                        Rejection Reason
                                    </p>

                                    <p className="mt-1 whitespace-pre-wrap text-sm text-red-900">
                                        {
                                            purchaseOrder.rejection_reason
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Proof of Delivery */}
                {purchaseOrder.delivery_photo_url && (
                    <section className="mt-6">
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                            Proof of Delivery
                        </h3>

                        <div className="border border-slate-300 p-4">
                            <p className="text-sm text-slate-800">
                                Proof of delivery has been uploaded for this purchase order.
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Date of Arrival:{" "}
                                {formatDate(
                                    purchaseOrder.date_of_arrival
                                )}
                            </p>
                        </div>
                    </section>
                )}

                {/* Signatures */}
                <section className="mt-10">
                    <div className="grid grid-cols-2 gap-16">
                        <div>
                            <div className="h-10 border-b border-slate-500" />

                            <p className="mt-2 text-xs font-semibold uppercase text-slate-700">
                                Requested By
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {
                                    purchaseOrder
                                        .creator
                                        ?.name ??
                                    "—"
                                }
                            </p>
                        </div>

                        <div>
                            <div className="h-10 border-b border-slate-500" />

                            <p className="mt-2 text-xs font-semibold uppercase text-slate-700">
                                Approved / Reviewed By
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {
                                    purchaseOrder
                                        .approver
                                        ?.name ??
                                    "—"
                                }
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-8 border-t border-slate-300 pt-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <p>
                            Cornerstone Internal Inventory System
                        </p>

                        <p>
                            Purchase Order Request
                        </p>
                    </div>
                </footer>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: Letter portrait;
                        margin: 0.5in;
                    }

                    html,
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #ffffff !important;
                    }

                    body * {
                        visibility: hidden;
                    }

                    #purchase-order-print,
                    #purchase-order-print * {
                        visibility: visible;
                    }

                    #purchase-order-print {
                        display: block !important;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        min-height: 10in;
                        background: #ffffff;
                    }

                    #purchase-order-print table {
                        break-inside: auto;
                    }

                    #purchase-order-print tr {
                        break-inside: avoid;
                        break-after: auto;
                    }

                    #purchase-order-print section,
                    #purchase-order-print header,
                    #purchase-order-print footer {
                        break-inside: avoid;
                    }
                }
            `}</style>
        </>
    );
}