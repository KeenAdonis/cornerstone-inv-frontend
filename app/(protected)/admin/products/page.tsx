"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import AddProductDialog from "@/src/components/products/AddProductDialog";
import ProductTable from "@/src/components/products/ProductTable";

import { useProducts } from "@/src/hooks/products/useProducts";
import { useCategories } from "@/src/hooks/categories/useCategories";

export default function ProductsPage() {
    const [
        isAddProductOpen,
        setIsAddProductOpen,
    ] = useState(false);

    const {
        products,
        loading: productsLoading,
        error: productsError,
        refetch: refetchProducts,
    } = useProducts();

    const {
        categories,
        loading: categoriesLoading,
        error: categoriesError,
    } = useCategories();

    const loading =
        productsLoading ||
        categoriesLoading;

    const error =
        productsError ||
        categoriesError;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Products
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage products and product
                        information for the inventory
                        system.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() =>
                        setIsAddProductOpen(true)
                    }
                    className="w-full rounded-md bg-blue-600 text-white shadow-sm hover:bg-blue-700 sm:w-auto"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            {loading ? (
                <div className="rounded-lg border border-blue-100 bg-white px-6 py-12 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Loading products...
                    </p>
                </div>
            ) : error ? (
                <div
                    className="rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center"
                    role="alert"
                >
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                </div>
            ) : (
                <ProductTable
                    products={products}
                    categories={categories}
                    onProductUpdated={
                        refetchProducts
                    }
                />
            )}

            <AddProductDialog
                open={isAddProductOpen}
                onOpenChange={
                    setIsAddProductOpen
                }
                categories={categories}
                onCreated={
                    refetchProducts
                }
            />
        </div>
    );
}