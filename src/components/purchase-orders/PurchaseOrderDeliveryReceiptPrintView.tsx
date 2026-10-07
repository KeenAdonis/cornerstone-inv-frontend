"use client";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

interface PurchaseOrderDeliveryReceiptPrintViewProps {
    purchaseOrder: PurchaseOrder | null;
    printMode?: "po" | "delivery-receipt" | null;
}

/*
|--------------------------------------------------------------------------
| Delivery Type
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Date Formatting
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Currency Formatting
|--------------------------------------------------------------------------
*/

const formatCurrency = (
    value: number
): string => {
    return new Intl.NumberFormat(
        "en-PH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    ).format(value);
};

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function PurchaseOrderDeliveryReceiptPrintView({
    purchaseOrder,
    printMode = null,
}: PurchaseOrderDeliveryReceiptPrintViewProps) {
    if (!purchaseOrder) {
        return null;
    }

    const isPrintTarget =
        printMode === "delivery-receipt";

    /*
    |--------------------------------------------------------------------------
    | Receipt Items
    |--------------------------------------------------------------------------
    |
    | Keep the printed receipt compact.
    | Maximum of 20 products/items.
    |
    */

    const receiptItems =
        purchaseOrder.items.slice(
            0,
            20
        );

    /*
    |--------------------------------------------------------------------------
    | Totals
    |--------------------------------------------------------------------------
    */

    const totalQuantity =
        receiptItems.reduce(
            (total, item) =>
                total +
                Number(
                    item.quantity || 0
                ),
            0
        );

    const totalAmount =
        receiptItems.reduce(
            (total, item) => {
                const quantity =
                    Number(
                        item.quantity || 0
                    );

                const srp =
                    Number(
                        item.product?.srp || 0
                    );

                return (
                    total +
                    quantity * srp
                );
            },
            0
        );

    const totalItems =
        receiptItems.length;

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

                <header className="border-b-2 border-slate-900 pb-2.5">
                    <div className="flex items-center justify-between gap-4">

                        {/* LOGOS */}

                        <div className="flex min-w-0 items-center gap-3">
                            {/* Cornerstone Logo */}
                            <div className="flex items-center">
                                <img
                                    src="/business-logo/cornerstone-logo.png"
                                    alt="Cornerstone Multi Sales"
                                    className="h-auto max-h-10 w-auto max-w-[150px] object-contain"
                                />
                            </div>

                            {/* Divider */}
                            <div
                                className="h-9 w-px shrink-0 bg-slate-300"
                                aria-hidden="true"
                            />

                            {/* CandyMix Logo */}
                            <div className="flex items-center">
                                <img
                                    src="/business-logo/candymix-logo.jpg"
                                    alt="CandyMix"
                                    className="h-auto max-h-10 w-auto max-w-[150px] object-contain"
                                />
                            </div>
                        </div>

                        {/* DOCUMENT TITLE */}

                        <div className="shrink-0 text-right">
                            <h2 className="text-lg font-bold uppercase leading-none text-slate-900">
                                Delivery Receipt
                            </h2>

                            <p className="mt-1 text-[8px] font-semibold uppercase tracking-wide text-slate-500">
                                Reference PO
                            </p>

                            <p className="text-xs font-bold leading-tight text-slate-900">
                                {purchaseOrder.reference_number}
                            </p>
                        </div>
                    </div>
                </header>

                {/* ===================================================== */}
                {/* DELIVERY INFORMATION */}
                {/* ===================================================== */}

                <section className="mt-2.5">
                    <div className="grid grid-cols-2 gap-2.5">
                        {/* FROM */}

                        <div className="border border-slate-300 px-2.5 py-2">
                            <p className="text-[8px] font-bold uppercase tracking-wide text-slate-500">
                                From Warehouse
                            </p>

                            <p className="mt-0.5 text-[10px] font-bold leading-tight text-slate-900">
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
                                <p className="mt-0.5 text-[8px] text-slate-600">
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

                        <div className="border border-slate-300 px-2.5 py-2">
                            <p className="text-[8px] font-bold uppercase tracking-wide text-slate-500">
                                Delivered To
                            </p>

                            <p className="mt-0.5 text-[10px] font-bold leading-tight text-slate-900">
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
                                <p className="mt-0.5 text-[8px] text-slate-600">
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

                <section className="mt-2.5">
                    <div className="grid grid-cols-3 gap-x-3 gap-y-2 border border-slate-300 px-2.5 py-2">
                        <div>
                            <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">
                                PO Reference
                            </p>

                            <p className="mt-0.5 text-[9px] font-semibold leading-tight text-slate-900">
                                {
                                    purchaseOrder.reference_number
                                }
                            </p>
                        </div>

                        <div>
                            <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">
                                Delivery Type
                            </p>

                            <p className="mt-0.5 text-[9px] font-medium leading-tight text-slate-900">
                                {getDeliveryTypeLabel(
                                    purchaseOrder.delivery_type
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">
                                Date of Arrival
                            </p>

                            <p className="mt-0.5 text-[9px] font-medium leading-tight text-slate-900">
                                {formatDate(
                                    purchaseOrder.date_of_arrival
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">
                                Ship Out Date
                            </p>

                            <p className="mt-0.5 text-[9px] leading-tight text-slate-900">
                                {formatDate(
                                    purchaseOrder.ship_out_date
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">
                                Requested By
                            </p>

                            <p className="mt-0.5 text-[9px] leading-tight text-slate-900">
                                {
                                    purchaseOrder
                                        .creator
                                        ?.name ??
                                    "—"
                                }
                            </p>
                        </div>

                        <div>
                            <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-500">
                                Printed Date
                            </p>

                            <p className="mt-0.5 text-[9px] leading-tight text-slate-900">
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

                <section className="mt-3">
                    <div className="mb-1 flex items-center justify-between">
                        <h3 className="text-[9px] font-bold uppercase tracking-wide text-slate-900">
                            Delivered Items
                        </h3>

                        <p className="text-[8px] text-slate-500">
                            {totalItems} item
                            {totalItems !==
                            1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                    <table className="w-full table-fixed border-collapse border border-slate-300">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="w-[4%] border border-slate-300 px-1.5 py-1 text-center text-[8px] font-bold leading-tight text-slate-800">
                                    #
                                </th>

                                <th className="w-[10%] border border-slate-300 px-1.5 py-1 text-right text-[8px] font-bold leading-tight text-slate-800">
                                    Quantity
                                </th>

                                <th className="w-[9%] border border-slate-300 px-1.5 py-1 text-left text-[8px] font-bold leading-tight text-slate-800">
                                    Unit
                                </th>

                                <th className="w-[42%] border border-slate-300 px-1.5 py-1 text-left text-[8px] font-bold leading-tight text-slate-800">
                                    Product
                                </th>

                                <th className="w-[17%] border border-slate-300 px-1.5 py-1 text-left text-[8px] font-bold leading-tight text-slate-800">
                                    Product Code
                                </th>

                                <th className="w-[17%] border border-slate-300 px-1.5 py-1 text-left text-[8px] font-bold leading-tight text-slate-800">
                                    SKU
                                </th>

                                <th className="w-[9%] border border-slate-300 px-1.5 py-1 text-right text-[8px] font-bold leading-tight text-slate-800">
                                    SRP
                                </th>

                                <th className="w-[11%] border border-slate-300 px-1.5 py-1 text-right text-[8px] font-bold leading-tight text-slate-800">
                                    Amount
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {receiptItems.map(
                                (
                                    item,
                                    index
                                ) => {
                                    const quantity =
                                        Number(
                                            item.quantity ||
                                                0
                                        );

                                    const srp =
                                        Number(
                                            item
                                                .product
                                                ?.srp ||
                                                0
                                        );

                                    const amount =
                                        quantity *
                                        srp;

                                    return (
                                        <tr
                                            key={
                                                item.id
                                            }
                                            className="break-inside-avoid"
                                        >
                                            <td className="border border-slate-300 px-1.5 py-[3px] text-center text-[8px] leading-tight text-slate-700">
                                                {index +
                                                    1}
                                            </td>

                                            <td className="border border-slate-300 px-1.5 py-[3px] text-right text-[8px] font-semibold leading-tight text-slate-900">
                                                {
                                                    item.quantity
                                                }
                                            </td>

                                            <td className="border border-slate-300 px-1.5 py-[3px] text-left text-[8px] leading-tight text-slate-700">
                                                {item
                                                    .product
                                                    ?.unit ??
                                                    "—"}
                                            </td>

                                            <td className="overflow-hidden border border-slate-300 px-1.5 py-[3px] text-left text-[8px] font-medium leading-tight text-slate-900">
                                                {item
                                                    .product
                                                    ?.name ??
                                                    "—"}
                                            </td>

                                            <td className="overflow-hidden border border-slate-300 px-1.5 py-[3px] text-left text-[8px] leading-tight text-slate-700">
                                                {item
                                                    .product
                                                    ?.product_code ??
                                                    "—"}
                                            </td>

                                            <td className="overflow-hidden border border-slate-300 px-1.5 py-[3px] text-left text-[8px] leading-tight text-slate-700">
                                                {item
                                                    .product
                                                    ?.sku ??
                                                    "—"}
                                            </td>

                                            <td className="border border-slate-300 px-1.5 py-[3px] text-right text-[8px] leading-tight text-slate-800">
                                                {formatCurrency(
                                                    srp
                                                )}
                                            </td>

                                            <td className="border border-slate-300 px-1.5 py-[3px] text-right text-[8px] font-semibold leading-tight text-slate-900">
                                                {formatCurrency(
                                                    amount
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>

                        <tfoot>
                            <tr>
                                <td
                                    colSpan={2}
                                    className="border border-slate-300 px-1.5 py-1 text-right text-[8px] font-bold uppercase leading-tight text-slate-700"
                                >
                                    Total Quantity
                                </td>

                                <td className="border border-slate-300 px-1.5 py-1 text-right text-[8px] font-bold leading-tight text-slate-900">
                                    {
                                        totalQuantity
                                    }
                                </td>

                                <td
                                    colSpan={4}
                                    className="border border-slate-300 px-1.5 py-1 text-right text-[8px] font-bold uppercase leading-tight text-slate-700"
                                >
                                    Total Amount
                                </td>

                                <td className="border border-slate-300 px-1.5 py-1 text-right text-[9px] font-bold leading-tight text-slate-900">
                                    ₱{" "}
                                    {formatCurrency(
                                        totalAmount
                                    )}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </section>

                {/* ===================================================== */}
                {/* DELIVERY NOTES */}
                {/* ===================================================== */}

                <section className="mt-2.5">
                    <h3 className="mb-1 text-[9px] font-bold uppercase tracking-wide text-slate-900">
                        Delivery Notes
                    </h3>

                    <div className="min-h-10 border border-slate-300 px-2.5 py-1.5">
                        {purchaseOrder.notes ? (
                            <p className="whitespace-pre-wrap text-[8px] leading-4 text-slate-800">
                                {
                                    purchaseOrder.notes
                                }
                            </p>
                        ) : (
                            <p className="text-[8px] italic leading-4 text-slate-500">
                                No delivery notes
                                provided.
                            </p>
                        )}
                    </div>
                </section>

                {/* ===================================================== */}
                {/* PROOF OF DELIVERY */}
                {/* ===================================================== */}

                {purchaseOrder.delivery_photo_url && (
                    <section className="mt-2.5">
                        <h3 className="mb-1 text-[9px] font-bold uppercase tracking-wide text-slate-900">
                            Proof of Delivery
                        </h3>

                        <div className="border border-slate-300 px-2.5 py-1.5">
                            <p className="text-[8px] leading-4 text-slate-800">
                                Proof of delivery
                                has been uploaded
                                for this delivery.
                            </p>

                            <p className="text-[8px] leading-4 text-slate-500">
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

                <section className="mt-5">
                    <div className="grid grid-cols-2 gap-16">
                        {/* DELIVERED BY */}

                        <div>
                            <div className="h-7 border-b border-slate-500" />

                            <p className="mt-1 text-[8px] font-semibold uppercase leading-tight text-slate-700">
                                Delivered By
                            </p>

                            <p className="mt-0.5 text-[7px] leading-tight text-slate-500">
                                Warehouse /
                                Delivery Personnel
                            </p>

                            <p className="mt-2 text-[7px] leading-tight text-slate-500">
                                Date:
                                ____________________
                            </p>
                        </div>

                        {/* RECEIVED BY */}

                        <div>
                            <div className="h-7 border-b border-slate-500" />

                            <p className="mt-1 text-[8px] font-semibold uppercase leading-tight text-slate-700">
                                Received By
                            </p>

                            <p className="mt-0.5 text-[7px] leading-tight text-slate-500">
                                Branch Representative
                            </p>

                            <p className="mt-2 text-[7px] leading-tight text-slate-500">
                                Date:
                                ____________________
                            </p>
                        </div>
                    </div>
                </section>

                {/* ===================================================== */}
                {/* ACKNOWLEDGEMENT */}
                {/* ===================================================== */}

                <section className="mt-3 border border-slate-300 px-2.5 py-1.5">
                    <p className="text-[7px] leading-3.5 text-slate-700">
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

                <footer className="mt-3 border-t border-slate-300 pt-1.5">
                    <div className="flex items-center justify-between text-[7px] leading-tight text-slate-500">
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
                        margin: 0.4in;
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
                        min-height: 9.5in;
                        background: #ffffff;
                        color: #000000;

                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;
                    }

                    #delivery-receipt-print table {
                        width: 100%;
                        border-collapse: collapse;
                        break-inside: auto;
                    }

                    #delivery-receipt-print thead {
                        display: table-header-group;
                    }

                    #delivery-receipt-print tfoot {
                        display: table-footer-group;
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

                    #delivery-receipt-print th,
                    #delivery-receipt-print td {
                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;
                    }

                    #delivery-receipt-print img {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            `}</style>
        </>
    );
}