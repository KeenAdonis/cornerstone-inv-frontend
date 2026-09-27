"use client";

import { useCallback, useEffect, useState } from "react";

import {
    Category,
    getCategories,
} from "@/src/services/categoryService";

interface UseCategoriesReturn {
    categories: Category[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getCategories();

            setCategories(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to fetch categories."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories,
    };
}