"use client";

import { useState } from "react";

import {
    toggleWarehouseStatus,
    type ToggleWarehouseStatusResponse,
} from "@/src/services/warehouseService";

export function useToggleWarehouseStatus() {
    const [loading, setLoading] = useState(false);
    const [error, setError] =
        useState<string | null>(null);

    const handleToggleWarehouseStatus = async (
        warehouseId: number
    ): Promise<ToggleWarehouseStatusResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await toggleWarehouseStatus(
                    warehouseId
                );

            return response;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to update warehouse status.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleToggleWarehouseStatus,
        loading,
        error,
    };
}