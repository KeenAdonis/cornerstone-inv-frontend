"use client";

import { useCallback, useEffect, useState } from "react";

import {
    getBranches,
    type Branch,
} from "@/src/services/branchService";

export function useBranches() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBranches = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getBranches();

            setBranches(data);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to retrieve branches.";

            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    return {
        branches,
        loading,
        error,
        refetch: fetchBranches,
    };
}