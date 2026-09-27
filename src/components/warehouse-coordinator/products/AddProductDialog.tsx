"use client";

import { FormEvent, useState } from "react";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useCreateProduct } from "@/src/hooks/products/useCreateProduct";

import type {
    CreateProductData,
} from "@/src/services/productService";

interface AddProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: {
        id: number;
        name: string;
    }[];
    onCreated?: () => void;
}

interface ProductFormData {
    category_id: string;
    name: string;
    sku: string;
    unit: string;
    srp: string;
    description: string;
    status: string;
}

const initialFormData: ProductFormData = {
    category_id: "",
    name: "",
    sku: "",
    unit: "",
    srp: "",
    description: "",
    status: "active",
};

export default function AddProductDialog({
    open,
    onOpenChange,
    categories,
    onCreated,
}: AddProductDialogProps) {
    const [formData, setFormData] =
        useState<ProductFormData>(
            initialFormData
        );

    const {
        create,
        loading,
        error,
    } = useCreateProduct();

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            !formData.category_id ||
            !formData.name.trim() ||
            !formData.sku.trim() ||
            !formData.unit.trim() ||
            !formData.srp
        ) {
            return;
        }

        const productData: CreateProductData = {
            category_id: Number(
                formData.category_id
            ),
            name: formData.name.trim(),
            sku: formData.sku.trim(),
            unit: formData.unit.trim(),
            srp: Number(formData.srp),
            description:
                formData.description.trim() ||
                undefined,
            status:
                formData.status as CreateProductData["status"],
        };

        const response = await create(
            productData
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
            setFormData(initialFormData);
        }

        onOpenChange(value);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent className="border-blue-100 bg-white text-slate-900 sm:max-w-xl">
                <DialogHeader className="border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Add Product
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Create a new product for the
                        inventory system.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {error && (
                        <div
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Category
                        </label>

                        <Select
                            value={
                                formData.category_id
                            }
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    category_id:
                                        value ?? "",
                                })
                            }
                            disabled={loading}
                        >
                            <SelectTrigger className="w-full border-slate-200 bg-white text-slate-900 focus:ring-blue-100">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>

                            <SelectContent>
                                {categories.map(
                                    (category) => (
                                        <SelectItem
                                            key={
                                                category.id
                                            }
                                            value={String(
                                                category.id
                                            )}
                                        >
                                            {
                                                category.name
                                            }
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Product Name */}
                    <div className="space-y-2">
                        <label
                            htmlFor="product-name"
                            className="text-sm font-medium text-slate-700"
                        >
                            Product Name
                        </label>

                        <Input
                            id="product-name"
                            type="text"
                            placeholder="Enter product name"
                            value={formData.name}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    name: event.target.value,
                                })
                            }
                            required
                            disabled={loading}
                            className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
                        />
                    </div>

                    {/* SKU and Unit */}
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="product-sku"
                                className="text-sm font-medium text-slate-700"
                            >
                                SKU
                            </label>

                            <Input
                                id="product-sku"
                                type="text"
                                placeholder="Enter SKU"
                                value={formData.sku}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        sku: event.target.value,
                                    })
                                }
                                required
                                disabled={loading}
                                className="border-slate-200 bg-white font-mono text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="product-unit"
                                className="text-sm font-medium text-slate-700"
                            >
                                Unit
                            </label>

                            <Input
                                id="product-unit"
                                type="text"
                                placeholder="e.g. piece, box"
                                value={formData.unit}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        unit: event.target.value,
                                    })
                                }
                                required
                                disabled={loading}
                                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
                            />
                        </div>
                    </div>

                    {/* SRP */}
                    <div className="space-y-2">
                        <label
                            htmlFor="product-srp"
                            className="text-sm font-medium text-slate-700"
                        >
                            Suggested Retail Price
                        </label>

                        <Input
                            id="product-srp"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.srp}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    srp: event.target.value,
                                })
                            }
                            required
                            disabled={loading}
                            className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label
                            htmlFor="product-description"
                            className="text-sm font-medium text-slate-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="product-description"
                            placeholder="Enter product description"
                            rows={4}
                            value={
                                formData.description
                            }
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    description:
                                        event.target.value,
                                })
                            }
                            disabled={loading}
                            className="flex w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-blue-400 focus:ring-1 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Status
                        </label>

                        <Select
                            value={formData.status}
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    status:
                                        value ??
                                        "active",
                                })
                            }
                            disabled={loading}
                        >
                            <SelectTrigger className="w-full border-slate-200 bg-white text-slate-900 focus:ring-blue-100">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="active">
                                    Active
                                </SelectItem>

                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                            </SelectContent>
                        </Select>
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
                            disabled={loading}
                            className="border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}