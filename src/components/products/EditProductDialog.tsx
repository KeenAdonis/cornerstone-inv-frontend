"use client";

import {
    ChangeEvent,
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
    product_code: string;
    name: string;
    sku: string;
    unit: string;
    srp: string;
    description: string;
    status: string;
}

const emptyFormData: ProductFormData = {
    category_id: "",
    product_code: "",
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
        useState<ProductFormData>(emptyFormData);

    const [selectedImage, setSelectedImage] =
        useState<File | null>(null);

    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    const {
        update,
        loading,
        error,
    } = useUpdateProduct();

    useEffect(() => {
        if (!product) {
            setFormData(emptyFormData);
            clearSelectedImage();
            return;
        }

        setFormData({
            category_id: String(product.category_id),
            product_code: product.product_code ?? "",
            name: product.name,
            sku: product.sku,
            unit: product.unit,
            srp: String(product.srp),
            description: product.description ?? "",
            status: product.status,
        });

        clearSelectedImage();
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
            category_id: Number(formData.category_id),
            product_code:
                formData.product_code.trim() ||
                undefined,
            name: formData.name.trim(),
            sku: formData.sku.trim(),
            unit: formData.unit.trim(),
            srp: Number(formData.srp),
            description:
                formData.description.trim() ||
                undefined,
            status:
                formData.status as UpdateProductData["status"],
            image: selectedImage ?? undefined,
        };

        const response = await update(
            product.id,
            productData
        );

        if (!response) {
            return;
        }

        toast.add({
            title: "Product Updated",
            description:
                "Product has been updated successfully.",
            type: "success",
        });

        onUpdated?.();

        onOpenChange(false);
    };

    const handleImageChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (
            ![
                "image/jpeg",
                "image/png",
                "image/webp",
            ].includes(file.type)
        ) {
            toast.add({
                title: "Invalid Image",
                description:
                    "Choose a JPG, PNG, or WebP image.",
                type: "error",
            });

            event.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.add({
                title: "Image Too Large",
                description:
                    "The image must not exceed 2 MB.",
                type: "error",
            });

            event.target.value = "";
            return;
        }

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const clearSelectedImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setSelectedImage(null);
        setImagePreview(null);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value && !loading) {
                    clearSelectedImage();
                }
            
                onOpenChange(value);
            }}
        >
            <DialogContent className="flex max-h-[94vh] flex-col border-blue-100 bg-white text-slate-900 sm:max-w-xl">
                <DialogHeader className="shrink-0 border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Edit Product
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Update product information and
                        status.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="edit-product-form"
                    onSubmit={handleSubmit}
                    className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    <div className="space-y-5">
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

                        {/* Product Image */}
                        <div className="space-y-2">
                            <label
                                htmlFor="edit-product-image"
                                className="text-sm font-medium text-slate-700"
                            >
                                Product Image
                            </label>

                            <div className="flex flex-col gap-4 rounded-lg border border-dashed border-slate-300 p-4 sm:flex-row sm:items-center">
                                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                    {imagePreview || product?.image_url ? (
                                        <img
                                            src={imagePreview ?? product?.image_url ?? ""}
                                            alt="Product preview"
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <span className="px-2 text-center text-xs text-slate-400">
                                            No image available
                                        </span>
                                    )}
                                </div>
                                
                                <div className="min-w-0 flex-1 space-y-2">
                                    <Input
                                        id="edit-product-image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageChange}
                                        disabled={loading}
                                        className="border-slate-200 bg-white text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-blue-700"
                                    />

                                    <p className="text-xs text-slate-500">
                                        JPG, PNG, or WebP. Maximum size: 2 MB.
                                    </p>
                                
                                    {selectedImage && (
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="truncate text-xs text-slate-600">
                                                {selectedImage.name}
                                            </p>
                                    
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={clearSelectedImage}
                                                disabled={loading}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Product Code and SKU */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            {/* Product Code */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="edit-product-code"
                                    className="text-sm font-medium text-slate-700"
                                >
                                    Product Code
                                </label>

                                <Input
                                    id="edit-product-code"
                                    type="text"
                                    placeholder="Enter product code"
                                    value={
                                        formData.product_code
                                    }
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            product_code:
                                                event.target
                                                    .value,
                                        })
                                    }
                                    disabled={loading}
                                    className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
                                />
                            </div>

                            {/* SKU */}
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
                                            sku: event.target
                                                .value,
                                        })
                                    }
                                    required
                                    disabled={loading}
                                    className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
                                />
                            </div>
                        </div>

                        {/* Unit */}
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
                                        unit: event.target
                                            .value,
                                    })
                                }
                                required
                                disabled={loading}
                                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
                            />
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
                                        srp: event.target
                                            .value,
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
                                            event.target
                                                .value,
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
                    </div>
                </form>

                <DialogFooter className="shrink-0 border-t border-blue-100 bg-blue-50/60 pt-5">
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
                        form="edit-product-form"
                        disabled={
                            loading || !product
                        }
                        className="bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                    >
                        {loading
                            ? "Saving..."
                            : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}