"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    Check,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { toast } from "@/components/ui/toast";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import RejectPurchaseOrderDialog from "@/src/components/admin/purchase-orders/RejectPurchaseOrderDialog";

import { useReviewPurchaseOrder } from "@/src/hooks/purchase-orders/useReviewPurchaseOrder";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

interface ReviewPurchaseOrderDialogProps {
    purchaseOrder: PurchaseOrder | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onReviewed?: () => void;
}

export default function ReviewPurchaseOrderDialog({
    purchaseOrder,
    open,
    onOpenChange,
    onReviewed,
}: ReviewPurchaseOrderDialogProps) {
    const {
        review,
        loading,
    } = useReviewPurchaseOrder();

    const [
        rejectDialogOpen,
        setRejectDialogOpen,
    ] = useState(false);

    useEffect(() => {
        if (!open) {
            setRejectDialogOpen(false);
        }
    }, [open]);

    if (!purchaseOrder) {
        return null;
    }

    const handleApprove = async () => {
        const response = await review(
            purchaseOrder.id,
            {
                action: "approve",
            },
        );

        if (!response) {
            return;
        }
        
        toast.add({
            title: "Purchase Order Approved",
            description:
                "Purchase order has been approved successfully.",
            type: "success",
        });
        
        onReviewed?.();
        
        onOpenChange(false);
    };

    const isPending =
        purchaseOrder.status === "pending";

    return (
        <>
            <Dialog
                open={open}
                onOpenChange={(value) => {
                    if (!loading) {
                        onOpenChange(value);
                    }
                }}
            >
                <DialogContent className="flex max-h-[94vh] flex-col border-blue-100 bg-white text-slate-900 sm:max-w-2xl">
                    {/* Header */}
                    <DialogHeader className="shrink-0 border-b border-blue-100 pb-4">
                        <DialogTitle className="text-slate-900">
                            Review Purchase Order
                        </DialogTitle>

                        <DialogDescription className="text-slate-500">
                            Review the request before approving or rejecting it.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Scrollable Content */}
                    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {/* Purchase Order Summary */}
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Reference
                                    </p>

                                    <p className="mt-1 font-mono text-sm font-medium text-slate-800">
                                        {
                                            purchaseOrder.reference_number
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Status
                                    </p>

                                    <span className="mt-1 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                                        {purchaseOrder.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            purchaseOrder.status.slice(
                                                1,
                                            )}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Branch
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-800">
                                        {
                                            purchaseOrder
                                                .branch
                                                ?.name
                                        }
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {
                                            purchaseOrder
                                                .branch
                                                ?.code
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Warehouse
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-800">
                                        {
                                            purchaseOrder
                                                .warehouse
                                                ?.name
                                        }
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {
                                            purchaseOrder
                                                .warehouse
                                                ?.code
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Created By
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-800">
                                        {
                                            purchaseOrder
                                                .creator
                                                ?.name
                                        }
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {
                                            purchaseOrder
                                                .creator
                                                ?.email
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Requested At
                                    </p>

                                    <p className="mt-1 text-sm text-slate-700">
                                        {new Date(
                                            purchaseOrder.requested_at,
                                        ).toLocaleString(
                                            "en-PH",
                                            {
                                                dateStyle:
                                                    "medium",
                                                timeStyle:
                                                    "short",
                                            },
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Requested Items */}
                        <div className="space-y-3">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800">
                                    Requested Items
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Review the products and requested quantities.
                                </p>
                            </div>

                            <div className="overflow-hidden rounded-lg border border-slate-200">
                                <div className="grid grid-cols-[minmax(0,1fr)_100px] border-b border-blue-100 bg-blue-50 px-4 py-2.5 text-xs font-medium text-blue-900">
                                    <span>
                                        Product
                                    </span>

                                    <span className="text-right">
                                        Quantity
                                    </span>
                                </div>

                                <div className="divide-y divide-slate-200">
                                    {purchaseOrder.items.map(
                                        (item) => (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="grid grid-cols-[minmax(0,1fr)_100px] gap-3 px-4 py-3"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-slate-800">
                                                        {
                                                            item
                                                                .product
                                                                ?.name
                                                        }
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {
                                                            item
                                                                .product
                                                                ?.sku
                                                        }{" "}
                                                        ·{" "}
                                                        {
                                                            item
                                                                .product
                                                                ?.unit
                                                        }
                                                    </p>
                                                </div>

                                                <p className="text-right text-sm font-medium text-slate-700">
                                                    {
                                                        item.quantity
                                                    }
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {purchaseOrder.notes && (
                            <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Notes
                                </p>

                                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                                    {
                                        purchaseOrder.notes
                                    }
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <DialogFooter className="shrink-0 border-t border-blue-100 bg-blue-50/60 pt-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                onOpenChange(false)
                            }
                            disabled={loading}
                            className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </Button>

                        {isPending && (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setRejectDialogOpen(
                                            true,
                                        )
                                    }
                                    disabled={loading}
                                    className="border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    <X className="h-4 w-4" />

                                    Reject
                                </Button>

                                <Button
                                    type="button"
                                    onClick={
                                        handleApprove
                                    }
                                    disabled={loading}
                                    className="bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                                >
                                    <Check className="h-4 w-4" />

                                    {loading
                                        ? "Processing..."
                                        : "Approve"}
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <RejectPurchaseOrderDialog
                purchaseOrder={purchaseOrder}
                open={rejectDialogOpen}
                onOpenChange={
                    setRejectDialogOpen
                }
                onRejected={() => {
                    onReviewed?.();
                    onOpenChange(false);
                }}
            />
        </>
    );
}