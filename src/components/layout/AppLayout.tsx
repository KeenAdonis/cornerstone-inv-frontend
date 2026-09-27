"use client";

import {
    ReactNode,
    useEffect,
    useState,
} from "react";

import {
    usePathname,
    useRouter,
} from "next/navigation";

import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

import {
    getNavigationItems,
} from "@/src/config/navigation";

import { useAuth } from "@/src/hooks/useAuth";

import {
    ActiveLocationProvider,
} from "@/src/context/ActiveLocationContext";

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({
    children,
}: AppLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(false);

    const [mobileSidebarOpen, setMobileSidebarOpen] =
        useState(false);

    const {
        user,
        loading,
    } = useAuth();

    function handleSidebarToggle() {
        setSidebarCollapsed((current) => !current);
    }

    function handleMobileMenuOpen() {
        setMobileSidebarOpen(true);
    }

    function handleMobileMenuClose() {
        setMobileSidebarOpen(false);
    }

    useEffect(() => {
        if (loading || !user) {
            return;
        }

        const navigationItems =
            getNavigationItems(user.role);

        const isAllowed =
            navigationItems.some(
                (item) =>
                    pathname === item.href ||
                    pathname.startsWith(
                        `${item.href}/`
                    )
            );

        if (!isAllowed) {
            const dashboard =
                navigationItems.find(
                    (item) =>
                        item.label === "Dashboard"
                );

            if (dashboard) {
                router.replace(
                    dashboard.href
                );
            }
        }
    }, [
        loading,
        user,
        pathname,
        router,
    ]);

    if (loading || !user) {
        return (
            <div className="flex h-screen items-center justify-center overflow-hidden bg-slate-50">
                <p className="text-sm text-slate-500">
                    Loading...
                </p>
            </div>
        );
    }

    const navigationItems =
        getNavigationItems(user.role);

    const isAllowed =
        navigationItems.some(
            (item) =>
                pathname === item.href ||
                pathname.startsWith(
                    `${item.href}/`
                )
        );

    if (!isAllowed) {
        return (
            <div className="flex h-screen items-center justify-center overflow-hidden bg-slate-50">
                <p className="text-sm text-slate-500">
                    Redirecting...
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Sidebar */}
            <AppSidebar
                collapsed={sidebarCollapsed}
                onToggle={
                    handleSidebarToggle
                }
                mobileOpen={
                    mobileSidebarOpen
                }
                onMobileClose={
                    handleMobileMenuClose
                }
            />

            {/* Main Application Area */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                <ActiveLocationProvider
                    user={user}
                >
                    {/* Header */}
                    <AppHeader
                        onMenuClick={
                            handleMobileMenuOpen
                        }
                    />

                    {/* Scrollable Main Content */}
                    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </ActiveLocationProvider>
            </div>
        </div>
    );
}