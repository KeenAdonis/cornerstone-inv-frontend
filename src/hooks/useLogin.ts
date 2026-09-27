"use client";

import { useState } from "react";
import {
    login,
    type LoginCredentials,
    type LoginResponse,
} from "@/src/services/authService";

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (
        credentials: LoginCredentials
    ): Promise<LoginResponse | null> => {
        try {
            setLoading(true);
            setError(null);

            const response = await login(credentials);

            return response;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to sign in.";

            setError(message);

            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleLogin,
        loading,
        error,
    };
}