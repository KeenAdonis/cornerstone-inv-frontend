"use client";

import { useState } from "react";

import {
    deleteBranch,
    type DeleteBranchResponse,
} from "@/src/services/branchService";

export function useDeleteBranch() {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const handleDeleteBranch = async (
        branchId: number
    ): Promise<DeleteBranchResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await deleteBranch(branchId);

            return response;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to delete branch.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleDeleteBranch,
        loading,
        error,
    };
}