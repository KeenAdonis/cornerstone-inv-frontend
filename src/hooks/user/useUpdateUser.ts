"use client";

import { useState } from "react";

import {
    updateUser,
    type UpdateUserData,
    type UpdateUserResponse,
} from "@/src/services/userService";

export function useUpdateUser() {
    const [loading, setLoading] = useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const handleUpdateUser = async (
        userId: number,
        userData: UpdateUserData
    ): Promise<UpdateUserResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await updateUser(
                    userId,
                    userData
                );

            return response;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to update user.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleUpdateUser,
        loading,
        error,
    };
}