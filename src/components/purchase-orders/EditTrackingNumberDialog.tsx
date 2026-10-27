
"use client";

import {
    useEffect,
    useState,
} from "react";

import { Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

interface EditTrackingNumberDialogProps {
    purchaseOrder: PurchaseOrder | null;
    open: boolean;
    loading?: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (trackingNumber: string | null) => void;
}

export default function EditTrackingNumberDialog({
    purchaseOrder,
    open,
    loading = false,
    onOpenChange,
    onSubmit,
}: EditTrackingNumberDialogProps) {
    const [trackingNumber, setTrackingNumber] =
        useState("");

    const [validationError, setValidationError] =
        useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setTrackingNumber(
                purchaseOrder?.tracking_number ?? ""
            );
            setValidationError(null);
        }
    }, [open, purchaseOrder]);

    const handleSubmit = () => {
        const trimmedTrackingNumber =
            trackingNumber.trim();

        if (trimmedTrackingNumber.length > 255) {
            setValidationError(
                "Tracking number must not exceed 255 characters."
            );
            return;
        }

        setValidationError(null);

        onSubmit(
            trimmedTrackingNumber || null
        );
    };

    const handleOpenChange = (
        nextOpen: boolean
    ) => {
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
            <DialogContent className="border-blue-100 bg-white text-slate-900 sm:max-w-md">
                <DialogHeader className="border-b border-blue-100 pb-4">
                    <DialogTitle className="flex items-center gap-2 text-slate-900">
                        <Truck className="h-5 w-5 text-blue-600" />
                        Edit Tracking Number
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Update the tracking number for this purchase order while it is out for delivery.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {purchaseOrder && (
                        <div className="rounded-md border border-blue-100 bg-blue-50/50 p-3">
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
                            htmlFor="edit-tracking-number"
                            className="text-sm font-medium text-slate-700"
                        >
                            Tracking Number
                            <span className="ml-1 text-xs font-normal text-slate-400">
                                (Optional)
                            </span>
                        </label>

                        <Input
                            id="edit-tracking-number"
                            value={trackingNumber}
                            onChange={(event) => {
                                setTrackingNumber(
                                    event.target.value
                                );
                                setValidationError(null);
                            }}
                            placeholder="Enter tracking number"
                            maxLength={255}
                            disabled={loading}
                            className="border-slate-200 bg-white focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />

                        <p className="text-xs text-slate-500">
                            Leave blank to clear the tracking number.
                        </p>
                    </div>

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

                <DialogFooter className="border-t border-blue-100 bg-blue-50/60 pt-5">
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
                        className="rounded-sm bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Truck className="h-4 w-4" />

                        {loading
                            ? "Saving..."
                            : "Save Tracking Number"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
