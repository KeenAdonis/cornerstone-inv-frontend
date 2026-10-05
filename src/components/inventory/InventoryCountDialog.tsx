"use client";

import {
    FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ClipboardCheck,
} from "lucide-react";

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

import {
    useActiveLocationContext,
} from "@/src/context/ActiveLocationContext";

import { useAuth } from "@/src/hooks/useAuth";

import { useInventory } from "@/src/hooks/inventory/useInventory";
import { useInventoryCount } from "@/src/hooks/inventory/useInventoryCount";

import type {
    CreateInventoryCountData,
} from "@/src/services/inventoryCountService";

interface InventoryCountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: () => void;
}

interface InventoryCountItemForm {
    inventory_id: number;
    counted_quantity: string;
}

export default function InventoryCountDialog({
    open,
    onOpenChange,
    onCreated,
}: InventoryCountDialogProps) {
    const [
        items,
        setItems,
    ] = useState<InventoryCountItemForm[]>([]);

    const [
        notes,
        setNotes,
    ] = useState("");

    const [
        validationError,
        setValidationError,
    ] = useState<string | null>(null);

    const [
        invalidInventoryIds,
        setInvalidInventoryIds,
    ] = useState<number[]>([]);

    const { user } = useAuth();

    const {
        activeLocation,
        initialized: locationInitialized,
    } = useActiveLocationContext();

    const isBranchCoordinator =
        user?.role ===
        "branch_coordinator";

    const activeBranchId =
        isBranchCoordinator &&
        locationInitialized &&
        activeLocation?.type === "branch"
            ? activeLocation.id
            : undefined;

    const {
        inventory,
        loading: inventoryLoading,
        error: inventoryError,
    } = useInventory(
        activeBranchId
            ? {
                  branchId:
                      activeBranchId,
              }
            : undefined,
        {
            enabled:
                open &&
                locationInitialized &&
                !!activeBranchId,
        }
    );

    const {
        submitInventoryCount,
        loading,
        error,
        reset,
    } = useInventoryCount();

    useEffect(() => {
        if (!open) {
            return;
        }

        setValidationError(null);
        setNotes("");

        setItems(
            inventory.map((item) => ({
                inventory_id: item.id,
                counted_quantity: "0",
            }))
        );
    }, [
        open,
        inventory,
    ]);

    const productsCount =
        useMemo(
            () => items.length,
            [items]
        );

    const updateCountedQuantity = (
        inventoryId: number,
        value: string
    ) => {
        const inventoryItem = inventory.find(
            (item) =>
                item.id === inventoryId
        );

        if (
            inventoryItem &&
            value !== ""
        ) {
            const countedQuantity =
                Number(value);

            const systemQuantity =
                Number(
                    inventoryItem.quantity
                );

            if (
                Number.isFinite(
                    countedQuantity
                ) &&
                countedQuantity >
                    systemQuantity
            ) {
                setInvalidInventoryIds(
                    (current) =>
                        current.includes(
                            inventoryId
                        )
                            ? current
                            : [
                                  ...current,
                                  inventoryId,
                              ]
                );
            } else {
                setInvalidInventoryIds(
                    (current) =>
                        current.filter(
                            (id) =>
                                id !==
                                inventoryId
                        )
                );
            }
        } else {
            setInvalidInventoryIds(
                (current) =>
                    current.filter(
                        (id) =>
                            id !==
                            inventoryId
                    )
            );
        }

        setItems((current) =>
            current.map((item) =>
                item.inventory_id ===
                inventoryId
                    ? {
                          ...item,
                          counted_quantity:
                              value,
                      }
                    : item
            )
        );
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setValidationError(null);

        if (!activeBranchId) {
            setValidationError(
                "No active branch is selected."
            );

            return;
        }

        if (items.length === 0) {
            setValidationError(
                "There are no inventory items available for counting."
            );

            return;
        }

        const invalidItems = items.filter(
            (formItem) => {
                const inventoryItem =
                    inventory.find(
                        (item) =>
                            item.id ===
                            formItem.inventory_id
                    );
                
                if (!inventoryItem) {
                    return true;
                }
            
                const countedQuantity =
                    Number(
                        formItem.counted_quantity
                    );
                
                const systemQuantity =
                    Number(
                        inventoryItem.quantity
                    );
                
                return (
                    formItem.counted_quantity ===
                        "" ||
                    !Number.isFinite(
                        countedQuantity
                    ) ||
                    countedQuantity < 0 ||
                    countedQuantity >
                        systemQuantity
                );
            }
        );

        if (invalidItems.length > 0) {
            setInvalidInventoryIds(
                invalidItems.map(
                    (item) =>
                        item.inventory_id
                )
            );
        
            setValidationError(
                "Please correct the highlighted physical counts before completing the inventory count."
            );
        
            return;
        }

        setInvalidInventoryIds([]);

        const inventoryCountData: CreateInventoryCountData =
            {
                branch_id:
                    activeBranchId,

                items: items.map(
                    (item) => ({
                        inventory_id:
                            item.inventory_id,

                        counted_quantity:
                            Number(
                                item.counted_quantity
                            ),
                    })
                ),

                notes:
                    notes.trim() ||
                    undefined,
            };

        const response =
            await submitInventoryCount(
                inventoryCountData
            );
        
        if (!response) {
            return;
        }
        
        toast.add({
            title: "Inventory Count Saved",
            description:
                "Inventory count has been saved successfully.",
            type: "success",
        });
        
        onCreated?.();
        
        setItems([]);
        setNotes("");
        reset();
        
        onOpenChange(false);
    };

    const handleOpenChange = (
        value: boolean
    ) => {
        if (!value && !loading) {
            setItems([]);
            setNotes("");
            setValidationError(null);
            reset();
        }

        onOpenChange(value);
    };

    const productsDataError =
        inventoryError ??
        (!isBranchCoordinator &&
        user
            ? "Inventory count is only available for branch coordinators."
            : null);

    const isLoading =
        inventoryLoading ||
        loading;

    return (
        <Dialog
            open={open}
            onOpenChange={
                handleOpenChange
            }
        >
            <DialogContent className="flex max-h-[94vh] flex-col border-blue-100 bg-white text-slate-900 sm:max-w-4xl">
                {/* Header */}
                <DialogHeader className="shrink-0 border-b border-blue-100 pb-4">
                    <DialogTitle className="flex items-center gap-2 text-slate-900">
                        <ClipboardCheck className="h-5 w-5 text-blue-600" />

                        Inventory Count
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Enter the physical quantity currently available for each product in your branch.
                    </DialogDescription>
                </DialogHeader>

                {/* Scrollable Content */}
                <form
                    id="inventory-count-form"
                    onSubmit={
                        handleSubmit
                    }
                    className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {(error ||
                        productsDataError ||
                        validationError) && (
                        <div
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                            role="alert"
                        >
                            {validationError ??
                                error ??
                                productsDataError}
                        </div>
                    )}

                    <div className="flex items-center justify-between rounded-sm border border-blue-100 bg-blue-50/60 px-4 py-3">
                        <div>
                            <p className="text-sm font-medium text-slate-800">
                                Physical Inventory Count
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {productsCount}{" "}
                                product
                                {productsCount !==
                                1
                                    ? "s"
                                    : ""}{" "}
                                included
                            </p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-sm border border-slate-200">
                        <div className="max-h-[420px] overflow-auto">
                            <table className="w-full min-w-[700px] text-sm">
                                <thead className="sticky top-0 z-10">
                                    <tr className="border-b border-blue-100 bg-blue-50">
                                        <th className="px-4 py-3 text-left font-medium text-blue-900">
                                            Product
                                        </th>

                                        <th className="px-4 py-3 text-left font-medium text-blue-900">
                                            SKU
                                        </th>

                                        <th className="px-4 py-3 text-right font-medium text-blue-900">
                                            System Qty
                                        </th>

                                        <th className="px-4 py-3 text-right font-medium text-blue-900">
                                            Physical Count
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {inventory.map(
                                        (
                                            item
                                        ) => {
                                            const formItem =
                                                items.find(
                                                    (
                                                        formItem
                                                    ) =>
                                                        formItem.inventory_id ===
                                                        item.id
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        item.id
                                                    }
                                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                                >
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <p className="font-medium text-slate-900">
                                                                {
                                                                    item
                                                                        .product
                                                                        .name
                                                                }
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                {
                                                                    item
                                                                        .product
                                                                        .unit
                                                                }
                                                            </p>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3 font-mono text-sm text-slate-600">
                                                        {
                                                            item
                                                                .product
                                                                .sku
                                                        }
                                                    </td>

                                                    <td className="px-4 py-3 text-right font-medium text-slate-700">
                                                        {Number(item.quantity).toLocaleString("en-PH", {
                                                            maximumFractionDigits: 0,
                                                        })}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-end">
                                                            <div className="flex flex-col items-end">
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    value={
                                                                        formItem
                                                                            ?.counted_quantity ??
                                                                        ""
                                                                    }
                                                                    onChange={(event) =>
                                                                        updateCountedQuantity(
                                                                            item.id,
                                                                            event.target.value
                                                                        )
                                                                    }
                                                                    disabled={isLoading}
                                                                    className={
                                                                        invalidInventoryIds.includes(
                                                                            item.id
                                                                        )
                                                                            ? "w-32 border-red-400 bg-red-50 text-right text-red-700 focus-visible:border-red-500 focus-visible:ring-red-100"
                                                                            : "w-32 border-slate-200 bg-white text-right text-slate-900 focus-visible:border-blue-400 focus-visible:ring-blue-100"
                                                                    }
                                                                />

                                                                {invalidInventoryIds.includes(
                                                                    item.id
                                                                ) && (
                                                                    <p className="mt-1 max-w-55 text-right text-xs text-red-600">
                                                                        Physical Count cannot exceed to{" "}
                                                                        {Number(
                                                                            item.quantity
                                                                        ).toLocaleString(
                                                                            "en-PH",
                                                                            {
                                                                                maximumFractionDigits: 2,
                                                                            }
                                                                        )}
                                                                        .
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}

                                    {!inventoryLoading &&
                                        inventory.length ===
                                            0 && (
                                            <tr>
                                                <td
                                                    colSpan={
                                                        4
                                                    }
                                                    className="px-6 py-12 text-center"
                                                >
                                                    <p className="text-sm font-medium text-slate-700">
                                                        No inventory records found.
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        There are no products available for physical counting in this branch.
                                                    </p>
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-2 pb-1">
                        <label
                            htmlFor="inventory-count-notes"
                            className="text-sm font-medium text-slate-700"
                        >
                            Notes
                        </label>

                        <textarea
                            id="inventory-count-notes"
                            placeholder="Enter additional details about this physical count"
                            rows={3}
                            value={notes}
                            onChange={(
                                event
                            ) =>
                                setNotes(
                                    event
                                        .target
                                        .value
                                )
                            }
                            disabled={
                                isLoading
                            }
                            className="flex w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </form>

                {/* Fixed Footer */}
                <DialogFooter className="shrink-0 border-t border-blue-100 bg-blue-50/60 pt-5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            handleOpenChange(
                                false
                            )
                        }
                        disabled={
                            isLoading
                        }
                        className="border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        form="inventory-count-form"
                        disabled={
                            isLoading ||
                            inventoryLoading ||
                            inventory.length ===
                                0 ||
                            !activeBranchId
                        }
                        className="bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                    >
                        {loading
                            ? "Completing..."
                            : "Complete Count"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}