"use client";

import { useState } from "react";

import {
    createUser,
    type CreateUserData,
    type CreateUserResponse,
} from "@/src/services/userService";

export function useCreateUser() {
    const [loading, setLoading] = useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const handleCreateUser = async (
        userData: CreateUserData
    ): Promise<CreateUserResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await createUser(userData);

            return response;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to create user.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleCreateUser,
        loading,
        error,
    };
}