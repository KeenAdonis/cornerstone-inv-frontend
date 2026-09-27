"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import AddBranchDialog from "@/src/components/admin/branches/AddBranchDialog";
import BranchTable from "@/src/components/admin/branches/BranchTable";

import { useBranches } from "@/src/hooks/branches/useBranches";

export default function BranchesPage() {
    const [isAddBranchOpen, setIsAddBranchOpen] =
        useState(false);

    const {
        branches,
        loading,
        error,
        refetch,
    } = useBranches();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Branches
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage branch locations and
                        assignments.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() =>
                        setIsAddBranchOpen(true)
                    }
                    className="w-full rounded-md bg-blue-600 text-white shadow-sm hover:bg-blue-700 sm:w-auto"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Branch
                </Button>
            </div>

            {loading ? (
                <div className="rounded-lg border border-blue-100 bg-white px-6 py-12 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Loading branches...
                    </p>
                </div>
            ) : error ? (
                <div
                    className="rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center"
                    role="alert"
                >
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                </div>
            ) : (
                <BranchTable
                    branches={branches}
                    onBranchUpdated={refetch}
                />
            )}

            <AddBranchDialog
                open={isAddBranchOpen}
                onOpenChange={setIsAddBranchOpen}
                onCreated={refetch}
            />
        </div>
    );
}