"use client";

import {
    FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { toast } from "@/components/ui/toast";

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

import {
    useActiveLocationContext,
} from "@/src/context/ActiveLocationContext";

import { useProducts } from "@/src/hooks/products/useProducts";
import { useWarehouses } from "@/src/hooks/warehouse/useWarehouses";
import { useCreatePurchaseOrder } from "@/src/hooks/purchase-orders/useCreatePurchaseOrder";

import type {
    CreatePurchaseOrderPayload,
} from "@/src/services/purchaseOrderService";

interface CreatePurchaseOrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: () => void;
}

interface PurchaseOrderItemForm {
    product_id: string;
    quantity: string;
}

interface PurchaseOrderFormData {
    warehouse_id: string;
    notes: string;
    items: PurchaseOrderItemForm[];
}

const initialFormData: PurchaseOrderFormData = {
    warehouse_id: "",
    notes: "",
    items: [
        {
            product_id: "",
            quantity: "",
        },
    ],
};

export default function CreatePurchaseOrderDialog({
    open,
    onOpenChange,
    onCreated,
}: CreatePurchaseOrderDialogProps) {
    const [formData, setFormData] =
        useState<PurchaseOrderFormData>(
            initialFormData
        );

    const [
        validationError,
        setValidationError,
    ] = useState<string | null>(null);

    const {
        products,
        loading: productsLoading,
        error: productsError,
    } = useProducts();

    const {
        warehouses,
        loading: warehousesLoading,
        error: warehousesError,
    } = useWarehouses();

    const {
        create,
        loading,
        error,
    } = useCreatePurchaseOrder();

    const {
        activeLocation,
        initialized: locationInitialized,
    } = useActiveLocationContext();

    const activeBranchId =
        locationInitialized &&
        activeLocation?.type === "branch"
            ? activeLocation.id
            : undefined;

    const activeProducts = useMemo(() => {
        return products.filter(
            (product) =>
                product.status === "active"
        );
    }, [products]);

    const activeWarehouses = useMemo(() => {
        return warehouses.filter(
            (warehouse) =>
                warehouse.status === "active"
        );
    }, [warehouses]);

    useEffect(() => {
        if (!open) {
            return;
        }

        setValidationError(null);
    }, [open]);

    const updateItem = (
        index: number,
        field: keyof PurchaseOrderItemForm,
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
            if (
                current.items.length === 1
            ) {
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

    const handleWarehouseChange = (
        value: string | null
    ) => {
        setFormData((current) => ({
            ...current,
            warehouse_id:
                value ?? "",
        }));

        setValidationError(null);
    };

    const isProductSelected = (
        productId: string,
        currentIndex: number
    ) => {
        return formData.items.some(
            (item, index) =>
                index !== currentIndex &&
                item.product_id ===
                    productId
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

        if (!formData.warehouse_id) {
            setValidationError(
                "The warehouse is required."
            );

            return;
        }

        const validItems =
            formData.items.filter(
                (item) =>
                    item.product_id &&
                    Number(item.quantity) >
                        0
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

        const productIds =
            validItems.map(
                (item) =>
                    item.product_id
            );

        const hasDuplicateProducts =
            new Set(productIds).size !==
            productIds.length;

        if (hasDuplicateProducts) {
            setValidationError(
                "A product cannot be added more than once."
            );

            return;
        }

        const purchaseOrderData: CreatePurchaseOrderPayload =
            {
                branch_id:
                    activeBranchId,

                warehouse_id:
                    Number(
                        formData.warehouse_id
                    ),

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

                notes:
                    formData.notes.trim() ||
                    undefined,
            };

        const response =
    await create(
        purchaseOrderData
    );

if (!response) {
    return;
}

toast.add({
    title: "Purchase Order Created",
    description:
        "Purchase order has been created successfully.",
    type: "success",
});

onCreated?.();

setFormData(
    initialFormData
);

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

    const isLoading =
        loading ||
        productsLoading ||
        warehousesLoading;

    return (
        <Dialog
            open={open}
            onOpenChange={
                handleOpenChange
            }
        >
            <DialogContent className="flex max-h-[94vh] flex-col border-blue-100 bg-white text-slate-900 sm:max-w-2xl">
                {/* Header */}
                <DialogHeader className="shrink-0 border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Create Purchase Order
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Request products from a selected warehouse for your branch.
                    </DialogDescription>
                </DialogHeader>

                {/* Scrollable Form */}
                <form
                    id="create-purchase-order-form"
                    onSubmit={
                        handleSubmit
                    }
                    className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {/* Errors */}
                    {(error ||
                        productsError ||
                        warehousesError ||
                        validationError) && (
                        <div
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                            role="alert"
                        >
                            {validationError ??
                                error ??
                                productsError ??
                                warehousesError}
                        </div>
                    )}

                    {/* Warehouse */}
                    <div className="space-y-2">
                        <label
                            htmlFor="purchase-order-warehouse"
                            className="text-sm font-medium text-slate-700"
                        >
                            Warehouse
                        </label>

                        <Select
                            value={
                                formData.warehouse_id
                            }
                            onValueChange={
                                handleWarehouseChange
                            }
                            disabled={
                                isLoading
                            }
                        >
                            <SelectTrigger
                                id="purchase-order-warehouse"
                                className="w-full border-slate-200 bg-white text-slate-900 focus:ring-blue-100"
                            >
                                <SelectValue>
                                    {(
                                        value: string | null
                                    ) => {
                                        const selectedWarehouse =
                                            activeWarehouses.find(
                                                (
                                                    warehouse
                                                ) =>
                                                    String(
                                                        warehouse.id
                                                    ) ===
                                                    value
                                            );

                                        return selectedWarehouse
                                            ? `${selectedWarehouse.name} - ${selectedWarehouse.code}`
                                            : "Select warehouse";
                                    }}
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                                {activeWarehouses.map(
                                    (
                                        warehouse
                                    ) => (
                                        <SelectItem
                                            key={
                                                warehouse.id
                                            }
                                            value={String(
                                                warehouse.id
                                            )}
                                        >
                                            {
                                                warehouse.name
                                            }{" "}
                                            —{" "}
                                            {
                                                warehouse.code
                                            }
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>

                        <p className="text-xs text-slate-500">
                            Select the warehouse that will process this request.
                        </p>

                        {activeWarehouses.length ===
                            0 &&
                            !warehousesLoading && (
                                <p className="text-sm text-amber-600">
                                    No active warehouses are available.
                                </p>
                            )}
                    </div>

                    {/* Products */}
                    <div className="space-y-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    Products
                                </label>

                                <p className="mt-1 text-xs text-slate-500">
                                    Add the products and quantities requested from the warehouse.
                                </p>
                            </div>
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
                                                    htmlFor={`purchase-order-product-${index}`}
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
                                                            value ??
                                                                ""
                                                        )
                                                    }
                                                    disabled={
                                                        isLoading
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id={`purchase-order-product-${index}`}
                                                        className="w-full border-slate-200 bg-white text-slate-900 focus:ring-blue-100"
                                                    >
                                                        <SelectValue
                                                            placeholder={
                                                                productsLoading
                                                                    ? "Loading products..."
                                                                    : "Select product"
                                                            }
                                                        >
                                                            {(
                                                                value: string | null
                                                            ) => {
                                                                const selectedProduct =
                                                                    activeProducts.find(
                                                                        (
                                                                            product
                                                                        ) =>
                                                                            String(
                                                                                product.id
                                                                            ) ===
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
                                                            ) => (
                                                                <SelectItem
                                                                    key={
                                                                        product.id
                                                                    }
                                                                    value={String(
                                                                        product.id
                                                                    )}
                                                                    disabled={isProductSelected(
                                                                        String(
                                                                            product.id
                                                                        ),
                                                                        index
                                                                    )}
                                                                >
                                                                    {
                                                                        product.name
                                                                    }{" "}
                                                                    —{" "}
                                                                    {
                                                                        product.sku
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Quantity */}
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor={`purchase-order-quantity-${index}`}
                                                    className="text-xs font-medium text-slate-600"
                                                >
                                                    Quantity
                                                </label>

                                                <Input
                                                    id={`purchase-order-quantity-${index}`}
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

                        <div className="flex justify-end pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addItem}
                                disabled={
                                    isLoading ||
                                    !activeBranchId ||
                                    activeProducts.length === 0 ||
                                    activeWarehouses.length === 0
                                }
                                className="w-full border-blue-200 bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 sm:w-auto"
                            >
                                <Plus className="mr-1.5 h-4 w-4" />
                                Add Product
                            </Button>
                        </div>

                        {activeProducts.length ===
                            0 &&
                            !productsLoading && (
                                <p className="text-sm text-amber-600">
                                    No active products are available.
                                </p>
                            )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label
                            htmlFor="purchase-order-notes"
                            className="text-sm font-medium text-slate-700"
                        >
                            Notes
                        </label>

                        <textarea
                            id="purchase-order-notes"
                            placeholder="Enter additional details or remarks"
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
                            loading
                        }
                        className="w-full border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700 sm:w-auto"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        form="create-purchase-order-form"
                        disabled={
                            isLoading ||
                            activeProducts.length ===
                                0 ||
                            activeWarehouses.length ===
                                0
                        }
                        className="w-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 sm:w-auto"
                    >
                        {loading
                            ? "Submitting..."
                            : "Submit Purchase Order"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}