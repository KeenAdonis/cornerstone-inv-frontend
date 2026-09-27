"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
    ExternalLink,
    Image as ImageIcon,
} from "lucide-react";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

interface ViewPurchaseOrderAttachmentDialogProps {
    purchaseOrder: PurchaseOrder | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ViewPurchaseOrderAttachmentDialog({
    purchaseOrder,
    open,
    onOpenChange,
}: ViewPurchaseOrderAttachmentDialogProps) {
    if (!purchaseOrder) {
        return null;
    }

    const attachmentUrl =
        purchaseOrder.delivery_photo_url;

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="flex max-h-[90vh] flex-col border-blue-100 bg-white text-slate-900 sm:max-w-3xl">
                {/* Header */}
                <DialogHeader className="shrink-0 border-b border-blue-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                            <ImageIcon className="h-5 w-5" />
                        </div>

                        <div>
                            <DialogTitle className="text-lg text-slate-900">
                                Delivery Proof
                            </DialogTitle>

                            <DialogDescription className="mt-1 text-slate-500">
                                Delivery attachment for{" "}
                                <span className="font-mono font-medium text-slate-700">
                                    {
                                        purchaseOrder.reference_number
                                    }
                                </span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {attachmentUrl ? (
                        <>
                            <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                                <div className="flex min-h-64 max-h-[55vh] items-center justify-center overflow-hidden p-4">
                                    <img
                                        src={
                                            attachmentUrl
                                        }
                                        alt={`Delivery proof for ${purchaseOrder.reference_number}`}
                                        className="max-h-[52vh] max-w-full rounded-sm object-contain"
                                    />
                                </div>
                            </div>

                            <div className="rounded-md border border-slate-200 bg-slate-50/70 px-4 py-3">
                                <p className="text-xs text-slate-500">
                                    Attachment
                                </p>

                                <p className="mt-1 truncate text-sm font-medium text-slate-700">
                                    Delivery proof
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <ImageIcon className="h-5 w-5" />
                            </div>

                            <p className="mt-3 text-sm font-medium text-slate-700">
                                No delivery proof available
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                This purchase order does not have an uploaded delivery attachment.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="shrink-0 border-t border-blue-100 pt-4">
                    {attachmentUrl && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                window.open(
                                    attachmentUrl,
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                            className="rounded-sm border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Open in New Tab
                        </Button>
                    )}

                    <Button
                        type="button"
                        onClick={() =>
                            onOpenChange(
                                false
                            )
                        }
                        className="rounded-sm bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}