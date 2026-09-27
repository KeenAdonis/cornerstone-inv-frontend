"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getProducts,
    type Product,
} from "@/src/services/productService";

export function useProducts() {
    const [products, setProducts] =
        useState<Product[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchProducts =
        useCallback(async () => {
            try {
                setLoading(true);
                setError(null);

                const data =
                    await getProducts();

                setProducts(data);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to load products.";

                setError(message);
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
    };
}