"use client";

import {
    FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DateTimePicker } from "@/components/ui/date-time-picker";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useProducts } from "@/src/hooks/products/useProducts";

import { useCreateStockIn } from "@/src/hooks/inventory/useCreateStockIn";

import type {
    CreateStockInPayload,
} from "@/src/services/stockInService";

interface StockInDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: () => void;
}

interface StockInItemForm {
    product_id: string;
    quantity: string;
}

interface StockInFormData {
    received_at: string;
    notes: string;
    items: StockInItemForm[];
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

const initialFormData: StockInFormData = {
    received_at: "",
    notes: "",
    items: [
        {
            product_id: "",
            quantity: "",
        },
    ],
};

export default function StockInDialog({
    open,
    onOpenChange,
    onCreated,
}: StockInDialogProps) {
    const [formData, setFormData] =
        useState<StockInFormData>(
            initialFormData
        );

    useEffect(() => {
        if (!open) {
            return;
        }

        setFormData((current) => ({
            ...current,
            received_at:
                getCurrentDateTimeLocal(),
        }));
    }, [open]);

    const {
        products,
        loading: productsLoading,
        error: productsError,
    } = useProducts();

    const {
        create,
        loading,
        error,
    } = useCreateStockIn();

    const activeProducts = useMemo(() => {
        return products.filter(
            (product) =>
                product.status === "active"
        );
    }, [products]);

    const updateItem = (
        index: number,
        field: keyof StockInItemForm,
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

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!formData.received_at) {
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
            return;
        }

        const stockInData: CreateStockInPayload = {
            received_at:
                formData.received_at,
            notes:
                formData.notes.trim() ||
                undefined,
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
            await create(stockInData);

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
        }

        onOpenChange(value);
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
                        Stock In
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Record products received into
                        the warehouse inventory.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="stock-in-form"
                    onSubmit={handleSubmit}
                    className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {error && (
                        <div
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {productsError && (
                        <div
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                            role="alert"
                        >
                            {productsError}
                        </div>
                    )}

                    {/* Received Date & Time */}
                    <div className="space-y-2">
                        <label
                            htmlFor="stock-in-received-at"
                            className="text-sm font-medium text-slate-700"
                        >
                            Received Date & Time
                        </label>

                        <DateTimePicker
                            value={formData.received_at}
                            onChange={(value) =>
                                setFormData((current) => ({
                                    ...current,
                                    received_at: value,
                                }))
                            }
                            disabled={loading}
                        />
                    </div>

                    {/* Products */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Products
                                </label>

                                <p className="mt-1 text-xs text-slate-500">
                                    Add the products
                                    and quantities
                                    received.
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
                                    productsLoading ||
                                    activeProducts.length ===
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
                                            {/* Product */}
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor={`stock-in-product-${index}`}
                                                    className="text-xs font-medium text-slate-600"
                                                >
                                                    Product
                                                </label>

                                                <Select
                                                    value={
                                                        item.product_id
                                                    }
                                                    onValueChange={(value) =>
                                                        updateItem(
                                                            index,
                                                            "product_id",
                                                            value ?? ""
                                                        )
                                                    }
                                                    disabled={
                                                        loading ||
                                                        productsLoading
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id={`stock-in-product-${index}`}
                                                        className="w-full border-slate-200 bg-white text-slate-900 focus:ring-blue-100"
                                                    >
                                                        <SelectValue
                                                            placeholder={
                                                                productsLoading
                                                                    ? "Loading products..."
                                                                    : "Select product"
                                                            }
                                                        >
                                                            {(value: string | null) => {
                                                                const selectedProduct =
                                                                    activeProducts.find(
                                                                        (product) =>
                                                                            String(product.id) ===
                                                                            value
                                                                    );
                                                                
                                                                return selectedProduct
                                                                    ? `${selectedProduct.name} - ${selectedProduct.sku}`
                                                                    : "Select product";
                                                            }}
                                                        </SelectValue>
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {activeProducts.map(
                                                            (
                                                                product
                                                            ) => {
                                                                const disabled =
                                                                    isProductSelected(
                                                                        String(
                                                                            product.id
                                                                        ),
                                                                        index
                                                                    );

                                                                return (
                                                                    <SelectItem
                                                                        key={
                                                                            product.id
                                                                        }
                                                                        value={String(
                                                                            product.id
                                                                        )}
                                                                        disabled={
                                                                            disabled
                                                                        }
                                                                    >
                                                                        {
                                                                            product.name
                                                                        }{" "}
                                                                        —{" "}
                                                                        {
                                                                            product.sku
                                                                        }
                                                                    </SelectItem>
                                                                );
                                                            }
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Quantity */}
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor={`stock-in-quantity-${index}`}
                                                    className="text-xs font-medium text-slate-600"
                                                >
                                                    Quantity
                                                </label>

                                                <Input
                                                    id={`stock-in-quantity-${index}`}
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

                                            {/* Remove */}
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

                        {activeProducts.length ===
                            0 &&
                            !productsLoading && (
                                <p className="text-sm text-amber-600">
                                    No active products are
                                    available for Stock In.
                                </p>
                            )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label
                            htmlFor="stock-in-notes"
                            className="text-sm font-medium text-slate-700"
                        >
                            Notes
                        </label>

                        <textarea
                            id="stock-in-notes"
                            placeholder="Enter notes or additional details"
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
                            loading
                        }
                        className="border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="stock-in-form"
                        disabled={
                            loading ||
                            productsLoading ||
                            activeProducts.length ===
                                0
                        }
                        className="bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                    >
                        {loading
                            ? "Receiving..."
                            : "Receive Stock"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}