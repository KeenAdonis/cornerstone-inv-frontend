"use client";

import {
    LogOut,
    Menu,
    MapPin,
} from "lucide-react";

import { useAuth } from "@/src/hooks/useAuth";
import { useLogout } from "@/src/hooks/useLogout";

import {
    useActiveLocationContext,
} from "@/src/context/ActiveLocationContext";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AppHeaderProps {
    onMenuClick?: () => void;
}

export default function AppHeader({
    onMenuClick,
}: AppHeaderProps) {
    const { user } = useAuth();

    const {
        handleLogout,
        loading: logoutLoading,
        error: logoutError,
    } = useLogout();

    const {
        activeLocation,
        setLocation,
        initialized,
    } = useActiveLocationContext();

    const isBranchCoordinator =
        user?.role ===
        "branch_coordinator";

    const isWarehouseCoordinator =
        user?.role ===
        "warehouse_coordinator";

    const activeBranch =
        isBranchCoordinator &&
        activeLocation?.type === "branch"
            ? user.assigned_branches.find(
                  (branch) =>
                      branch.id ===
                      activeLocation.id
              )
            : null;

    const activeWarehouse =
        isWarehouseCoordinator &&
        activeLocation?.type ===
            "warehouse"
            ? user.assigned_warehouses.find(
                  (warehouse) =>
                      warehouse.id ===
                      activeLocation.id
              )
            : null;

    const activeLocationValue =
        activeLocation
            ? `${activeLocation.type}:${activeLocation.id}`
            : "";

    function handleLocationChange(
        value: string | null
    ) {
        if (!value) {
            return;
        }

        const [
            type,
            id,
        ] = value.split(":");

        const locationId =
            Number(id);

        if (
            (
                type !== "branch" &&
                type !== "warehouse"
            ) ||
            !Number.isInteger(
                locationId
            )
        ) {
            return;
        }

        setLocation({
            type,
            id: locationId,
        });
    }

    return (
        <>
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                        aria-label="Open navigation menu"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                            Cornerstone Inventory System
                        </p>

                        {user && (
                            <p className="truncate text-xs text-slate-500">
                                {user.name}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    {initialized &&
                        isBranchCoordinator &&
                        user.assigned_branches.length >
                            0 && (
                            <div className="hidden items-center gap-2 sm:flex">
                                <MapPin className="h-4 w-4 text-slate-400" />

                                <Select
                                    value={
                                        activeLocationValue
                                    }
                                    onValueChange={
                                        handleLocationChange
                                    }
                                >
                                    <SelectTrigger className="w-52 border-slate-200 bg-white text-sm">
                                        <SelectValue placeholder="Select branch">
                                            {activeBranch
                                                ? `${activeBranch.name} · ${activeBranch.code}`
                                                : "Select branch"}
                                        </SelectValue>
                                    </SelectTrigger>

                                    <SelectContent>
                                        {user.assigned_branches.map(
                                            (
                                                branch
                                            ) => (
                                                <SelectItem
                                                    key={
                                                        branch.id
                                                    }
                                                    value={`branch:${branch.id}`}
                                                >
                                                    {
                                                        branch.name
                                                    }{" "}
                                                    ·{" "}
                                                    {
                                                        branch.code
                                                    }
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                    {initialized &&
                        isWarehouseCoordinator &&
                        user.assigned_warehouses.length >
                            0 && (
                            <div className="hidden items-center gap-2 sm:flex">
                                <MapPin className="h-4 w-4 text-slate-400" />

                                <Select
                                    value={
                                        activeLocationValue
                                    }
                                    onValueChange={
                                        handleLocationChange
                                    }
                                >
                                    <SelectTrigger className="w-52 border-slate-200 bg-white text-sm">
                                        <SelectValue placeholder="Select warehouse">
                                            {activeWarehouse
                                                ? `${activeWarehouse.name} · ${activeWarehouse.code}`
                                                : "Select warehouse"}
                                        </SelectValue>
                                    </SelectTrigger>

                                    <SelectContent>
                                        {user.assigned_warehouses.map(
                                            (
                                                warehouse
                                            ) => (
                                                <SelectItem
                                                    key={
                                                        warehouse.id
                                                    }
                                                    value={`warehouse:${warehouse.id}`}
                                                >
                                                    {
                                                        warehouse.name
                                                    }{" "}
                                                    ·{" "}
                                                    {
                                                        warehouse.code
                                                    }
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={
                            logoutLoading
                        }
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
                    >
                        <LogOut className="h-4 w-4" />

                        <span className="hidden sm:inline">
                            {logoutLoading
                                ? "Signing out..."
                                : "Logout"}
                        </span>
                    </button>
                </div>
            </header>

            {logoutError && (
                <div
                    className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 sm:px-6"
                    role="alert"
                >
                    {logoutError}
                </div>
            )}
        </>
    );
}