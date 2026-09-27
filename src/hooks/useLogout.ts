"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { logout } from "@/src/services/authService";

export function useLogout() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] =
        useState<string | null>(null);

    async function handleLogout() {
        try {
            setLoading(true);
            setError(null);

            await logout();

            router.replace("/");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to log out.";

            setError(message);
        } finally {
            setLoading(false);
        }
    }

    return {
        handleLogout,
        loading,
        error,
    };
}