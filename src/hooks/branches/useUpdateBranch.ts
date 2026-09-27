"use client";

import { useState } from "react";

import {
    updateBranch,
    type UpdateBranchData,
    type UpdateBranchResponse,
} from "@/src/services/branchService";

export function useUpdateBranch() {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const handleUpdateBranch = async (
        branchId: number,
        branchData: UpdateBranchData
    ): Promise<UpdateBranchResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await updateBranch(
                    branchId,
                    branchData
                );

            return response;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to update branch.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleUpdateBranch,
        loading,
        error,
    };
}