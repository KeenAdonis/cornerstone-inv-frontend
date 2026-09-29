"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    LogOut,
    Menu,
    PanelLeftClose,
    PanelRightClose,
    UserCircle,
} from "lucide-react";

import { usePathname } from "next/navigation";

import {
    getNavigationItems,
} from "@/src/config/navigation";

import { useAuth } from "@/src/hooks/useAuth";
import { useLogout } from "@/src/hooks/useLogout";

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
        handleLogout,
        loading: logoutLoading,
        error: logoutError,
    } = useLogout();

    const [userMenuOpen, setUserMenuOpen] =
        useState(false);

    const userMenuRef =
        useRef<HTMLDivElement | null>(null);

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
     * CLOSE USER MENU WHEN CLICKING OUTSIDE
     * ============================================================
     */

    useEffect(() => {
        function handleClickOutside(
            event: MouseEvent
        ) {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(
                    event.target as Node
                )
            ) {
                setUserMenuOpen(false);
            }
        }

        if (userMenuOpen) {
            document.addEventListener(
                "mousedown",
                handleClickOutside
            );
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [userMenuOpen]);

    /*
     * ============================================================
     * LOGOUT
     * ============================================================
     */

    async function handleUserLogout() {
        setUserMenuOpen(false);
        await handleLogout();
    }

    return (
        <>
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
                {/* RIGHT SIDE */}
                {/* ================================================== */}

                <div
                    ref={userMenuRef}
                    className="relative shrink-0"
                >
                    {/* User Menu Trigger */}
                    <button
                        type="button"
                        onClick={() =>
                            setUserMenuOpen(
                                (current) =>
                                    !current
                            )
                        }
                        className="group flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left transition hover:bg-slate-50 sm:px-3"
                        aria-label="Open user menu"
                        aria-expanded={
                            userMenuOpen
                        }
                    >
                        {/* User Icon */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <UserCircle className="h-5 w-5" />
                        </div>

                        {/* User Information */}
                        {user && (
                            <div className="hidden min-w-0 text-right sm:block">
                                <p className="max-w-44 truncate text-sm font-semibold text-slate-800">
                                    {user.name}
                                </p>

                                <p className="max-w-52 truncate text-xs text-slate-500">
                                    {user.email}
                                </p>
                            </div>
                        )}

                        {/* Mobile User Name */}
                        {user && (
                            <div className="block min-w-0 sm:hidden">
                                <p className="max-w-28 truncate text-sm font-medium text-slate-800">
                                    {user.name}
                                </p>
                            </div>
                        )}
                    </button>

                    {/* ================================================== */}
                    {/* USER DROPDOWN */}
                    {/* ================================================== */}

                    {userMenuOpen && user && (
                        <div className="absolute right-0 top-full mt-2 w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                            {/* User Details */}
                            <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        <UserCircle className="h-6 w-6" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {user.name}
                                        </p>

                                        <p className="truncate text-xs text-slate-500">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Role */}
                                <div className="mt-3">
                                    <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                        {getRoleLabel(
                                            user.role
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Logout */}
                            <div className="p-2">
                                <button
                                    type="button"
                                    onClick={
                                        handleUserLogout
                                    }
                                    disabled={
                                        logoutLoading
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <LogOut className="h-4 w-4 shrink-0" />

                                    <span>
                                        {logoutLoading
                                            ? "Signing out..."
                                            : "Logout"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* ================================================== */}
            {/* LOGOUT ERROR */}
            {/* ================================================== */}

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