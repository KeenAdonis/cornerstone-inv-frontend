"use client";

import { useState } from "react";

import {
    deleteWarehouse,
    type DeleteWarehouseResponse,
} from "@/src/services/warehouseService";

export function useDeleteWarehouse() {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const handleDeleteWarehouse = async (
        warehouseId: number
    ): Promise<DeleteWarehouseResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await deleteWarehouse(warehouseId);

            return response;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to delete warehouse.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleDeleteWarehouse,
        loading,
        error,
    };
}