"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import AddUserDialog from "@/src/components/admin/users/AddUserDialog";
import UserTable from "@/src/components/admin/users/UserTable";
import { useUsers } from "@/src/hooks/user/useUsers";

export default function UsersPage() {
    const [isAddUserOpen, setIsAddUserOpen] =
        useState(false);

    const {
        users,
        loading,
        error,
        refetch,
    } = useUsers();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Users
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage system users and their
                        assignments.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() =>
                        setIsAddUserOpen(true)
                    }
                    className="w-full rounded-md bg-blue-600 text-white shadow-sm hover:bg-blue-700 sm:w-auto"
                >
                    <Plus className="h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Users Content */}
            {loading ? (
                <div className="rounded-lg border border-blue-100 bg-white px-6 py-12 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Loading users...
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
                <UserTable
                    users={users}
                    onUserUpdated={refetch}
                />
            )}

            {/* Add User Dialog */}
            <AddUserDialog
                open={isAddUserOpen}
                onOpenChange={setIsAddUserOpen}
            />
        </div>
    );
}