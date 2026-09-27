"use client";

import { useState } from "react";

import {
    toggleUserStatus,
    type ToggleUserStatusResponse,
} from "@/src/services/userService";

export function useToggleUserStatus() {
    const [loading, setLoading] = useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const handleToggleUserStatus = async (
        userId: number
    ): Promise<ToggleUserStatusResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await toggleUserStatus(userId);

            return response;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to update user status.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleToggleUserStatus,
        loading,
        error,
    };
}