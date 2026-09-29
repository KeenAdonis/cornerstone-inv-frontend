"use client";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

interface PurchaseOrderDeliveryReceiptPrintViewProps {
    purchaseOrder: PurchaseOrder | null;
    printMode?: "po" | "delivery-receipt" | null;
}

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

export default function PurchaseOrderDeliveryReceiptPrintView({
    purchaseOrder,
    printMode = null,
}: PurchaseOrderDeliveryReceiptPrintViewProps) {
    if (!purchaseOrder) {
        return null;
    }

    const isPrintTarget =
        printMode === "delivery-receipt";

    const totalQuantity =
        purchaseOrder.items.reduce(
            (total, item) =>
                total +
                Number(item.quantity || 0),
            0
        );

    const totalItems =
        purchaseOrder.items.length;

    return (
        <>
            <div
                id="delivery-receipt-print"
                className={
                    isPrintTarget
                        ? "hidden bg-white text-black print:block"
                        : "hidden"
                }
            >
                {/* ===================================================== */}
                {/* HEADER */}
                {/* ===================================================== */}

                <header className="border-b-2 border-slate-900 pb-4">
                    <div className="flex items-center justify-between gap-6">
                        {/* ================================================= */}
                        {/* LOGOS */}
                        {/* ================================================= */}

                        <div className="flex min-w-0 items-center gap-3">
                            {/* Logo 1 */}
                            <div className="flex h-14 w-auto shrink-0 items-center">
                                <img
                                    src="/business-logo/cornerstone-logo.png"
                                    alt="Company Logo"
                                    className="max-h-14 w-auto max-w-[150px] object-contain"
                                />
                            </div>

                            {/* Divider */}
                            <div className="h-10 w-px shrink-0 bg-slate-300" />

                            {/* Logo 2 */}
                            <div className="flex h-14 w-auto shrink-0 items-center">
                                <img
                                    src="/business-logo/candymix-logo.jpg"
                                    alt="Company Logo"
                                    className="max-h-14 w-auto max-w-[150px] object-contain"
                                />
                            </div>
                        </div>

                        {/* ================================================= */}
                        {/* DOCUMENT TITLE */}
                        {/* ================================================= */}

                        <div className="shrink-0 text-right">
                            <h2 className="text-xl font-bold uppercase text-slate-900">
                                Delivery Receipt
                            </h2>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                                Reference PO
                            </p>

                            <p className="font-mono text-sm font-bold text-slate-900">
                                {
                                    purchaseOrder.reference_number
                                }
                            </p>
                        </div>
                    </div>
                </header>

                {/* ===================================================== */}
                {/* DELIVERY INFORMATION */}
                {/* ===================================================== */}

                <section className="mt-5">
                    <div className="grid grid-cols-2 gap-5">
                        {/* FROM */}

                        <div className="border border-slate-300 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                From Warehouse
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-900">
                                {
                                    purchaseOrder
                                        .warehouse
                                        ?.name ??
                                    "—"
                                }
                            </p>

                            {purchaseOrder
                                .warehouse
                                ?.code && (
                                <p className="mt-0.5 text-xs text-slate-600">
                                    Code:{" "}
                                    {
                                        purchaseOrder
                                            .warehouse
                                            .code
                                    }
                                </p>
                            )}
                        </div>

                        {/* TO */}

                        <div className="border border-slate-300 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                Delivered To
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-900">
                                {
                                    purchaseOrder
                                        .branch
                                        ?.name ??
                                    "—"
                                }
                            </p>

                            {purchaseOrder
                                .branch
                                ?.code && (
                                <p className="mt-0.5 text-xs text-slate-600">
                                    Code:{" "}
                                    {
                                        purchaseOrder
                                            .branch
                                            .code
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* ===================================================== */}
                {/* DOCUMENT DETAILS */}
                {/* ===================================================== */}

                <section className="mt-5">
                    <div className="grid grid-cols-3 gap-5 border border-slate-300 p-4">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                PO Reference
                            </p>

                            <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                                {
                                    purchaseOrder.reference_number
                                }
                            </p>
                        </div>

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
                                Date of Arrival
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {formatDate(
                                    purchaseOrder.date_of_arrival
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
                                Requested By
                            </p>

                            <p className="mt-1 text-sm text-slate-900">
                                {
                                    purchaseOrder
                                        .creator
                                        ?.name ??
                                    "—"
                                }
                            </p>
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

                {/* ===================================================== */}
                {/* ITEMS */}
                {/* ===================================================== */}

                <section className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
                            Delivered Items
                        </h3>

                        <p className="text-xs text-slate-500">
                            {totalItems} item
                            {totalItems !==
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

                        <tfoot>
                            <tr>
                                <td
                                    colSpan={4}
                                    className="border border-slate-300 px-3 py-2 text-right text-xs font-bold uppercase text-slate-700"
                                >
                                    Total Quantity
                                </td>

                                <td className="border border-slate-300 px-3 py-2 text-right text-sm font-bold text-slate-900">
                                    {
                                        totalQuantity
                                    }
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </section>

                {/* ===================================================== */}
                {/* DELIVERY NOTES */}
                {/* ===================================================== */}

                <section className="mt-6">
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                        Delivery Notes
                    </h3>

                    <div className="min-h-20 border border-slate-300 p-3">
                        {purchaseOrder.notes ? (
                            <p className="whitespace-pre-wrap text-sm text-slate-800">
                                {
                                    purchaseOrder.notes
                                }
                            </p>
                        ) : (
                            <p className="text-sm italic text-slate-500">
                                No delivery notes provided.
                            </p>
                        )}
                    </div>
                </section>

                {/* ===================================================== */}
                {/* PROOF OF DELIVERY */}
                {/* ===================================================== */}

                {purchaseOrder.delivery_photo_url && (
                    <section className="mt-6">
                        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                            Proof of Delivery
                        </h3>

                        <div className="border border-slate-300 p-3">
                            <p className="text-sm text-slate-800">
                                Proof of delivery
                                has been uploaded
                                for this delivery.
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

                {/* ===================================================== */}
                {/* SIGNATURES */}
                {/* ===================================================== */}

                <section className="mt-12">
                    <div className="grid grid-cols-2 gap-20">
                        {/* DELIVERED BY */}

                        <div>
                            <div className="h-10 border-b border-slate-500" />

                            <p className="mt-2 text-xs font-semibold uppercase text-slate-700">
                                Delivered By
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Warehouse /
                                Delivery Personnel
                            </p>

                            <p className="mt-4 text-xs text-slate-500">
                                Date:
                                ____________________
                            </p>
                        </div>

                        {/* RECEIVED BY */}

                        <div>
                            <div className="h-10 border-b border-slate-500" />

                            <p className="mt-2 text-xs font-semibold uppercase text-slate-700">
                                Received By
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Branch Representative
                            </p>

                            <p className="mt-4 text-xs text-slate-500">
                                Date:
                                ____________________
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===================================================== */}
                {/* ACKNOWLEDGEMENT */}
                {/* ===================================================== */}

                <section className="mt-8 border border-slate-300 p-4">
                    <p className="text-xs leading-5 text-slate-700">
                        I acknowledge receipt of
                        the items listed above in
                        good order and in the
                        quantities indicated on this
                        Delivery Receipt.
                    </p>
                </section>

                {/* ===================================================== */}
                {/* FOOTER */}
                {/* ===================================================== */}

                <footer className="mt-8 border-t border-slate-300 pt-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <p>
                            Cornerstone Internal
                            Inventory System
                        </p>

                        <p>
                            Delivery Receipt
                        </p>
                    </div>
                </footer>
            </div>

            {/* ========================================================= */}
            {/* PRINT STYLES */}
            {/* ========================================================= */}

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

                    #delivery-receipt-print,
                    #delivery-receipt-print * {
                        visibility: visible;
                    }

                    #delivery-receipt-print {
                        display: block !important;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        min-height: 10in;
                        background: #ffffff;
                    }

                    #delivery-receipt-print table {
                        break-inside: auto;
                    }

                    #delivery-receipt-print tr {
                        break-inside: avoid;
                        break-after: auto;
                    }

                    #delivery-receipt-print section,
                    #delivery-receipt-print header,
                    #delivery-receipt-print footer {
                        break-inside: avoid;
                    }

                    /*
                     * Keep logos visible when printing.
                     */
                    #delivery-receipt-print img {
                        visibility: visible !important;
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>
        </>
    );
}
