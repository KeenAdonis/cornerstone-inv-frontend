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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useUpdateProduct } from "@/src/hooks/products/useUpdateProduct";

import type {
    Product,
    UpdateProductData,
} from "@/src/services/productService";

interface EditProductDialogProps {
    product: Product | null;
    categories: {
        id: number;
        name: string;
    }[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdated?: () => void;
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

const emptyFormData: ProductFormData = {
    category_id: "",
    name: "",
    sku: "",
    unit: "",
    srp: "",
    description: "",
    status: "active",
};

export default function EditProductDialog({
    product,
    categories,
    open,
    onOpenChange,
    onUpdated,
}: EditProductDialogProps) {
    const [formData, setFormData] =
        useState<ProductFormData>(
            emptyFormData
        );

    const {
        update,
        loading,
        error,
    } = useUpdateProduct();

    useEffect(() => {
        if (!product) {
            setFormData(emptyFormData);
            return;
        }

        setFormData({
            category_id: String(
                product.category_id
            ),
            name: product.name,
            sku: product.sku,
            unit: product.unit,
            srp: product.srp,
            description:
                product.description ?? "",
            status: product.status,
        });
    }, [product]);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            !product ||
            !formData.category_id ||
            !formData.name.trim() ||
            !formData.sku.trim() ||
            !formData.unit.trim() ||
            !formData.srp
        ) {
            return;
        }

        const productData: UpdateProductData = {
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
                formData.status as UpdateProductData["status"],
        };

        const response = await update(
            product.id,
            productData
        );

        if (!response) {
            return;
        }

        onUpdated?.();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="border-blue-100 bg-white text-slate-900 sm:max-w-xl">
                <DialogHeader className="border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Edit Product
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Update product information and
                        status.
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
                            htmlFor="edit-product-name"
                            className="text-sm font-medium text-slate-700"
                        >
                            Product Name
                        </label>

                        <Input
                            id="edit-product-name"
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
                                htmlFor="edit-product-sku"
                                className="text-sm font-medium text-slate-700"
                            >
                                SKU
                            </label>

                            <Input
                                id="edit-product-sku"
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
                                htmlFor="edit-product-unit"
                                className="text-sm font-medium text-slate-700"
                            >
                                Unit
                            </label>

                            <Input
                                id="edit-product-unit"
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
                            htmlFor="edit-product-srp"
                            className="text-sm font-medium text-slate-700"
                        >
                            Suggested Retail Price
                        </label>

                        <Input
                            id="edit-product-srp"
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
                            htmlFor="edit-product-description"
                            className="text-sm font-medium text-slate-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="edit-product-description"
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
                                onOpenChange(false)
                            }
                            disabled={loading}
                            className="border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                loading ||
                                !product
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