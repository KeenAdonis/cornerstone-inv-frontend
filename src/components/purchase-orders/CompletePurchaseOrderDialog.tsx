"use client";

import {
    type ChangeEvent,
    useEffect,
    useState,
} from "react";

import {
    Camera,
    ImagePlus,
    Upload,
    X,
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

import { format } from "date-fns";

import { DatePicker } from "@/components/ui/date-picker";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

interface CompletePurchaseOrderDialogProps {
    purchaseOrder: PurchaseOrder | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;

    onComplete: (
        files: File[],
        dateOfArrival: string
    ) => Promise<void>;

    completing?: boolean;
    error?: string | null;
}

const MAX_FILE_SIZE =
    5 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export default function CompletePurchaseOrderDialog({
    purchaseOrder,
    open,
    onOpenChange,
    onComplete,
    completing = false,
    error = null,
}: CompletePurchaseOrderDialogProps) {
    const [selectedFiles, setSelectedFiles] =
        useState<File[]>([]);

    const [previewUrls, setPreviewUrls] =
        useState<string[]>([]);

    const [dateOfArrival, setDateOfArrival] =
        useState("");

    const [validationError, setValidationError] =
        useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            setSelectedFiles([]);
            setPreviewUrls([]);
            setDateOfArrival("");
            setValidationError(null);
        }
    }, [open]);

    useEffect(() => {
        const urls = selectedFiles.map((file) =>
            URL.createObjectURL(file)
        );

        setPreviewUrls(urls);

        return () => {
            urls.forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, [selectedFiles]);

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(
            event.target.files ?? []
        );

        // Allow selecting the same file again.
        event.target.value = "";

        if (!files.length) {
            return;
        }

        setValidationError(null);

        const invalidType = files.find(
            (file) =>
                !ACCEPTED_FILE_TYPES.includes(
                    file.type
                )
        );

        if (invalidType) {
            setValidationError(
                `"${invalidType.name}" is not a supported image type. Please use JPG, JPEG, PNG, or WebP.`
            );

            return;
        }

        const oversizedFile = files.find(
            (file) =>
                file.size > MAX_FILE_SIZE
        );

        if (oversizedFile) {
            setValidationError(
                `"${oversizedFile.name}" exceeds the 5 MB file size limit.`
            );

            return;
        }

        setSelectedFiles((currentFiles) => {
            const existingKeys = new Set(
                currentFiles.map(
                    (file) =>
                        `${file.name}-${file.size}-${file.lastModified}`
                )
            );

            const newFiles = files.filter(
                (file) => {
                    const key =
                        `${file.name}-${file.size}-${file.lastModified}`;

                    if (
                        existingKeys.has(
                            key
                        )
                    ) {
                        return false;
                    }

                    existingKeys.add(key);

                    return true;
                }
            );

            return [
                ...currentFiles,
                ...newFiles,
            ];
        });
    };

    const handleRemoveFile = (
        index: number
    ) => {
        setSelectedFiles((currentFiles) =>
            currentFiles.filter(
                (_, fileIndex) =>
                    fileIndex !== index
            )
        );

        setValidationError(null);
    };

    const handleDeliver = async () => {
        if (!dateOfArrival) {
            setValidationError(
                "Please select the date of arrival."
            );

            return;
        }

        if (!selectedFiles.length) {
            setValidationError(
                "Please upload at least one proof of delivery photo."
            );

            return;
        }

        setValidationError(null);

        await onComplete(
            selectedFiles,
            dateOfArrival
        );
    };

    const handleOpenChange = (
        nextOpen: boolean
    ) => {
        if (
            completing &&
            !nextOpen
        ) {
            return;
        }

        onOpenChange(nextOpen);
    };

    if (!purchaseOrder) {
        return null;
    }

    const displayError =
        validationError ??
        error;

    return (
        <Dialog
            open={open}
            onOpenChange={
                handleOpenChange
            }
        >
            <DialogContent className="flex max-h-[90vh] flex-col border-blue-100 bg-white text-slate-900 sm:max-w-lg">
                {/* Header */}
                <DialogHeader className="shrink-0">
                    <DialogTitle className="text-lg text-slate-900">
                        Confirm Delivery
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Upload the proof of delivery and provide the arrival date to confirm that this purchase order has been received by the branch.
                    </DialogDescription>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {/* Purchase Order Reference */}
                    <div className="rounded-md border border-blue-100 bg-blue-50/50 px-4 py-3">
                        <p className="text-xs text-slate-500">
                            Purchase Order
                        </p>

                        <p className="mt-1 font-mono text-sm font-semibold text-slate-800">
                            {
                                purchaseOrder.reference_number
                            }
                        </p>
                    </div>

                    {/* Date of Arrival */}
                    <div className="space-y-2">
                        <label
                            htmlFor="date-of-arrival"
                            className="text-sm font-medium text-slate-800"
                        >
                            Date of Arrival

                            <span className="ml-1 text-red-500">
                                *
                            </span>
                        </label>

                        <DatePicker
                            value={
                                dateOfArrival
                                    ? new Date(
                                          `${dateOfArrival}T00:00:00`
                                      )
                                    : undefined
                            }
                            onChange={(date) => {
                                setDateOfArrival(
                                    date
                                        ? format(
                                              date,
                                              "yyyy-MM-dd"
                                          )
                                        : ""
                                );

                                setValidationError(
                                    null
                                );
                            }}
                            placeholder="Select arrival date"
                            disabled={completing}
                        />

                        <p className="text-xs text-slate-500">
                            Select the date when the delivery actually arrived at the branch.
                        </p>
                    </div>

                    {/* Proof of Delivery */}
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-slate-800">
                                Proof of Delivery

                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Take photos or upload clear images of the delivered items or delivery receipt.
                            </p>
                        </div>

                        {selectedFiles.length ===
                        0 ? (
                            /* Empty State */
                            <div className="rounded-md border border-dashed border-blue-200 bg-blue-50/30 px-5 py-8 text-center">
                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <ImagePlus className="h-5 w-5" />
                                </div>

                                <p className="mt-3 text-sm font-medium text-slate-800">
                                    Add proof of delivery
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    You can upload multiple photos.
                                    JPG, PNG, or WebP · Maximum 5 MB per photo
                                </p>

                                {/* Upload Options */}
                                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
                                    {/* Camera */}
                                    <label
                                        htmlFor="delivery-photo-camera"
                                        className={[
                                            "inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-blue-600 bg-blue-600 px-4 py-2.5 text-xs font-medium text-white shadow-sm transition",
                                            "hover:bg-blue-700",
                                            completing
                                                ? "pointer-events-none opacity-50"
                                                : "",
                                        ].join(
                                            " "
                                        )}
                                    >
                                        <Camera className="h-4 w-4" />

                                        Use Camera

                                        <input
                                            id="delivery-photo-camera"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            capture="environment"
                                            onChange={
                                                handleFileChange
                                            }
                                            disabled={
                                                completing
                                            }
                                            className="sr-only"
                                        />
                                    </label>

                                    {/* Upload */}
                                    <label
                                        htmlFor="delivery-photo"
                                        className={[
                                            "inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-blue-200 bg-white px-4 py-2.5 text-xs font-medium text-blue-700 shadow-sm transition",
                                            "hover:bg-blue-50",
                                            completing
                                                ? "pointer-events-none opacity-50"
                                                : "",
                                        ].join(
                                            " "
                                        )}
                                    >
                                        <Upload className="h-4 w-4" />

                                        Choose Photos

                                        <input
                                            id="delivery-photo"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            multiple
                                            onChange={
                                                handleFileChange
                                            }
                                            disabled={
                                                completing
                                            }
                                            className="sr-only"
                                        />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            /* Selected Photos */
                            <div className="space-y-3">
                                {/* Photo Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {selectedFiles.map(
                                        (
                                            file,
                                            index
                                        ) => (
                                            <div
                                                key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                                                className="overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                                            >
                                                {/* Preview */}
                                                <div className="relative aspect-square overflow-hidden bg-slate-100">
                                                    {previewUrls[
                                                        index
                                                    ] && (
                                                        <img
                                                            src={
                                                                previewUrls[
                                                                    index
                                                                ]
                                                            }
                                                            alt={`Proof of delivery ${index + 1}`}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    )}

                                                    {!completing && (
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleRemoveFile(
                                                                    index
                                                                )
                                                            }
                                                            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/95 text-slate-600 shadow-sm hover:bg-white hover:text-red-600"
                                                        >
                                                            <X className="h-4 w-4" />

                                                            <span className="sr-only">
                                                                Remove proof of delivery
                                                            </span>
                                                        </Button>
                                                    )}
                                                </div>

                                                {/* File Information */}
                                                <div className="border-t border-slate-200 bg-white px-3 py-2">
                                                    <p
                                                        className="truncate text-xs font-medium text-slate-800"
                                                        title={
                                                            file.name
                                                        }
                                                    >
                                                        {
                                                            file.name
                                                        }
                                                    </p>

                                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                                        {(
                                                            file.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(
                                                            2
                                                        )}{" "}
                                                        MB
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* Add More Photos */}
                                {!completing && (
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        {/* Camera */}
                                        <label
                                            htmlFor="delivery-photo-camera-add"
                                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-blue-200 bg-white px-4 py-2.5 text-xs font-medium text-blue-700 shadow-sm transition hover:bg-blue-50"
                                        >
                                            <Camera className="h-4 w-4" />

                                            Add from Camera

                                            <input
                                                id="delivery-photo-camera-add"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                capture="environment"
                                                onChange={
                                                    handleFileChange
                                                }
                                                disabled={
                                                    completing
                                                }
                                                className="sr-only"
                                            />
                                        </label>

                                        {/* Upload */}
                                        <label
                                            htmlFor="delivery-photo-add"
                                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                                        >
                                            <ImagePlus className="h-4 w-4" />

                                            Add More Photos

                                            <input
                                                id="delivery-photo-add"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                multiple
                                                onChange={
                                                    handleFileChange
                                                }
                                                disabled={
                                                    completing
                                                }
                                                className="sr-only"
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    {displayError && (
                        <div
                            className="rounded-md border border-red-200 bg-red-50 px-4 py-3"
                            role="alert"
                        >
                            <p className="text-sm text-red-700">
                                {
                                    displayError
                                }
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="shrink-0 border-t border-blue-100 bg-blue-50/60 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            onOpenChange(
                                false
                            )
                        }
                        disabled={
                            completing
                        }
                        className="rounded-sm border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={
                            handleDeliver
                        }
                        disabled={
                            completing ||
                            selectedFiles.length ===
                                0 ||
                            !dateOfArrival
                        }
                        className="rounded-sm bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                        {completing
                            ? "Confirming..."
                            : "Confirm Delivery"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}