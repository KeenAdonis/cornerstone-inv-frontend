"use client";

import { Button } from "@/components/ui/button";

import { toast } from "@/components/ui/toast";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDeleteProduct } from "@/src/hooks/products/useDeleteProduct";

import type { Product } from "@/src/services/productService";

interface DeleteProductDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
}

export default function DeleteProductDialog({
    product,
    open,
    onOpenChange,
    onDeleted,
}: DeleteProductDialogProps) {
    const {
        remove,
        loading,
        error,
    } = useDeleteProduct();

    if (!product) {
        return null;
    }

    const handleDelete = async () => {
        const response = await remove(product.id);

        if (!response) {
            return;
        }

        toast.add({
            title: "Product Deleted",
            description:
                "Product has been deleted successfully.",
            type: "success",
        });

        onDeleted?.();
        onOpenChange(false);
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <AlertDialogContent className="border-red-100 bg-white text-slate-900">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-slate-900">
                        Delete Product
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-slate-500">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-slate-700">
                            {product.name}
                        </span>
                        ? This product will be removed from
                        the product list.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {error && (
                    <div
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={loading}
                        className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(event) => {
                            event.preventDefault();
                            handleDelete();
                        }}
                        disabled={loading}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete Product"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}