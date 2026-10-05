"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

import { X } from "lucide-react";

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

import { useReviewPurchaseOrder } from "@/src/hooks/purchase-orders/useReviewPurchaseOrder";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

interface RejectPurchaseOrderDialogProps {
    purchaseOrder: PurchaseOrder | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRejected?: () => void;
}

export default function RejectPurchaseOrderDialog({
    purchaseOrder,
    open,
    onOpenChange,
    onRejected,
}: RejectPurchaseOrderDialogProps) {
    const [
        rejectionReason,
        setRejectionReason,
    ] = useState("");

    const [
        validationError,
        setValidationError,
    ] = useState<string | null>(null);

    const {
        review,
        loading,
        error,
    } = useReviewPurchaseOrder();

    useEffect(() => {
        if (!open) {
            setRejectionReason("");
            setValidationError(null);
        }
    }, [open]);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!purchaseOrder) {
            return;
        }

        setValidationError(null);

        const reason =
            rejectionReason.trim();

        if (!reason) {
            setValidationError(
                "A rejection reason is required.",
            );

            return;
        }

        const response = await review(
            purchaseOrder.id,
            {
                action: "reject",
                rejection_reason: reason,
            },
        );

        if (!response) {
            return;
        }
        
        toast.add({
            title: "Purchase Order Rejected",
            description:
                "Purchase order has been rejected successfully.",
            type: "success",
        });
        
        onRejected?.();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!loading) {
                    onOpenChange(value);
                }
            }}
        >
            <DialogContent className="border-blue-100 bg-white text-slate-900 sm:max-w-lg">
                <DialogHeader className="border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Reject Purchase Order
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Please provide a reason for rejecting this purchase order.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div className="space-y-2">
                        <label
                            htmlFor="purchase-order-rejection-reason"
                            className="text-sm font-medium text-slate-700"
                        >
                            Reason for Rejection
                        </label>

                        <textarea
                            id="purchase-order-rejection-reason"
                            value={rejectionReason}
                            onChange={(event) =>
                                setRejectionReason(
                                    event.target.value,
                                )
                            }
                            placeholder="Enter the reason for rejecting this purchase order..."
                            disabled={loading}
                            rows={5}
                            autoFocus
                            className="flex w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:ring-1 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        />

                        <p className="text-xs text-slate-500">
                            A rejection reason is required.
                        </p>
                    </div>

                    {(validationError || error) && (
                        <div
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                            role="alert"
                        >
                            {validationError ?? error}
                        </div>
                    )}

                    <DialogFooter className="border-t border-blue-100 bg-blue-50/60 pt-5">
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

                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-red-600 text-white shadow-sm hover:bg-red-700"
                        >
                            <X className="h-4 w-4" />

                            {loading
                                ? "Rejecting..."
                                : "Reject Purchase Order"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}