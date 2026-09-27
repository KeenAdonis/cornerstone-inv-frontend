"use client";

import { useState } from "react";

import {
    createBranch,
    type CreateBranchData,
    type CreateBranchResponse,
} from "@/src/services/branchService";

export function useBranches() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateBranch = async (
        branchData: CreateBranchData
    ): Promise<CreateBranchResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response = await createBranch(branchData);

            return response;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to create branch.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleCreateBranch,
        loading,
        error,
    };
}