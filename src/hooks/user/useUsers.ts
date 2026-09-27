"use client";

import { useEffect, useState } from "react";

import {
    getUsers,
    type User,
} from "@/src/services/userService";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getUsers();

            setUsers(data);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to retrieve users.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error,
        refetch: fetchUsers,
    };
}