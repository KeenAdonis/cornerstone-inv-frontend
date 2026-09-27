"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    getProductRankings,
    type ProductRanking,
} from "@/src/services/productRankingService";

export function useProductRankings() {
    const [
        rankings,
        setRankings,
    ] = useState<ProductRanking[]>(
        []
    );

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchRankings =
        useCallback(async () => {
            try {
                setLoading(true);
                setError(null);

                const data =
                    await getProductRankings();

                setRankings(data);
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to load product rankings.";

                setError(message);
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        fetchRankings();
    }, [fetchRankings]);

    return {
        rankings,
        loading,
        error,
        refetch: fetchRankings,
    };
}