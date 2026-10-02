"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    MoreHorizontal,
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import type {
    User,
    UserRole,
    UserStatus,
} from "@/src/services/userService";

import { useAuth } from "@/src/hooks/useAuth";
import { useToggleUserStatus } from "@/src/hooks/user/useToggleUserStatus";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { DataTablePagination } from "@/components/ui/data-table-pagination";

import ViewUserDialog from "@/src/components/admin/users/ViewUserDialog";
import EditUserDialog from "@/src/components/admin/users/EditUserDialog";
import UserTableToolbar from "@/src/components/admin/users/UserTableToolbar";
import UserDeleteDialog from "@/src/components/admin/users/UserDeleteDialog";

interface UserTableProps {
    users: User[];
    onUserUpdated: () => void;
}

export default function UserTable({
    users,
    onUserUpdated,
}: UserTableProps) {
    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const [
        pageSize,
        setPageSize,
    ] = useState(10);

    const [
        selectedUser,
        setSelectedUser,
    ] = useState<User | null>(null);

    const [
        editingUser,
        setEditingUser,
    ] = useState<User | null>(null);

    const [
        deletingUser,
        setDeletingUser,
    ] = useState<User | null>(null);

    const [search, setSearch] =
        useState("");

    const [role, setRole] =
        useState<UserRole | "all">("all");

    const [status, setStatus] =
        useState<UserStatus | "all">("all");

    const {
        user: authenticatedUser,
    } = useAuth();

    const {
        handleToggleUserStatus,
        loading: statusLoading,
        error: statusError,
    } = useToggleUserStatus();

    const roleLabels: Record<
        User["role"],
        string
    > = {
        admin: "Administrator",
        branch_coordinator:
            "Branch Coordinator",
        warehouse_coordinator:
            "Warehouse Coordinator",
    };

    const getUserAssignmentNames = (
        user: User
    ): string[] => {
        if (
            user.role ===
            "branch_coordinator"
        ) {
            if (
                user.assigned_branches?.length
            ) {
                return user.assigned_branches.map(
                    (branch) =>
                        branch.name
                );
            }

            return user.branch?.name
                ? [user.branch.name]
                : [];
        }

        if (
            user.role ===
            "warehouse_coordinator"
        ) {
            if (
                user.assigned_warehouses?.length
            ) {
                return user.assigned_warehouses.map(
                    (warehouse) =>
                        warehouse.name
                );
            }

            return user.warehouse?.name
                ? [user.warehouse.name]
                : [];
        }

        return [];
    };

    const getAssignmentLabel = (
        user: User
    ): string => {
        const assignments =
            getUserAssignmentNames(user);

        if (assignments.length === 0) {
            return "—";
        }

        if (assignments.length <= 2) {
            return assignments.join(
                " · "
            );
        }

        return `${assignments
            .slice(0, 2)
            .join(" · ")} +${
            assignments.length - 2
        } more`;
    };

    const filteredUsers = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return users.filter((user) => {
            const assignments =
                getUserAssignmentNames(
                    user
                );

            const assignmentSearchText =
                assignments
                    .join(" ")
                    .toLowerCase();

            const matchesSearch =
                !normalizedSearch ||
                user.name
                    .toLowerCase()
                    .includes(
                        normalizedSearch
                    ) ||
                user.email
                    .toLowerCase()
                    .includes(
                        normalizedSearch
                    ) ||
                assignmentSearchText.includes(
                    normalizedSearch
                );

            const matchesRole =
                role === "all" ||
                user.role === role;

            const matchesStatus =
                status === "all" ||
                user.status === status;

            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );
        });
    }, [
        users,
        search,
        role,
        status,
    ]);

    const totalPages = Math.ceil(
        filteredUsers.length /
            pageSize
    );

    useEffect(() => {
        setCurrentPage((page) =>
            Math.min(
                Math.max(page, 1),
                Math.max(
                    totalPages,
                    1
                )
            )
        );
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        role,
        status,
        pageSize,
    ]);

    const startIndex =
        (currentPage - 1) *
        pageSize;

    const paginatedUsers =
        filteredUsers.slice(
            startIndex,
            startIndex + pageSize
        );

    const handleStatusChange = async (
        userId: number
    ) => {
        const response =
            await handleToggleUserStatus(
                userId
            );

        if (response) {
            onUserUpdated();
        }
    };

    return (
        <div className="mt-6 overflow-hidden rounded-sm border border-slate-200 bg-white">
            <UserTableToolbar
                search={search}
                role={role}
                status={status}
                currentPage={currentPage}
                itemsPerPage={pageSize}
                totalItems={
                    filteredUsers.length
                }
                onSearchChange={setSearch}
                onRoleChange={setRole}
                onStatusChange={setStatus}
            />

            {/* Status Error */}
            {statusError && (
                <div
                    className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                    role="alert"
                >
                    {statusError}
                </div>
            )}

            {/* Table */}
            {filteredUsers.length === 0 ? (
                <div className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-700">
                        No users found.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Try adjusting your search or filters.
                    </p>
                </div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-blue-100 bg-blue-50 hover:bg-blue-50">
                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Name
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Email
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Role
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Assignment
                                </TableHead>

                                <TableHead className="whitespace-nowrap text-xs font-semibold text-blue-900">
                                    Status
                                </TableHead>

                                <TableHead className="w-16 whitespace-nowrap text-right text-xs font-semibold text-blue-900">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedUsers.map(
                                (user) => (
                                    <TableRow
                                        key={
                                            user.id
                                        }
                                        className="border-slate-200 hover:bg-slate-50"
                                    >
                                        <TableCell className="font-medium text-slate-900">
                                            {
                                                user.name
                                            }
                                        </TableCell>

                                        <TableCell className="text-slate-600">
                                            {
                                                user.email
                                            }
                                        </TableCell>

                                        <TableCell className="text-slate-600">
                                            {
                                                roleLabels[
                                                    user.role
                                                ]
                                            }
                                        </TableCell>

                                        <TableCell
                                            className="max-w-xs text-slate-600"
                                            title={getUserAssignmentNames(
                                                user
                                            ).join(
                                                " · "
                                            )}
                                        >
                                            <span className="block truncate">
                                                {getAssignmentLabel(
                                                    user
                                                )}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Switch
                                                    checked={
                                                        user.status ===
                                                        "active"
                                                    }
                                                    onCheckedChange={() =>
                                                        handleStatusChange(
                                                            user.id
                                                        )
                                                    }
                                                    disabled={
                                                        statusLoading
                                                    }
                                                    aria-label={`Toggle ${user.name} status`}
                                                />

                                                <span className="text-sm capitalize text-slate-600">
                                                    {
                                                        user.status
                                                    }
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    render={
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                                                        />
                                                    }
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />

                                                    <span className="sr-only">
                                                        Open actions
                                                    </span>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setSelectedUser(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setEditingUser(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>

                                                    {authenticatedUser?.id !==
                                                        user.id && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                setDeletingUser(
                                                                    user
                                                                )
                                                            }
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <DataTablePagination
                        currentPage={
                            currentPage
                        }
                        totalPages={
                            totalPages
                        }
                        totalItems={
                            filteredUsers.length
                        }
                        pageSize={
                            pageSize
                        }
                        pageSizeOptions={[
                            10,
                            25,
                            50,
                            100,
                        ]}
                        onPageChange={
                            setCurrentPage
                        }
                        onPageSizeChange={
                            setPageSize
                        }
                    />
                </>
            )}

            {/* View User Dialog */}
            <ViewUserDialog
                user={selectedUser}
                open={
                    selectedUser !== null
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setSelectedUser(
                            null
                        );
                    }
                }}
            />

            {/* Edit User Dialog */}
            <EditUserDialog
                user={editingUser}
                open={
                    editingUser !== null
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setEditingUser(null);
                    }
                }}
                onUpdated={() => {
                    onUserUpdated();
                }}
            />

            {/* Delete User Dialog */}
            <UserDeleteDialog
                user={deletingUser}
                open={
                    deletingUser !== null
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setDeletingUser(
                            null
                        );
                    }
                }}
                onDeleted={
                    onUserUpdated
                }
            />
        </div>
    );
}