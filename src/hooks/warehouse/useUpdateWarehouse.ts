"use client";

import { useState } from "react";

import {
    updateWarehouse,
    type UpdateWarehouseData,
    type UpdateWarehouseResponse,
} from "@/src/services/warehouseService";

export function useUpdateWarehouse() {
    const [loading, setLoading] = useState(false);
    const [error, setError] =
        useState<string | null>(null);

    const handleUpdateWarehouse = async (
        warehouseId: number,
        warehouseData: UpdateWarehouseData
    ): Promise<UpdateWarehouseResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await updateWarehouse(
                    warehouseId,
                    warehouseData
                );

            return response;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to update warehouse.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleUpdateWarehouse,
        loading,
        error,
    };
}