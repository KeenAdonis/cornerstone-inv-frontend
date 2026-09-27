"use client";

import { MapPin } from "lucide-react";

import type { AuthUser } from "@/src/services/authService";

import {
    useActiveLocationContext,
} from "@/src/context/ActiveLocationContext";

interface DashboardHeaderProps {
    user: AuthUser;
}

export default function DashboardHeader({
    user,
}: DashboardHeaderProps) {
    const {
        activeLocation,
        initialized,
    } = useActiveLocationContext();

    const activeBranch =
        activeLocation?.type === "branch"
            ? user.assigned_branches.find(
                  (branch) =>
                      branch.id ===
                      activeLocation.id
              )
            : null;

    return (
        <div className="space-y-4">
            <div>
                <p className="text-sm font-medium text-blue-600">
                    Branch Operations
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Dashboard
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Welcome back, {user.name}. Here's
                    your branch operations overview.
                </p>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <MapPin className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                        Active Branch
                    </p>

                    {!initialized ? (
                        <p className="mt-0.5 text-sm font-medium text-slate-500">
                            Loading branch...
                        </p>
                    ) : activeBranch ? (
                        <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <p className="text-sm font-semibold text-slate-900">
                                {activeBranch.name}
                            </p>

                            <span className="text-xs font-medium text-slate-500">
                                {activeBranch.code}
                            </span>
                        </div>
                    ) : (
                        <p className="mt-0.5 text-sm font-medium text-slate-500">
                            No active branch selected
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}