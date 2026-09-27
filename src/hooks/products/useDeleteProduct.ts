"use client";

import { useState } from "react";

import { deleteProduct } from "@/src/services/productService";

interface UseDeleteProductReturn {
    loading: boolean;
    error: string | null;
    remove: (productId: number) => Promise<boolean>;
}

export function useDeleteProduct(): UseDeleteProductReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remove = async (productId: number): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            await deleteProduct(productId);

            return true;
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete product."
            );

            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        remove,
    };
}