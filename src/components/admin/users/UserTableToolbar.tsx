"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type {
    UserRole,
    UserStatus,
} from "@/src/services/userService";

interface UserTableToolbarProps {
    search: string;
    role: UserRole | "all";
    status: UserStatus | "all";
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onSearchChange: (value: string) => void;
    onRoleChange: (value: UserRole | "all") => void;
    onStatusChange: (value: UserStatus | "all") => void;
}

export default function UserTableToolbar({
    search,
    role,
    status,
    currentPage,
    itemsPerPage,
    totalItems,
    onSearchChange,
    onRoleChange,
    onStatusChange,
}: UserTableToolbarProps) {
    const startItem =
        totalItems === 0
            ? 0
            : (currentPage - 1) *
                  itemsPerPage +
              1;

    const endItem =
        Math.min(
            currentPage * itemsPerPage,
            totalItems
        );

    return (
        <div className="border-b border-blue-100 bg-white">
            <div className="px-4 py-4">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_180px]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <Input
                            type="search"
                            placeholder="Search users..."
                            value={search}
                            onChange={(event) =>
                                onSearchChange(
                                    event.target.value
                                )
                            }
                            className="border-slate-200 bg-white pl-9 text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-300 focus-visible:ring-0"
                        />
                    </div>

                    <Select
                        value={role}
                        onValueChange={(value) =>
                            onRoleChange(
                                value as
                                    | UserRole
                                    | "all"
                            )
                        }
                    >
                        <SelectTrigger className="w-full border-slate-200 bg-white text-slate-700 focus:ring-blue-500">
                            <SelectValue>
                                {role === "all"
                                    ? "All Roles"
                                    : role === "admin"
                                        ? "Administrator"
                                        : role === "branch_coordinator"
                                            ? "Branch Coordinator"
                                            : "Warehouse Coordinator"}
                            </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">
                                All Roles
                            </SelectItem>

                            <SelectItem value="admin">
                                Administrator
                            </SelectItem>

                            <SelectItem value="branch_coordinator">
                                Branch Coordinator
                            </SelectItem>

                            <SelectItem value="warehouse_coordinator">
                                Warehouse Coordinator
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={status}
                        onValueChange={(value) =>
                            onStatusChange(
                                value as
                                    | UserStatus
                                    | "all"
                            )
                        }
                    >
                        <SelectTrigger className="w-full border-slate-200 bg-white text-slate-700 focus:ring-blue-500">
                            <SelectValue>
                                {status === "all"
                                    ? "All Statuses"
                                    : status === "active"
                                        ? "Active"
                                        : "Inactive"}
                            </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">
                                All Statuses
                            </SelectItem>

                            <SelectItem value="active">
                                Active
                            </SelectItem>

                            <SelectItem value="inactive">
                                Inactive
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="border-t border-blue-50 px-4 py-2.5">
                <p className="text-xs text-slate-500">
                    Showing{" "}
                    <span className="font-medium text-slate-700">
                        {startItem}–{endItem}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-700">
                        {totalItems}
                    </span>{" "}
                    users
                </p>
            </div>
        </div>
    );
}