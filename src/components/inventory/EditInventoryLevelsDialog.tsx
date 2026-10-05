"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { toast } from "@/components/ui/toast";

import { useUpdateInventoryStockLevels } from "@/src/hooks/inventory/useUpdateInventoryStockLevels";

import type {
    Inventory,
} from "@/src/services/inventoryService";

interface EditInventoryLevelsDialogProps {
    open: boolean;
    inventory: Inventory | null;
    onOpenChange: (open: boolean) => void;
    onUpdated?: () => void;
}

interface InventoryLevelsFormData {
    par_level: string;
    reorder_level: string;
}

const initialFormData: InventoryLevelsFormData = {
    par_level: "",
    reorder_level: "",
};

export default function EditInventoryLevelsDialog({
    open,
    inventory,
    onOpenChange,
    onUpdated,
}: EditInventoryLevelsDialogProps) {
    const [formData, setFormData] =
        useState<InventoryLevelsFormData>(
            initialFormData
        );

    const [validationError, setValidationError] =
        useState<string | null>(null);

    const {
        update,
        loading,
        error,
    } = useUpdateInventoryStockLevels();

    useEffect(() => {
        if (inventory) {
            setFormData({
                par_level:
                    inventory.par_level,
                reorder_level:
                    inventory.reorder_level,
            });

            setValidationError(null);
        }
    }, [inventory]);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setValidationError(null);

        if (!inventory) {
            return;
        }

        if (
            formData.par_level.trim() === ""
        ) {
            setValidationError(
                "The PAR level is required."
            );

            return;
        }

        if (
            formData.reorder_level.trim() ===
            ""
        ) {
            setValidationError(
                "The reorder level is required."
            );

            return;
        }

        const parLevel =
            Number(formData.par_level);

        const reorderLevel =
            Number(formData.reorder_level);

        if (
            !Number.isFinite(parLevel) ||
            parLevel < 0
        ) {
            setValidationError(
                "The PAR level cannot be negative."
            );

            return;
        }

        if (
            !Number.isFinite(reorderLevel) ||
            reorderLevel < 0
        ) {
            setValidationError(
                "The reorder level cannot be negative."
            );

            return;
        }

        if (reorderLevel > parLevel) {
            setValidationError(
                "The reorder level cannot be greater than the PAR level."
            );

            return;
        }

        const response = await update(
            inventory.id,
            {
                par_level: parLevel,
                reorder_level: reorderLevel,
            }
        );
        
        if (!response) {
            return;
        }
        
        toast.add({
            title: "Inventory Updated",
            description:
                "Inventory stock levels have been updated successfully.",
            type: "success",
        });
        
        onUpdated?.();
        
        setFormData(initialFormData);
        
        onOpenChange(false);
    };

    const handleOpenChange = (
        value: boolean
    ) => {
        if (!value && !loading) {
            setFormData(
                initialFormData
            );

            setValidationError(null);
        }

        onOpenChange(value);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={
                handleOpenChange
            }
        >
            <DialogContent className="border-blue-100 bg-white text-slate-900 sm:max-w-xl">
                <DialogHeader className="border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Inventory Stock Levels
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Configure the PAR and reorder
                        levels for this inventory record.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* Product Information */}
                    {inventory && (
                        <div className="rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3">
                            <p className="text-sm font-medium text-slate-900">
                                {
                                    inventory
                                        .product
                                        .name
                                }
                            </p>

                            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                <span>
                                    SKU:{" "}
                                    {
                                        inventory
                                            .product
                                            .sku
                                    }
                                </span>

                                <span>
                                    Unit:{" "}
                                    {
                                        inventory
                                            .product
                                            .unit
                                    }
                                </span>

                                {inventory.warehouse && (
                                    <span>
                                        Warehouse:{" "}
                                        {
                                            inventory
                                                .warehouse
                                                .name
                                        }
                                    </span>
                                )}

                                {inventory.branch && (
                                    <span>
                                        Branch:{" "}
                                        {
                                            inventory
                                                .branch
                                                .name
                                        }
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Current Stock */}
                    {inventory && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Current Stock
                            </p>

                            <p className="mt-1 text-lg font-semibold text-slate-900">
                                {Number(
                                    inventory.quantity
                                ).toLocaleString(
                                    "en-PH",
                                    {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                    }
                                )}{" "}
                                <span className="text-sm font-normal text-slate-500">
                                    {
                                        inventory
                                            .product
                                            .unit
                                    }
                                </span>
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {(error ||
                        validationError) && (
                        <div
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                            role="alert"
                        >
                            {validationError ??
                                error}
                        </div>
                    )}

                    {/* PAR Level */}
                    <div className="space-y-2">
                        <label
                            htmlFor="inventory-par-level"
                            className="text-sm font-medium text-slate-700"
                        >
                            PAR Level
                        </label>

                        <Input
                            id="inventory-par-level"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter PAR level"
                            value={
                                formData.par_level
                            }
                            onChange={(
                                event
                            ) =>
                                setFormData(
                                    (
                                        current
                                    ) => ({
                                        ...current,
                                        par_level:
                                            event
                                                .target
                                                .value,
                                    })
                                )
                            }
                            required
                            disabled={
                                loading
                            }
                            className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
                        />

                        <p className="text-xs text-slate-500">
                            Target quantity that should
                            normally be maintained.
                        </p>
                    </div>

                    {/* Reorder Level */}
                    <div className="space-y-2">
                        <label
                            htmlFor="inventory-reorder-level"
                            className="text-sm font-medium text-slate-700"
                        >
                            Reorder Level
                        </label>

                        <Input
                            id="inventory-reorder-level"
                            type="number"
                            min="0"
                            max={
                                formData.par_level !==
                                ""
                                    ? formData.par_level
                                    : undefined
                            }
                            step="0.01"
                            placeholder="Enter reorder level"
                            value={
                                formData.reorder_level
                            }
                            onChange={(
                                event
                            ) =>
                                setFormData(
                                    (
                                        current
                                    ) => ({
                                        ...current,
                                        reorder_level:
                                            event
                                                .target
                                                .value,
                                    })
                                )
                            }
                            required
                            disabled={
                                loading
                            }
                            className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
                        />

                        <p className="text-xs text-slate-500">
                            Stock level at which
                            replenishment should be triggered.
                        </p>
                    </div>

                    <DialogFooter className="border-t border-blue-100 bg-blue-50/60 pt-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                handleOpenChange(
                                    false
                                )
                            }
                            disabled={
                                loading
                            }
                            className="border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                loading ||
                                !inventory
                            }
                            className="bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        >
                            {loading
                                ? "Saving..."
                                : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}