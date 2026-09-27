"use client";

import {
    useEffect,
    useState,
} from "react";
import { useRouter } from "next/navigation";

import {
    AuthUser,
    getAuthenticatedUser,
} from "@/src/services/authService";

export function useAuth() {
    const router = useRouter();

    const [user, setUser] =
        useState<AuthUser | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        async function checkAuthentication() {
            try {
                const authenticatedUser =
                    await getAuthenticatedUser();

                setUser(authenticatedUser);
            } catch {
                router.replace("/");
            } finally {
                setLoading(false);
            }
        }

        checkAuthentication();
    }, [router]);

    return {
        user,
        loading,
    };
}