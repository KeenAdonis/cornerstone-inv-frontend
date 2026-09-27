"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import type { AuthUser } from "@/src/services/authService";

export type ActiveLocationType =
    | "branch"
    | "warehouse";

export interface ActiveLocation {
    type: ActiveLocationType;
    id: number;
}

const STORAGE_KEY =
    "cornerstone_active_location";

export function useActiveLocation(
    user: AuthUser | null
) {
    const [activeLocation, setActiveLocation] =
        useState<ActiveLocation | null>(null);

    const [initialized, setInitialized] =
        useState(false);

    useEffect(() => {
        if (!user) {
            setActiveLocation(null);
            setInitialized(false);
            return;
        }

        try {
            const storedLocation =
                localStorage.getItem(
                    STORAGE_KEY
                );

            let savedLocation:
                | ActiveLocation
                | null = null;

            if (storedLocation) {
                try {
                    const parsedLocation =
                        JSON.parse(
                            storedLocation
                        );

                    if (
                        parsedLocation &&
                        (
                            parsedLocation.type ===
                                "branch" ||
                            parsedLocation.type ===
                                "warehouse"
                        ) &&
                        Number.isInteger(
                            parsedLocation.id
                        )
                    ) {
                        savedLocation =
                            parsedLocation;
                    }
                } catch {
                    localStorage.removeItem(
                        STORAGE_KEY
                    );
                }
            }

            const hasValidSavedLocation =
                savedLocation &&
                (
                    savedLocation.type ===
                        "branch"
                        ? user.assigned_branches.some(
                              (branch) =>
                                  branch.id ===
                                  savedLocation?.id
                          )
                        : user.assigned_warehouses.some(
                              (warehouse) =>
                                  warehouse.id ===
                                  savedLocation?.id
                          )
                );

            if (hasValidSavedLocation) {
                setActiveLocation(
                    savedLocation
                );

                setInitialized(true);

                return;
            }

            let defaultLocation:
                | ActiveLocation
                | null = null;

            if (
                user.role ===
                    "branch_coordinator" &&
                user.assigned_branches.length > 0
            ) {
                defaultLocation = {
                    type: "branch",
                    id:
                        user.assigned_branches[0]
                            .id,
                };
            }

            if (
                user.role ===
                    "warehouse_coordinator" &&
                user.assigned_warehouses.length >
                    0
            ) {
                defaultLocation = {
                    type: "warehouse",
                    id:
                        user.assigned_warehouses[0]
                            .id,
                };
            }

            setActiveLocation(
                defaultLocation
            );

            if (defaultLocation) {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(
                        defaultLocation
                    )
                );
            } else {
                localStorage.removeItem(
                    STORAGE_KEY
                );
            }
        } finally {
            setInitialized(true);
        }
    }, [user]);

    const setLocation =
        useCallback(
            (location: ActiveLocation) => {
                if (!user) {
                    return;
                }

                const isAssigned =
                    location.type ===
                    "branch"
                        ? user.assigned_branches.some(
                              (branch) =>
                                  branch.id ===
                                  location.id
                          )
                        : user.assigned_warehouses.some(
                              (warehouse) =>
                                  warehouse.id ===
                                  location.id
                          );

                if (!isAssigned) {
                    return;
                }

                setActiveLocation(
                    location
                );

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(location)
                );
            },
            [user]
        );

    const clearLocation =
        useCallback(() => {
            setActiveLocation(null);

            localStorage.removeItem(
                STORAGE_KEY
            );
        }, []);

    return {
        activeLocation,
        setLocation,
        clearLocation,
        initialized,
    };
}