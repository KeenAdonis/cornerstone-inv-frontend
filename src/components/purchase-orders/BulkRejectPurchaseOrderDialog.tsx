"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, XCircle } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface BulkRejectPurchaseOrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCount: number;
    onConfirm: (rejectionReason: string) => void;
    loading?: boolean;
}

export default function BulkRejectPurchaseOrderDialog({
    open,
    onOpenChange,
    selectedCount,
    onConfirm,
    loading = false,
}: BulkRejectPurchaseOrderDialogProps) {
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        if (!open) {
            setRejectionReason("");
        }
    }, [open]);

    const handleOpenChange = (value: boolean) => {
        if (loading) return;

        onOpenChange(value);
    };

    const handleConfirm = () => {
        const reason = rejectionReason.trim();

        if (loading || selectedCount <= 0 || !reason) {
            return;
        }

        onConfirm(reason);
    };

    const isValid = rejectionReason.trim().length > 0;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="flex max-h-[94vh] flex-col border-blue-100 bg-white text-slate-900 sm:max-w-lg">
                <DialogHeader className="shrink-0 border-b border-blue-100 pb-4">
                    <DialogTitle className="flex items-center gap-2 text-slate-900">
                        <XCircle className="h-5 w-5 text-red-600" />
                        Reject Purchase Orders
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Confirm the rejection of the selected purchase orders.
                    </DialogDescription>
                </DialogHeader>

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="rounded-md border border-red-100 bg-red-50/50 p-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                                <XCircle className="h-5 w-5 text-red-600" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    {selectedCount} purchase order
                                    {selectedCount !== 1 ? "s" : ""} selected
                                </p>

                                <p className="mt-1 text-sm text-slate-600">
                                    The selected purchase order
                                    {selectedCount !== 1 ? "s" : ""} will be moved from{" "}
                                    <span className="font-medium text-amber-700">
                                        Pending
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-medium text-red-700">
                                        Rejected
                                    </span>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="bulk-rejection-reason"
                            className="text-sm font-medium text-slate-900"
                        >
                            Rejection Reason
                            <span className="ml-1 text-red-600">*</span>
                        </label>

                        <Textarea
                            id="bulk-rejection-reason"
                            value={rejectionReason}
                            onChange={(event) =>
                                setRejectionReason(event.target.value)
                            }
                            placeholder="Enter the reason for rejecting the selected purchase orders..."
                            disabled={loading}
                            maxLength={1000}
                            className="min-h-28 resize-none border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                        />

                        <div className="flex items-center justify-between gap-4">
                            <p className="text-xs text-slate-500">
                                This reason will be applied to all selected purchase orders.
                            </p>

                            <span className="shrink-0 text-xs text-slate-400">
                                {rejectionReason.length}/1000
                            </span>
                        </div>
                    </div>

                    <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                            <div>
                                <p className="text-sm font-medium text-amber-800">
                                    Please confirm this action
                                </p>

                                <p className="mt-1 text-sm text-amber-700">
                                    Only pending purchase orders can be rejected.
                                    The rejection reason will be recorded in the purchase
                                    order and activity log.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="shrink-0 border-t border-blue-100 bg-blue-50/60 pt-5">
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
                        onClick={handleConfirm}
                        disabled={
                            loading ||
                            selectedCount <= 0 ||
                            !isValid
                        }
                        className="rounded-sm bg-red-600 text-white hover:bg-red-700"
                    >
                        <XCircle className="h-4 w-4" />

                        {loading
                            ? "Rejecting..."
                            : `Reject ${selectedCount} Purchase Order${
                                  selectedCount !== 1 ? "s" : ""
                              }`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}