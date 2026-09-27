"use client";

import { useState } from "react";

import {
    Category,
    toggleCategoryStatus,
} from "@/src/services/categoryService";

interface UseToggleCategoryStatusReturn {
    loading: boolean;
    error: string | null;
    toggle: (categoryId: number) => Promise<Category | null>;
}

export function useToggleCategoryStatus(): UseToggleCategoryStatusReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggle = async (
        categoryId: number
    ): Promise<Category | null> => {
        try {
            setLoading(true);
            setError(null);

            return await toggleCategoryStatus(categoryId);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update category status."
            );

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        toggle,
    };
}