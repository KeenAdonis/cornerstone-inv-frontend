"use client";

import { useState } from "react";

import {
    Category,
    CreateCategoryData,
    createCategory,
} from "@/src/services/categoryService";

interface UseCreateCategoryReturn {
    loading: boolean;
    error: string | null;
    create: (data: CreateCategoryData) => Promise<Category | null>;
}

export function useCreateCategory(): UseCreateCategoryReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (
        data: CreateCategoryData
    ): Promise<Category | null> => {
        try {
            setLoading(true);
            setError(null);

            return await createCategory(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create category."
            );

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        create,
    };
}