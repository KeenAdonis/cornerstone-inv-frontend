"use client";

import { LayoutDashboard } from "lucide-react";

import type { AuthUser } from "@/src/services/authService";

interface AdminDashboardHeaderProps {
    user: AuthUser;
}

export default function AdminDashboardHeader({
    user,
}: AdminDashboardHeaderProps) {
    return (
        <div className="space-y-4">
            <div>
                <p className="text-sm font-medium text-blue-600">
                    Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Welcome back, {user.name}. Here's
                    your system-wide inventory and
                    operations overview.
                </p>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <LayoutDashboard className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                        System Scope
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-slate-900">
                        All Branches & Warehouses
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                        System-wide administrative overview
                    </p>
                </div>
            </div>
        </div>
    );
}