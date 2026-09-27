"use client";

import { useState } from "react";

import {
    updateProduct,
    type UpdateProductData,
    type Product,
} from "@/src/services/productService";

export function useUpdateProduct() {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function update(
        productId: number,
        productData: UpdateProductData
    ): Promise<Product | null> {
        try {
            setLoading(true);
            setError(null);

            const product =
                await updateProduct(
                    productId,
                    productData
                );

            return product;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to update product.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        update,
        loading,
        error,
    };
}