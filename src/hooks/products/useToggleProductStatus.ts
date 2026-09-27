"use client";

import { useState } from "react";

import {
    toggleProductStatus,
    type Product,
} from "@/src/services/productService";

export function useToggleProductStatus() {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function toggle(
        productId: number
    ): Promise<Product | null> {
        try {
            setLoading(true);
            setError(null);

            const product =
                await toggleProductStatus(
                    productId
                );

            return product;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to update product status.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    }

    return {
        toggle,
        loading,
        error,
    };
}