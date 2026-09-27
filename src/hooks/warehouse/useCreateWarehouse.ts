"use client";

import { useState } from "react";

import {
    createWarehouse,
    type CreateWarehouseData,
    type CreateWarehouseResponse,
} from "@/src/services/warehouseService";

export function useCreateWarehouse() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreateWarehouse = async (
        warehouseData: CreateWarehouseData
    ): Promise<CreateWarehouseResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await createWarehouse(warehouseData);

            return response;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to create warehouse.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleCreateWarehouse,
        loading,
        error,
    };
}