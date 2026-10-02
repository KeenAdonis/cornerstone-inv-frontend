"use client";

import {
    Menu,
    PanelLeftClose,
    PanelRightClose,
    MapPin,
} from "lucide-react";

import { usePathname } from "next/navigation";

import {
    getNavigationItems,
} from "@/src/config/navigation";

import { useAuth } from "@/src/hooks/useAuth";

import {
    useActiveLocationContext,
} from "@/src/context/ActiveLocationContext";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";

interface AppHeaderProps {
    collapsed: boolean;
    onToggle: () => void;
    onMenuClick?: () => void;
}

export default function AppHeader({
    collapsed,
    onToggle,
    onMenuClick,
}: AppHeaderProps) {
    const pathname = usePathname();

    const { user } = useAuth();

    const {
        activeLocation,
        setLocation,
        initialized,
    } = useActiveLocationContext();

    /*
     * ============================================================
     * NAVIGATION
     * ============================================================
     */

    const navigationItems = user
        ? getNavigationItems(user.role)
        : [];

    const activeNavigationItem =
        navigationItems.find(
            (item) =>
                pathname === item.href ||
                pathname.startsWith(
                    `${item.href}/`
                )
        );

    const activeNavigationLabel =
        activeNavigationItem?.label ??
        "Dashboard";

    /*
     * ============================================================
     * ACTIVE LOCATION
     * ============================================================
     */

    const isBranchCoordinator =
        user?.role ===
        "branch_coordinator";

    const isWarehouseCoordinator =
        user?.role ===
        "warehouse_coordinator";

    const activeBranch =
        isBranchCoordinator &&
        activeLocation?.type ===
            "branch"
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

    const hasLocationSelector =
        initialized &&
        (
            (
                isBranchCoordinator &&
                user.assigned_branches.length >
                    0
            ) ||
            (
                isWarehouseCoordinator &&
                user.assigned_warehouses.length >
                    0
            )
        );

    const activeLocationName =
        activeBranch?.name ??
        activeWarehouse?.name ??
        "";

    const activeLocationCode =
        activeBranch?.code ??
        activeWarehouse?.code ??
        "";

    const activeLocationLabel =
        activeLocationName
            ? `${activeLocationName} · ${activeLocationCode}`
            : "";

    /*
     * ============================================================
     * LOCATION CHANGE
     * ============================================================
     */

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
        <header className="relative z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-6">
            {/* ================================================== */}
            {/* LEFT SIDE */}
            {/* ================================================== */}

            <div className="flex min-w-0 items-center gap-2">
                {/* Mobile Menu */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                    aria-label="Open navigation menu"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Desktop Sidebar Toggle */}
                <button
                    type="button"
                    onClick={onToggle}
                    className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 lg:inline-flex"
                    aria-label={
                        collapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                    title={
                        collapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                >
                    {collapsed ? (
                        <PanelRightClose className="h-5 w-5" />
                    ) : (
                        <PanelLeftClose className="h-5 w-5" />
                    )}
                </button>

                {/* Divider */}
                <div className="hidden h-6 w-px bg-slate-200 sm:block" />

                {/* Active Navigation */}
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                        {activeNavigationLabel}
                    </p>
                </div>
            </div>

            {/* ================================================== */}
            {/* RIGHT SIDE - ACTIVE LOCATION */}
            {/* ================================================== */}

            {hasLocationSelector && (
                <div className="relative ml-3 shrink-0">
                    <Select
                        value={activeLocationValue}
                        onValueChange={
                            handleLocationChange
                        }
                    >
                        <SelectTrigger
                            aria-label="Select active location"
                            title={
                                activeLocationLabel ||
                                (
                                    isBranchCoordinator
                                        ? "Select branch"
                                        : "Select warehouse"
                                )
                            }
                            className="h-10 w-auto min-w-0 gap-2 border-0 bg-transparent px-2 text-slate-800 shadow-none hover:bg-blue-50/60 focus:ring-0 focus:ring-offset-0 sm:h-11 sm:px-3"
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <MapPin className="h-4 w-4 shrink-0 text-slate-500" />

                                <div className="flex min-w-0 items-center gap-1.5">
                                    <span className="max-w-32 truncate text-sm font-medium text-slate-800 sm:max-w-48">
                                        {activeLocationName ||
                                            (
                                                isBranchCoordinator
                                                    ? "Select branch"
                                                    : "Select warehouse"
                                            )}
                                    </span>

                                    {activeLocationCode && (
                                        <>
                                            <span className="hidden shrink-0 text-slate-300 sm:inline">
                                                ·
                                            </span>

                                            <span className="hidden max-w-20 shrink-0 truncate text-xs text-slate-500 sm:inline">
                                                {activeLocationCode}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SelectTrigger>

                        <SelectContent
                            className="z-[70] min-w-[260px] max-w-[calc(100vw-2rem)]"
                        >
                            {isBranchCoordinator &&
                                user.assigned_branches.map(
                                    (branch) => (
                                        <SelectItem
                                            key={
                                                branch.id
                                            }
                                            value={`branch:${branch.id}`}
                                            className="py-2.5"
                                        >
                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate font-medium text-slate-800">
                                                    {
                                                        branch.name
                                                    }
                                                </span>

                                                <span className="mt-0.5 text-xs text-slate-500">
                                                    {
                                                        branch.code
                                                    }
                                                </span>
                                            </div>
                                        </SelectItem>
                                    )
                                )}

                            {isWarehouseCoordinator &&
                                user.assigned_warehouses.map(
                                    (
                                        warehouse
                                    ) => (
                                        <SelectItem
                                            key={
                                                warehouse.id
                                            }
                                            value={`warehouse:${warehouse.id}`}
                                            className="py-2.5"
                                        >
                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate font-medium text-slate-800">
                                                    {
                                                        warehouse.name
                                                    }
                                                </span>

                                                <span className="mt-0.5 text-xs text-slate-500">
                                                    {
                                                        warehouse.code
                                                    }
                                                </span>
                                            </div>
                                        </SelectItem>
                                    )
                                )}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </header>
    );
}