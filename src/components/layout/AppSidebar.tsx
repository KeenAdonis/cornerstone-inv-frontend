"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Boxes,
    ChevronLeft,
    ChevronRight,
    MapPin,
    X,
} from "lucide-react";

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
    SelectValue,
} from "@/components/ui/select";

interface AppSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

export default function AppSidebar({
    collapsed,
    onToggle,
    mobileOpen = false,
    onMobileClose,
}: AppSidebarProps) {
    const pathname = usePathname();

    const {
        user,
        loading,
    } = useAuth();

    const {
        activeLocation,
        setLocation,
        initialized,
    } = useActiveLocationContext();

    const navigationItems =
        user
            ? getNavigationItems(user.role)
            : [];

    const dashboardItem =
        navigationItems.find(
            (item) =>
                item.label === "Dashboard"
        );

    const dashboardHref =
        dashboardItem?.href ?? "/";

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
        <>
            {/* ================================================== */}
            {/* MOBILE BACKDROP */}
            {/* ================================================== */}

            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={onMobileClose}
                    className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
                />
            )}

            {/* ================================================== */}
            {/* SIDEBAR */}
            {/* ================================================== */}

            <aside
                className={[
                    "fixed inset-y-0 left-0 z-50 flex min-h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:static lg:z-auto",
                    mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0",
                    "w-72",
                    collapsed
                        ? "lg:w-20"
                        : "lg:w-72",
                ].join(" ")}
            >
                {/* ================================================== */}
                {/* SIDEBAR HEADER */}
                {/* ================================================== */}

                <div className="flex h-16 shrink-0 items-center justify-between border-b border-blue-100 px-4">
                    <Link
                        href={dashboardHref}
                        className="flex min-w-0 items-center gap-3"
                        onClick={onMobileClose}
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                            <Boxes className="h-5 w-5" />
                        </div>

                        <div
                            className={[
                                "min-w-0",
                                collapsed
                                    ? "lg:hidden"
                                    : "",
                            ].join(" ")}
                        >
                            <p className="truncate text-sm font-bold uppercase tracking-tight text-slate-900">
                                Cornerstone Multi Sales
                            </p>
                        
                            <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                Inventory System Workflow
                            </p>
                        </div>
                    </Link>
                        
                    <button
                        type="button"
                        onClick={onMobileClose}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-slate-900 lg:hidden"
                        aria-label="Close navigation menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* ================================================== */}
                {/* ACTIVE LOCATION */}
                {/* ================================================== */}

                {hasLocationSelector && (
                    <div className="shrink-0 border-b border-slate-100 p-3">
                        <Select
                            value={activeLocationValue}
                            onValueChange={handleLocationChange}
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
                                className={[
                                    "h-11 min-w-0 border-0 bg-transparent p-0 text-sm text-slate-800 shadow-none",
                                    "hover:bg-transparent",
                                    "focus:ring-0",
                                    "focus:ring-offset-0",
                                    "[&>svg:last-child]:shrink-0",
                                    collapsed
                                        ? "w-full justify-center [&>svg:last-child]:hidden"
                                        : "w-full",
                                ].join(" ")}
                            >
                                {collapsed ? (
                                    <div
                                        className={[
                                            "flex h-11 w-full items-center justify-center rounded-lg transition",
                                            "text-slate-500 hover:bg-blue-50 hover:text-blue-700",
                                        ].join(" ")}
                                    >
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                ) : (
                                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-3 py-2.5 transition hover:bg-blue-50/60">
                                        <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                                
                                        <div className="flex min-w-0 flex-1 items-center gap-1.5">
                                            <span className="min-w-0 flex-1 truncate font-medium text-slate-800">
                                                {activeLocationName ||
                                                    (
                                                        isBranchCoordinator
                                                            ? "Select branch"
                                                            : "Select warehouse"
                                                    )}
                                            </span>
                                                
                                            {activeLocationCode && (
                                                <>
                                                    <span className="shrink-0 text-slate-300">
                                                        ·
                                                    </span>
                                            
                                                    <span className="max-w-20 shrink-0 truncate text-xs text-slate-500">
                                                        {activeLocationCode}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </SelectTrigger>
                            
                            <SelectContent
                                className="z-[70] min-w-[260px] max-w-[calc(100vw-2rem)]"
                            >
                                {isBranchCoordinator &&
                                    user.assigned_branches.map(
                                        (branch) => (
                                            <SelectItem
                                                key={branch.id}
                                                value={`branch:${branch.id}`}
                                                className="py-2.5"
                                            >
                                                <div className="flex min-w-0 flex-col">
                                                    <span className="truncate font-medium text-slate-800">
                                                        {branch.name}
                                                    </span>
                                        
                                                    <span className="mt-0.5 text-xs text-slate-500">
                                                        {branch.code}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        )
                                    )}

                                {isWarehouseCoordinator &&
                                    user.assigned_warehouses.map(
                                        (warehouse) => (
                                            <SelectItem
                                                key={warehouse.id}
                                                value={`warehouse:${warehouse.id}`}
                                                className="py-2.5"
                                            >
                                                <div className="flex min-w-0 flex-col">
                                                    <span className="truncate font-medium text-slate-800">
                                                        {warehouse.name}
                                                    </span>
                                        
                                                    <span className="mt-0.5 text-xs text-slate-500">
                                                        {warehouse.code}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        )
                                    )}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* ================================================== */}
                {/* NAVIGATION */}
                {/* ================================================== */}

                <nav className="flex-1 space-y-1 overflow-y-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {loading ? (
                        <div className="px-3 py-3 text-sm text-slate-400">
                            Loading...
                        </div>
                    ) : (
                        navigationItems.map(
                            (item) => {
                                const Icon =
                                    item.icon;

                                const isActive =
                                    pathname ===
                                        item.href ||
                                    pathname.startsWith(
                                        `${item.href}/`
                                    );

                                return (
                                    <Link
                                        key={
                                            item.href
                                        }
                                        href={
                                            item.href
                                        }
                                        title={
                                            collapsed
                                                ? item.label
                                                : undefined
                                        }
                                        onClick={
                                            onMobileClose
                                        }
                                        className={[
                                            "flex items-center rounded-lg px-3 py-3 text-sm font-medium transition",
                                            collapsed
                                                ? "lg:justify-center"
                                                : "gap-3",
                                            isActive
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                                        ].join(
                                            " "
                                        )}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />

                                        <span
                                            className={
                                                collapsed
                                                    ? "lg:hidden"
                                                    : ""
                                            }
                                        >
                                            {
                                                item.label
                                            }
                                        </span>
                                    </Link>
                                );
                            }
                        )
                    )}
                </nav>

            </aside>
        </>
    );
}