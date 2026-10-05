"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Boxes,
    LogOut,
    UserCircle,
    X,
} from "lucide-react";

import {
    getNavigationItems,
} from "@/src/config/navigation";

import { useAuth } from "@/src/hooks/useAuth";
import { useLogout } from "@/src/hooks/useLogout";
import { usePendingPurchaseOrderCount } from "@/src/hooks/purchase-orders/usePendingPurchaseOrderCount";

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
        count: pendingPurchaseOrderCount,
    } = usePendingPurchaseOrderCount(user?.role === "admin");

    const {
        handleLogout,
        loading: logoutLoading,
        error: logoutError,
    } = useLogout();

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
     * USER ROLE LABEL
     * ============================================================
     */

    const getRoleLabel = (
        role: string
    ): string => {
        const roleLabels: Record<
            string,
            string
        > = {
            admin: "Administrator",
            branch_coordinator:
                "Branch Coordinator",
            warehouse_coordinator:
                "Warehouse Coordinator",
            superadmin:
                "Super Administrator",
        };

        return (
            roleLabels[role] ??
            role
                .replaceAll("_", " ")
                .replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                )
        );
    };

    /*
     * ============================================================
     * LOGOUT
     * ============================================================
     */

    async function handleUserLogout() {
        await handleLogout();
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
                    "fixed inset-y-0 left-0 z-50 flex h-dvh min-h-0 shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:static lg:h-auto lg:min-h-screen lg:z-auto",
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
                {/* NAVIGATION */}
                {/* ================================================== */}

                <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

                                const isPurchaseOrder =
                                    item.label ===
                                    "Purchase Orders";

                                const showPurchaseOrderNotification =
                                    isPurchaseOrder &&
                                    user?.role ===
                                        "admin" &&
                                    pendingPurchaseOrderCount >
                                        0;

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
                                            "relative flex items-center rounded-lg px-3 py-3 text-sm font-medium transition",
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

                                        {/* ========================================== */}
                                        {/* EXPANDED NAVIGATION LABEL */}
                                        {/* ========================================== */}

                                        <span
                                            className={[
                                                "min-w-0 truncate",
                                                collapsed
                                                    ? "lg:hidden"
                                                    : "flex-1",
                                            ].join(
                                                " "
                                            )}
                                        >
                                            {
                                                item.label
                                            }
                                        </span>

                                        {/* ========================================== */}
                                        {/* PURCHASE ORDER COUNT - EXPANDED */}
                                        {/* ========================================== */}

                                        {showPurchaseOrderNotification &&
                                            !collapsed && (
                                                <span className="ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold leading-none text-white shadow-sm">
                                                    {pendingPurchaseOrderCount >
                                                    99
                                                        ? "99+"
                                                        : pendingPurchaseOrderCount}
                                                </span>
                                            )}

                                        {/* ========================================== */}
                                        {/* PURCHASE ORDER DOT - COLLAPSED */}
                                        {/* ========================================== */}

                                        {showPurchaseOrderNotification &&
                                            collapsed && (
                                                <span
                                                    className="absolute right-1.5 top-1.5 hidden h-2.5 w-2.5 rounded-full bg-red-500 lg:block"
                                                    aria-label={`${pendingPurchaseOrderCount} pending purchase orders`}
                                                />
                                            )}
                                    </Link>
                                );
                            }
                        )
                    )}
                </nav>

                {/* ================================================== */}
                {/* USER PROFILE */}
                {/* ================================================== */}

                {user && (
                    <div className="shrink-0 border-t border-slate-200 bg-slate-50/60 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                        {logoutError && (
                            <div
                                className={[
                                    "mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-600",
                                    collapsed
                                        ? "lg:hidden"
                                        : "",
                                ].join(" ")}
                                role="alert"
                            >
                                {logoutError}
                            </div>
                        )}

                        {collapsed ? (
                            /* ================================================== */
                            /* COLLAPSED PROFILE */
                            /* ================================================== */

                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                                    title={user.name}
                                >
                                    <UserCircle className="h-6 w-6" />
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleUserLogout
                                    }
                                    disabled={
                                        logoutLoading
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                                    aria-label="Logout"
                                    title={
                                        logoutLoading
                                            ? "Signing out..."
                                            : "Logout"
                                    }
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            /* ================================================== */
                            /* EXPANDED PROFILE */
                            /* ================================================== */

                            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        <UserCircle className="h-6 w-6" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {user.name}
                                        </p>

                                        <p className="truncate text-xs text-slate-500">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <span className="inline-flex max-w-full truncate rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                        {getRoleLabel(
                                            user.role
                                        )}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleUserLogout
                                    }
                                    disabled={
                                        logoutLoading
                                    }
                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <LogOut className="h-4 w-4 shrink-0" />

                                    <span>
                                        {logoutLoading
                                            ? "Signing out..."
                                            : "Logout"}
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </aside>
        </>
    );
}