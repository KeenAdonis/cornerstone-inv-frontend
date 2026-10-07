"use client";

import {
    useState,
} from "react";

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

interface DeliveryProofItem {
    id: string;
    url: string;
    fileName: string;
}

export default function ViewPurchaseOrderAttachmentDialog({
    purchaseOrder,
    open,
    onOpenChange,
}: ViewPurchaseOrderAttachmentDialogProps) {
    const [
        selectedProof,
        setSelectedProof,
    ] = useState<DeliveryProofItem | null>(
        null
    );

    if (!purchaseOrder) {
        return null;
    }

    const deliveryAttachments =
        purchaseOrder.delivery_attachments ??
        [];

    const proofs: DeliveryProofItem[] =
        deliveryAttachments.length > 0
            ? deliveryAttachments
                  .filter(
                      (attachment) =>
                          Boolean(
                              attachment.file_url
                          )
                  )
                  .map(
                      (attachment) => ({
                          id: String(
                              attachment.id
                          ),
                          url:
                              attachment.file_url,
                          fileName:
                              attachment.file_name,
                      })
                  )
            : purchaseOrder.delivery_photo_url
              ? [
                    {
                        id: "legacy-delivery-photo",
                        url:
                            purchaseOrder.delivery_photo_url,
                        fileName:
                            "Delivery proof",
                    },
                ]
              : [];

    const handleOpenProof = (
        proof: DeliveryProofItem
    ) => {
        setSelectedProof(proof);
    };

    const handleOpenInNewTab = () => {
        if (!selectedProof) {
            return;
        }

        window.open(
            selectedProof.url,
            "_blank",
            "noopener,noreferrer"
        );
    };

    const handleClose = () => {
        setSelectedProof(null);
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    setSelectedProof(null);
                }

                onOpenChange(nextOpen);
            }}
        >
            <DialogContent className="flex max-h-[90vh] flex-col border-blue-100 bg-white text-slate-900 sm:max-w-4xl">
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
                                Delivery attachments for{" "}
                                <span className="font-medium text-slate-700">
                                    {
                                        purchaseOrder.reference_number
                                    }
                                </span>
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {proofs.length > 0 ? (
                        <div className="space-y-4">
                            {/* Selected Preview */}
                            {selectedProof && (
                                <div className="overflow-hidden rounded-md border border-blue-100 bg-slate-50">
                                    <div className="flex min-h-64 max-h-[50vh] items-center justify-center overflow-hidden p-4">
                                        <img
                                            src={
                                                selectedProof.url
                                            }
                                            alt={
                                                selectedProof.fileName
                                            }
                                            className="max-h-[46vh] max-w-full rounded-sm object-contain"
                                        />
                                    </div>

                                    <div className="border-t border-slate-200 bg-white px-4 py-3">
                                        <p className="truncate text-sm font-medium text-slate-700">
                                            {
                                                selectedProof.fileName
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Attachment List */}
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Attachments
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {
                                            proofs.length
                                        }{" "}
                                        {proofs.length ===
                                        1
                                            ? "file"
                                            : "files"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {proofs.map(
                                        (
                                            proof,
                                            index
                                        ) => {
                                            const isSelected =
                                                selectedProof?.id ===
                                                proof.id;

                                            return (
                                                <button
                                                    key={
                                                        proof.id
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleOpenProof(
                                                            proof
                                                        )
                                                    }
                                                    className={`group overflow-hidden rounded-md border bg-white text-left transition ${
                                                        isSelected
                                                            ? "border-blue-500 ring-2 ring-blue-100"
                                                            : "border-slate-200 hover:border-blue-300"
                                                    }`}
                                                >
                                                    <div className="flex aspect-square items-center justify-center overflow-hidden bg-slate-50">
                                                        <img
                                                            src={
                                                                proof.url
                                                            }
                                                            alt={
                                                                proof.fileName
                                                            }
                                                            className="h-full w-full object-contain transition group-hover:scale-[1.02]"
                                                        />
                                                    </div>

                                                    <div className="border-t border-slate-200 px-3 py-2">
                                                        <p className="truncate text-xs font-medium text-slate-700">
                                                            {
                                                                proof.fileName
                                                            }
                                                        </p>

                                                        <p className="mt-0.5 text-[11px] text-slate-400">
                                                            Proof{" "}
                                                            {index +
                                                                1}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        </div>
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
                    {selectedProof && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={
                                handleOpenInNewTab
                            }
                            className="rounded-sm border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Open in New Tab
                        </Button>
                    )}

                    <Button
                        type="button"
                        onClick={handleClose}
                        className="rounded-sm bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}