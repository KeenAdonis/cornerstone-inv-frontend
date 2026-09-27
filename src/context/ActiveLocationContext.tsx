"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
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

interface ActiveLocationContextValue {
    activeLocation:
        | ActiveLocation
        | null;

    setLocation: (
        location: ActiveLocation
    ) => void;

    clearLocation: () => void;

    initialized: boolean;
}

const STORAGE_KEY =
    "cornerstone_active_location";

const ActiveLocationContext =
    createContext<
        ActiveLocationContextValue | undefined
    >(undefined);

interface ActiveLocationProviderProps {
    user: AuthUser;
    children: ReactNode;
}

export function ActiveLocationProvider({
    user,
    children,
}: ActiveLocationProviderProps) {
    const [
        activeLocation,
        setActiveLocation,
    ] = useState<ActiveLocation | null>(
        null
    );

    const [initialized, setInitialized] =
        useState(false);

    useEffect(() => {
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

                return;
            }

            let defaultLocation:
                | ActiveLocation
                | null = null;

            if (
                user.role ===
                    "branch_coordinator" &&
                user.assigned_branches.length >
                    0
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
                user.assigned_warehouses
                    .length > 0
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

    return (
        <ActiveLocationContext.Provider
            value={{
                activeLocation,
                setLocation,
                clearLocation,
                initialized,
            }}
        >
            {children}
        </ActiveLocationContext.Provider>
    );
}

export function useActiveLocationContext() {
    const context =
        useContext(
            ActiveLocationContext
        );

    if (!context) {
        throw new Error(
            "useActiveLocationContext must be used within an ActiveLocationProvider."
        );
    }

    return context;
}