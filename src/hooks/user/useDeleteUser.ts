"use client";

import { useState } from "react";

import {
    deleteUser,
    type DeleteUserResponse,
} from "@/src/services/userService";

export function useDeleteUser() {
    const [loading, setLoading] = useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const handleDeleteUser = async (
        userId: number
    ): Promise<DeleteUserResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await deleteUser(userId);

            return response;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to delete user.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleDeleteUser,
        loading,
        error,
    };
}