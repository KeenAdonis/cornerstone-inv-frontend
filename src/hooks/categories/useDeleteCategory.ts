"use client";

import { useState } from "react";

import { deleteCategory } from "@/src/services/categoryService";

interface UseDeleteCategoryReturn {
    loading: boolean;
    error: string | null;
    remove: (categoryId: number) => Promise<boolean>;
}

export function useDeleteCategory(): UseDeleteCategoryReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remove = async (categoryId: number): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);

            await deleteCategory(categoryId);

            return true;
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to delete category."
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