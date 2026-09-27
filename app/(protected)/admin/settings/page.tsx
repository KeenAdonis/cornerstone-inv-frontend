import Link from "next/link";
import {
    Building2,
    Warehouse,
} from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Settings
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Manage system settings, branches, and
                    warehouses.
                </p>
            </div>

            {/* Settings Cards */}
            <div className="grid gap-4 sm:grid-cols-2">
                <Link
                    href="/admin/settings/branches"
                    className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md"
                >
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                            <Building2 className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <h2 className="font-semibold text-slate-900">
                                Branches
                            </h2>

                            <p className="mt-1 text-sm leading-5 text-slate-500">
                                Manage branch locations and
                                assignments.
                            </p>
                        </div>
                    </div>
                </Link>

                <Link
                    href="/admin/settings/warehouses"
                    className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md"
                >
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                            <Warehouse className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <h2 className="font-semibold text-slate-900">
                                Warehouses
                            </h2>

                            <p className="mt-1 text-sm leading-5 text-slate-500">
                                Manage warehouse locations
                                and assignments.
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}