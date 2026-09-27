"use client";

import { useState } from "react";

import {
    Category,
    UpdateCategoryData,
    updateCategory,
} from "@/src/services/categoryService";

interface UseUpdateCategoryReturn {
    loading: boolean;
    error: string | null;
    update: (
        categoryId: number,
        data: UpdateCategoryData
    ) => Promise<Category | null>;
}

export function useUpdateCategory(): UseUpdateCategoryReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = async (
        categoryId: number,
        data: UpdateCategoryData
    ): Promise<Category | null> => {
        try {
            setLoading(true);
            setError(null);

            return await updateCategory(categoryId, data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update category."
            );

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        update,
    };
}