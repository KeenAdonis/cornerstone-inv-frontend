"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import type {
    Product,
} from "@/src/services/productService";

interface ViewProductDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ViewProductDialog({
    product,
    open,
    onOpenChange,
}: ViewProductDialogProps) {
    if (!product) {
        return null;
    }

    const statusConfig = {
        active: {
            label: "Active",
            className:
                "border-green-200 bg-green-50 text-green-700",
        },
        inactive: {
            label: "Inactive",
            className:
                "border-slate-200 bg-slate-100 text-slate-600",
        },
    } as const;

    const status =
        statusConfig[product.status];

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="border-blue-100 bg-white text-slate-900 sm:max-w-lg">
                <DialogHeader className="border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Product Details
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        View product information and
                        status.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    {/* Product Name */}
                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Product Name
                        </p>

                        <p className="mt-1.5 text-sm font-semibold text-slate-900">
                            {product.name}
                        </p>
                    </div>

                    {/* Product Code and SKU */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Product Code
                            </p>

                            <p className="mt-1.5 text-sm font-medium text-slate-900">
                                {product.product_code ||
                                    "—"}
                            </p>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                SKU
                            </p>

                            <p className="mt-1.5 text-sm font-medium text-slate-900">
                                {product.sku}
                            </p>
                        </div>
                    </div>

                    {/* Category and Unit */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Category
                            </p>

                            <p className="mt-1.5 text-sm font-medium text-slate-900">
                                {product.category?.name ??
                                    "Uncategorized"}
                            </p>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Unit
                            </p>

                            <p className="mt-1.5 text-sm font-medium text-slate-900">
                                {product.unit}
                            </p>
                        </div>
                    </div>

                    {/* Suggested Retail Price */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Suggested Retail Price
                        </p>

                        <p className="mt-1.5 text-sm font-semibold text-slate-900">
                            ₱
                            {Number(
                                product.srp
                            ).toLocaleString(
                                "en-PH",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}
                        </p>
                    </div>

                    {/* Description */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Description
                        </p>

                        <p className="mt-1.5 text-sm text-slate-700">
                            {product.description ||
                                "No description provided."}
                        </p>
                    </div>

                    {/* Status */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Status
                        </p>

                        <div className="mt-2">
                            <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                            >
                                <span
                                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                        product.status ===
                                        "active"
                                            ? "bg-green-500"
                                            : "bg-slate-400"
                                    }`}
                                />

                                {status.label}
                            </span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}