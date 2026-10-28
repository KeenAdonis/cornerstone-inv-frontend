
"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

interface RejectPurchaseOrderDialogProps {
    purchaseOrder: PurchaseOrder | null;
    open: boolean;
    loading?: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (rejectionReason: string) => void;
}

export default function RejectPurchaseOrderDialog({
    purchaseOrder,
    open,
    loading = false,
    onOpenChange,
    onSubmit,
}: RejectPurchaseOrderDialogProps) {
    const [rejectionReason, setRejectionReason] =
        useState("");

    const [validationError, setValidationError] =
        useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setRejectionReason("");
            setValidationError(null);
        }
    }, [open, purchaseOrder]);

    const handleSubmit = () => {
        const trimmedReason = rejectionReason.trim();

        if (!trimmedReason) {
            setValidationError(
                "Please provide a reason for rejecting this purchase order."
            );
            return;
        }

        if (trimmedReason.length > 1000) {
            setValidationError(
                "The rejection reason may not exceed 1000 characters."
            );
            return;
        }

        setValidationError(null);
        onSubmit(trimmedReason);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (loading) {
            return;
        }

        onOpenChange(nextOpen);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent className="border-red-100 bg-white text-slate-900 sm:max-w-md">
                <DialogHeader className="border-b border-red-100 pb-4">
                    <DialogTitle className="flex items-center gap-2 text-slate-900">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Reject Purchase Order
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Provide a reason for rejecting this purchase order during delivery. This action cannot be undone through this dialog.
                    </DialogDescription>
                </DialogHeader>

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

                <div className="space-y-2 py-2">
                    <label
                        htmlFor="purchase-order-rejection-reason"
                        className="text-sm font-medium text-slate-700"
                    >
                        Rejection Reason
                        <span className="ml-1 text-red-600">
                            *
                        </span>
                    </label>

                    <Textarea
                        id="purchase-order-rejection-reason"
                        value={rejectionReason}
                        onChange={(event) => {
                            setRejectionReason(
                                event.target.value
                            );
                            setValidationError(null);
                        }}
                        placeholder="Explain why this purchase order is being rejected..."
                        rows={4}
                        maxLength={1000}
                        disabled={loading}
                    />

                    <p className="text-xs text-slate-500">
                        {rejectionReason.length}/1000 characters
                    </p>

                    {validationError && (
                        <div
                            className="rounded-md border border-red-200 bg-red-50 px-3 py-2"
                            role="alert"
                        >
                            <p className="text-sm text-red-600">
                                {validationError}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t border-red-100 bg-red-50/40 pt-5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="rounded-sm border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !purchaseOrder}
                        className="rounded-sm bg-red-600 text-white hover:bg-red-700"
                    >
                        <AlertTriangle className="h-4 w-4" />

                        {loading
                            ? "Rejecting..."
                            : "Confirm Rejection"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
