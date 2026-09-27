"use client";

import { useState } from "react";

import {
    createProduct,
    type CreateProductData,
    type Product,
} from "@/src/services/productService";

export function useCreateProduct() {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function create(
        productData: CreateProductData
    ): Promise<Product | null> {
        try {
            setLoading(true);
            setError(null);

            const product =
                await createProduct(productData);

            return product;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to create product.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        create,
        loading,
        error,
    };
}