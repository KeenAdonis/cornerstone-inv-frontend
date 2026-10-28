
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

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

import {
    rejectPurchaseOrderDuringDelivery,
} from "@/src/services/purchaseOrderService";

interface RejectPurchaseOrderDuringDeliveryDialogProps {
    purchaseOrder: PurchaseOrder | null;
    open: boolean;
    loading?: boolean;
    onOpenChange: (open: boolean) => void;
    onRejected?: (purchaseOrder: PurchaseOrder) => void;
}

export default function RejectPurchaseOrderDuringDeliveryDialog({
    purchaseOrder,
    open,
    loading = false,
    onOpenChange,
    onRejected,
}: RejectPurchaseOrderDuringDeliveryDialogProps) {
    const [
        rejectionReason,
        setRejectionReason,
    ] = useState("");

    const [
        validationError,
        setValidationError,
    ] = useState<string | null>(null);

    const [
        submitting,
        setSubmitting,
    ] = useState(false);

    const isLoading = loading || submitting;

    useEffect(() => {
        if (!open) {
            setRejectionReason("");
            setValidationError(null);
        }
    }, [open, purchaseOrder]);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!purchaseOrder || isLoading) {
            return;
        }

        const reason = rejectionReason.trim();

        if (!reason) {
            setValidationError(
                "A rejection reason is required."
            );
            return;
        }

        if (reason.length > 1000) {
            setValidationError(
                "The rejection reason may not exceed 1000 characters."
            );
            return;
        }

        setValidationError(null);
        setSubmitting(true);

        try {
            const updatedPurchaseOrder =
                await rejectPurchaseOrderDuringDelivery(
                    purchaseOrder.id,
                    reason
                );

            toast.add({
                title: "Purchase Order Rejected",
                description:
                    "Purchase order has been rejected successfully.",
                type: "success",
            });

            onOpenChange(false);
            onRejected?.(updatedPurchaseOrder);
        } catch (error) {
            toast.add({
                title: "Rejection Failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to reject purchase order.",
                type: "error",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!isLoading) {
                    onOpenChange(value);
                }
            }}
        >
            <DialogContent className="border-red-100 bg-white text-slate-900 sm:max-w-lg">
                <DialogHeader className="border-b border-red-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Reject Purchase Order
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Provide a reason for rejecting this purchase order while it is out for delivery.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {purchaseOrder && (
                        <div className="rounded-md border border-red-100 bg-red-50/50 p-3">
                            <p className="text-xs text-slate-500">
                                Purchase Order
                            </p>

                            <p className="mt-1 font-mono text-sm font-medium text-slate-800">
                                {purchaseOrder.reference_number}
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label
                            htmlFor="warehouse-rejection-reason"
                            className="text-sm font-medium text-slate-700"
                        >
                            Reason for Rejection
                            <span className="ml-1 text-red-600">
                                *
                            </span>
                        </label>

                        <textarea
                            id="warehouse-rejection-reason"
                            value={rejectionReason}
                            onChange={(event) => {
                                setRejectionReason(
                                    event.target.value
                                );
                                setValidationError(null);
                            }}
                            placeholder="Enter the reason for rejecting this purchase order..."
                            disabled={isLoading}
                            rows={5}
                            maxLength={1000}
                            autoFocus
                            className="flex w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:ring-1 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        />

                        <div className="flex justify-between gap-3">
                            <p className="text-xs text-slate-500">
                                A rejection reason is required.
                            </p>

                            <p className="shrink-0 text-xs text-slate-500">
                                {rejectionReason.length}/1000
                            </p>
                        </div>
                    </div>

                    {validationError && (
                        <div
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                            role="alert"
                        >
                            {validationError}
                        </div>
                    )}

                    <DialogFooter className="border-t border-red-100 bg-red-50/40 pt-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                            className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={isLoading || !purchaseOrder}
                            className="bg-red-600 text-white shadow-sm hover:bg-red-700"
                        >
                            <X className="h-4 w-4" />

                            {isLoading
                                ? "Rejecting..."
                                : "Reject Purchase Order"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
