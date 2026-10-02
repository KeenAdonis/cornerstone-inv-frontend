"use client";

import {
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface BulkApprovePurchaseOrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    selectedCount: number;

    onConfirm: () => void;
    loading?: boolean;
}

export default function BulkApprovePurchaseOrderDialog({
    open,
    onOpenChange,
    selectedCount,
    onConfirm,
    loading = false,
}: BulkApprovePurchaseOrderDialogProps) {
    const handleOpenChange = (
        value: boolean
    ) => {
        if (loading) {
            return;
        }

        onOpenChange(value);
    };

    const handleConfirm = () => {
        if (
            loading ||
            selectedCount <= 0
        ) {
            return;
        }

        onConfirm();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={
                handleOpenChange
            }
        >
            <DialogContent className="flex max-h-[94vh] flex-col border-blue-100 bg-white text-slate-900 sm:max-w-lg">
                {/* Header */}
                <DialogHeader className="shrink-0 border-b border-blue-100 pb-4">
                    <DialogTitle className="flex items-center gap-2 text-slate-900">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />

                        Approve Purchase Orders
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Confirm the approval of the selected purchase orders.
                    </DialogDescription>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {/* Selection Summary */}
                    <div className="rounded-md border border-blue-100 bg-blue-50/50 p-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    {
                                        selectedCount
                                    }{" "}
                                    purchase order
                                    {selectedCount !==
                                    1
                                        ? "s"
                                        : ""}{" "}
                                    selected
                                </p>

                                <p className="mt-1 text-sm text-slate-600">
                                    The selected purchase order
                                    {selectedCount !==
                                    1
                                        ? "s"
                                        : ""}{" "}
                                    will be moved from{" "}
                                    <span className="font-medium text-amber-700">
                                        Pending
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-medium text-blue-700">
                                        Approved
                                    </span>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Important Notice */}
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                            <div>
                                <p className="text-sm font-medium text-amber-800">
                                    Please confirm this action
                                </p>

                                <p className="mt-1 text-sm text-amber-700">
                                    Only pending purchase orders can be approved. Once approved, they can proceed to the next stage of the purchase order workflow.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="shrink-0 border-t border-blue-100 bg-blue-50/60 pt-5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            onOpenChange(
                                false
                            )
                        }
                        disabled={loading}
                        className="rounded-sm border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={
                            handleConfirm
                        }
                        disabled={
                            loading ||
                            selectedCount <=
                                0
                        }
                        className="rounded-sm bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <CheckCircle2 className="h-4 w-4" />

                        {loading
                            ? "Approving..."
                            : `Approve ${
                                  selectedCount
                              } Purchase Order${
                                  selectedCount !==
                                  1
                                      ? "s"
                                      : ""
                              }`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}