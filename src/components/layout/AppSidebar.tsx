"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Boxes,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";

import {
    getNavigationItems,
} from "@/src/config/navigation";

import { useAuth } from "@/src/hooks/useAuth";

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

    return (
        <>
            {/* Mobile Backdrop */}
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={onMobileClose}
                    className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
                />
            )}

            <aside
                className={[
                    "fixed inset-y-0 left-0 z-50 flex min-h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:static lg:z-auto",
                    mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0",
                    "w-64",
                    collapsed
                        ? "lg:w-20"
                        : "lg:w-64",
                ].join(" ")}
            >
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between border-b border-blue-100 px-4">
                    <Link
                        href={dashboardHref}
                        className="flex min-w-0 items-center gap-3"
                        onClick={onMobileClose}
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                            <Boxes className="h-5 w-5" />
                        </div>

                        <span
                            className={[
                                "truncate text-sm font-bold text-slate-900",
                                collapsed
                                    ? "lg:hidden"
                                    : "",
                            ].join(" ")}
                        >
                            Cornerstone
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={onMobileClose}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-slate-900 lg:hidden"
                        aria-label="Close navigation menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-3">
                    {loading ? (
                        <div className="px-3 py-3 text-sm text-slate-400">
                            Loading...
                        </div>
                    ) : (
                        navigationItems.map((item) => {
                            const Icon = item.icon;

                            const isActive =
                                pathname === item.href ||
                                pathname.startsWith(
                                    `${item.href}/`
                                );

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
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
                                    ].join(" ")}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />

                                    <span
                                        className={
                                            collapsed
                                                ? "lg:hidden"
                                                : ""
                                        }
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })
                    )}
                </nav>

                {/* Collapse Button */}
                <div className="hidden border-t border-blue-100 p-3 lg:block">
                    <button
                        type="button"
                        onClick={onToggle}
                        className={[
                            "flex w-full items-center rounded-lg px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-blue-50 hover:text-blue-700",
                            collapsed
                                ? "justify-center"
                                : "gap-3",
                        ].join(" ")}
                        aria-label={
                            collapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                    >
                        {collapsed ? (
                            <ChevronRight className="h-5 w-5" />
                        ) : (
                            <>
                                <ChevronLeft className="h-5 w-5" />
                                <span>Collapse</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}