"use client";

import { useState } from "react";

import {
    toggleBranchStatus,
    type ToggleBranchStatusResponse,
} from "@/src/services/branchService";

export function useToggleBranchStatus() {
    const [loading, setLoading] = useState(false);
    const [error, setError] =
        useState<string | null>(null);

    const handleToggleBranchStatus = async (
        branchId: number
    ): Promise<ToggleBranchStatusResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await toggleBranchStatus(branchId);

            return response;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to update branch status.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleToggleBranchStatus,
        loading,
        error,
    };
}