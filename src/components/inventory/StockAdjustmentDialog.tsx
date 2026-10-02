"use client";

import {
    FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";

import { Plus, Trash2 } from "lucide-react";

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
import { DateTimePicker } from "@/components/ui/date-time-picker";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/src/hooks/useAuth";

import {
    useActiveLocationContext,
} from "@/src/context/ActiveLocationContext";

import { useProducts } from "@/src/hooks/products/useProducts";
import { useInventory } from "@/src/hooks/inventory/useInventory";
import { useCreateStockAdjustment } from "@/src/hooks/inventory/useCreateStockAdjustment";

import type {
    CreateStockAdjustmentPayload,
} from "@/src/services/stockAdjustmentService";

interface StockAdjustmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: () => void;
}

interface StockAdjustmentItemForm {
    product_id: string;
    quantity: string;
}

interface StockAdjustmentFormData {
    type: "increase" | "decrease";
    reason: string;
    adjusted_at: string;
    notes: string;
    items: StockAdjustmentItemForm[];
}

function getCurrentDateTimeLocal(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        now.getDate()
    ).padStart(2, "0");
    const hours = String(
        now.getHours()
    ).padStart(2, "0");
    const minutes = String(
        now.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const initialFormData: StockAdjustmentFormData = {
    type: "decrease",
    reason: "",
    adjusted_at: "",
    notes: "",
    items: [
        {
            product_id: "",
            quantity: "",
        },
    ],
};

const adjustmentReasons = [
    "Incorrect stock entry",
    "Damaged stock",
    "Lost stock",
    "Found stock",
    "Physical count correction",
    "Other",
];

export default function StockAdjustmentDialog({
    open,
    onOpenChange,
    onCreated,
}: StockAdjustmentDialogProps) {
    const [formData, setFormData] =
        useState<StockAdjustmentFormData>(
            initialFormData
        );

    const [validationError, setValidationError] =
        useState<string | null>(null);

    const {
        user,
        loading: authLoading,
    } = useAuth();

    const {
        activeLocation,
        initialized: locationInitialized,
    } = useActiveLocationContext();

    const {
        products,
        loading: productsLoading,
        error: productsError,
    } = useProducts();

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
        isBranchCoordinator &&
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
                (
                    !isBranchCoordinator ||
                    activeBranchId !==
                        undefined
                ),
        }
    );

    const {
        create,
        loading,
        error,
    } = useCreateStockAdjustment();

    useEffect(() => {
        if (!open) {
            return;
        }

        setFormData((current) => ({
            ...current,
            adjusted_at:
                getCurrentDateTimeLocal(),
        }));

        setValidationError(null);
    }, [open]);

    const activeProducts = useMemo(() => {
        return products.filter(
            (product) =>
                product.status === "active"
        );
    }, [products]);

    const branchInventoryProducts =
        useMemo(() => {
            if (
                user?.role !==
                "branch_coordinator"
            ) {
                return [];
            }

            return inventory
                .filter(
                    (item) =>
                        item.branch_id !==
                            null &&
                        item.product
                )
                .map((item) => ({
                    product: item.product,
                    quantity: item.quantity,
                }));
        }, [
            inventory,
            user?.role,
        ]);

    const selectableProducts =
        useMemo(() => {
            if (
                user?.role ===
                "branch_coordinator"
            ) {
                return branchInventoryProducts;
            }

            return activeProducts.map(
                (product) => ({
                    product,
                    quantity: null,
                })
            );
        }, [
            activeProducts,
            branchInventoryProducts,
            user?.role,
        ]);

    const productsDataLoading =
        authLoading ||
        productsLoading ||
        (user?.role ===
            "branch_coordinator" &&
            inventoryLoading);

    const productsDataError =
        productsError ??
        (user?.role ===
        "branch_coordinator"
            ? inventoryError
            : null);

    const updateItem = (
        index: number,
        field: keyof StockAdjustmentItemForm,
        value: string
    ) => {
        setFormData((current) => ({
            ...current,
            items: current.items.map(
                (item, itemIndex) =>
                    itemIndex === index
                        ? {
                              ...item,
                              [field]: value,
                          }
                        : item
            ),
        }));
    };

    const addItem = () => {
        setFormData((current) => ({
            ...current,
            items: [
                ...current.items,
                {
                    product_id: "",
                    quantity: "",
                },
            ],
        }));
    };

    const removeItem = (
        index: number
    ) => {
        setFormData((current) => {
            if (current.items.length === 1) {
                return current;
            }

            return {
                ...current,
                items: current.items.filter(
                    (_, itemIndex) =>
                        itemIndex !== index
                ),
            };
        });
    };

    const handleTypeChange = (
        value: string | null
    ) => {
        if (
            value !== "increase" &&
            value !== "decrease"
        ) {
            return;
        }

        setFormData((current) => ({
            ...current,
            type: value,
        }));
    };

    const handleReasonChange = (
        value: string | null
    ) => {
        if (!value) {
            return;
        }

        setFormData((current) => ({
            ...current,
            reason: value,
        }));
    };

    const isProductSelected = (
        productId: string,
        currentIndex: number
    ) => {
        return formData.items.some(
            (item, index) =>
                index !== currentIndex &&
                item.product_id === productId
        );
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setValidationError(null);

        if (!formData.adjusted_at) {
            setValidationError(
                "The adjustment date and time is required."
            );

            return;
        }

        if (!formData.reason.trim()) {
            setValidationError(
                "The adjustment reason is required."
            );

            return;
        }

        const validItems =
            formData.items.filter(
                (item) =>
                    item.product_id &&
                    Number(item.quantity) > 0
            );

        if (
            validItems.length !==
            formData.items.length
        ) {
            setValidationError(
                "Please select a product and enter a quantity greater than zero for every item."
            );

            return;
        }

        const stockAdjustmentData: CreateStockAdjustmentPayload =
            {
                type: formData.type,
                reason: formData.reason.trim(),
                adjusted_at:
                    formData.adjusted_at,
                notes:
                    formData.notes.trim() ||
                    undefined,
            
                ...(isBranchCoordinator &&
                activeBranchId
                    ? {
                          branch_id:
                              activeBranchId,
                      }
                    : {}),
                  
                items: validItems.map(
                    (item) => ({
                        product_id:
                            Number(
                                item.product_id
                            ),
                        quantity:
                            Number(
                                item.quantity
                            ),
                    })
                ),
            };

        const response =
            await create(
                stockAdjustmentData
            );

        if (!response) {
            return;
        }

        onCreated?.();

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
            <DialogContent className="flex max-h-[94vh] flex-col border-blue-100 bg-white text-slate-900 sm:max-w-2xl">
                <DialogHeader className="shrink-0 border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Stock Adjustment
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Correct inventory quantities
                        without modifying previous
                        stock transactions.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="stock-adjustment-form"
                    onSubmit={handleSubmit}
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

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="stock-adjustment-type"
                                className="text-sm font-medium text-slate-700"
                            >
                                Adjustment Type
                            </label>

                            <Select
                                value={
                                    formData.type
                                }
                                onValueChange={
                                    handleTypeChange
                                }
                                disabled={
                                    loading
                                }
                            >
                                <SelectTrigger
                                    id="stock-adjustment-type"
                                    className="w-full border-slate-200 bg-white text-slate-900 focus:ring-blue-100"
                                >
                                    <SelectValue>
                                        {(value: string | null) =>
                                            value === "increase"
                                                ? "Increase Stock"
                                                : value === "decrease"
                                                  ? "Decrease Stock"
                                                  : "Select adjustment type"
                                        }
                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="decrease">
                                        Decrease Stock
                                    </SelectItem>

                                    <SelectItem value="increase">
                                        Increase Stock
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <p className="text-xs text-slate-500">
                                Choose whether to add
                                or deduct inventory.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="stock-adjustment-adjusted-at"
                                className="text-sm font-medium text-slate-700"
                            >
                                Adjustment Date & Time
                            </label>

                            <DateTimePicker
                                value={formData.adjusted_at}
                                onChange={(value) =>
                                    setFormData((current) => ({
                                        ...current,
                                        adjusted_at: value,
                                    }))
                                }
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="stock-adjustment-reason"
                            className="text-sm font-medium text-slate-700"
                        >
                            Reason
                        </label>

                        <Select
                            value={
                                adjustmentReasons.includes(
                                    formData.reason
                                )
                                    ? formData.reason
                                    : ""
                            }
                            onValueChange={
                                handleReasonChange
                            }
                            disabled={
                                loading
                            }
                        >
                            <SelectTrigger
                                id="stock-adjustment-reason"
                                className="w-full border-slate-200 bg-white text-slate-900 focus:ring-blue-100"
                            >
                                <SelectValue placeholder="Select adjustment reason" />
                            </SelectTrigger>

                            <SelectContent>
                                {adjustmentReasons.map(
                                    (
                                        reason
                                    ) => (
                                        <SelectItem
                                            key={
                                                reason
                                            }
                                            value={
                                                reason
                                            }
                                        >
                                            {
                                                reason
                                            }
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Products
                                </label>

                                <p className="mt-1 text-xs text-slate-500">
                                    {user?.role ===
                                    "branch_coordinator"
                                        ? "Select products currently assigned to your branch inventory."
                                        : "Add the products and quantities to adjust."}
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={
                                    addItem
                                }
                                disabled={
                                    loading ||
                                    productsDataLoading ||
                                    selectableProducts.length ===
                                        formData.items.length
                                }
                                className="border-blue-200 bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                Add Product
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {formData.items.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="rounded-lg border border-slate-200 bg-slate-50/50 p-3"
                                    >
                                        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_140px_auto] md:items-start">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor={`stock-adjustment-product-${index}`}
                                                    className="text-xs font-medium text-slate-600"
                                                >
                                                    Product
                                                </label>

                                                <Select
                                                    value={
                                                        item.product_id
                                                    }
                                                    onValueChange={(
                                                        value
                                                    ) =>
                                                        updateItem(
                                                            index,
                                                            "product_id",
                                                            value ?? ""
                                                        )
                                                    }
                                                    disabled={
                                                        loading ||
                                                        productsDataLoading
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id={`stock-adjustment-product-${index}`}
                                                        className="w-full border-slate-200 bg-white text-slate-900 focus:ring-blue-100"
                                                    >
                                                        <SelectValue
                                                            placeholder={
                                                                productsDataLoading
                                                                    ? "Loading products..."
                                                                    : "Select product"
                                                            }
                                                        >
                                                            {(value: string | null) => {
                                                                const selectedProduct =
                                                                    selectableProducts.find(
                                                                        (item) =>
                                                                            String(
                                                                                item.product.id
                                                                            ) ===
                                                                            value
                                                                    );

                                                                return selectedProduct
                                                                    ? `${selectedProduct.product.name} - ${selectedProduct.product.sku}`
                                                                    : "Select product";
                                                            }}
                                                        </SelectValue>
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {selectableProducts.map(
                                                            (
                                                                item
                                                            ) => (
                                                                <SelectItem
                                                                    key={
                                                                        item
                                                                            .product
                                                                            .id
                                                                    }
                                                                    value={String(
                                                                        item
                                                                            .product
                                                                            .id
                                                                    )}
                                                                    disabled={isProductSelected(
                                                                        String(
                                                                            item
                                                                                .product
                                                                                .id
                                                                        ),
                                                                        index
                                                                    )}
                                                                >
                                                                    {
                                                                        item
                                                                            .product
                                                                            .name
                                                                    }{" "}
                                                                    —{" "}
                                                                    {
                                                                        item
                                                                            .product
                                                                            .sku
                                                                    }

                                                                    {item.quantity !==
                                                                        null && (
                                                                        <span className="ml-2 text-xs text-slate-500">
                                                                            · Stock:{" "}
                                                                            {Number(
                                                                                item.quantity
                                                                            ).toLocaleString(
                                                                                "en-PH",
                                                                                {
                                                                                    maximumFractionDigits: 2,
                                                                                }
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor={`stock-adjustment-quantity-${index}`}
                                                    className="text-xs font-medium text-slate-600"
                                                >
                                                    Quantity
                                                </label>

                                                <Input
                                                    id={`stock-adjustment-quantity-${index}`}
                                                    type="number"
                                                    min="0.01"
                                                    step="0.01"
                                                    placeholder="0"
                                                    value={
                                                        item.quantity
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateItem(
                                                            index,
                                                            "quantity",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    required
                                                    disabled={
                                                        loading
                                                    }
                                                    className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
                                                />
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeItem(
                                                        index
                                                    )
                                                }
                                                disabled={
                                                    loading ||
                                                    formData
                                                        .items
                                                        .length ===
                                                        1
                                                }
                                                className="mt-5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                aria-label="Remove product"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {selectableProducts.length ===
                            0 &&
                            !productsDataLoading && (
                                <p className="text-sm text-amber-600">
                                    {user?.role ===
                                    "branch_coordinator"
                                        ? "No products are currently assigned to your branch inventory."
                                        : "No active products are available for adjustment."}
                                </p>
                            )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="stock-adjustment-notes"
                            className="text-sm font-medium text-slate-700"
                        >
                            Notes
                        </label>

                        <textarea
                            id="stock-adjustment-notes"
                            placeholder="Enter additional details"
                            rows={3}
                            value={
                                formData.notes
                            }
                            onChange={(
                                event
                            ) =>
                                setFormData(
                                    (
                                        current
                                    ) => ({
                                        ...current,
                                        notes: event
                                            .target
                                            .value,
                                    })
                                )
                            }
                            disabled={
                                loading
                            }
                            className="flex w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-blue-400 focus:ring-1 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </form>

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
                        form="stock-adjustment-form"
                        disabled={
                            loading ||
                            productsDataLoading ||
                            selectableProducts.length === 0
                        }
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {loading
                            ? "Saving..."
                            : "Save Adjustment"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}