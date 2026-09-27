"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import type { User } from "@/src/services/userService";

interface ViewUserDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ViewUserDialog({
    user,
    open,
    onOpenChange,
}: ViewUserDialogProps) {
    if (!user) {
        return null;
    }

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

    const assignedBranches =
        user.assigned_branches?.length
            ? user.assigned_branches
            : user.branch
              ? [user.branch]
              : [];

    const assignedWarehouses =
        user.assigned_warehouses?.length
            ? user.assigned_warehouses
            : user.warehouse
              ? [user.warehouse]
              : [];

    const isBranchCoordinator =
        user.role ===
        "branch_coordinator";

    const isWarehouseCoordinator =
        user.role ===
        "warehouse_coordinator";

    const hasAssignments =
        isBranchCoordinator
            ? assignedBranches.length > 0
            : isWarehouseCoordinator
              ? assignedWarehouses.length > 0
              : false;

    const statusConfig = {
        active: {
            label: "Active",
            className:
                "border-green-200 bg-green-50 text-green-700",
        },
        inactive: {
            label: "Inactive",
            className:
                "border-slate-200 bg-slate-100 text-slate-600",
        },
    } as const;

    const status =
        statusConfig[user.status] ??
        {
            label: user.status,
            className:
                "border-slate-200 bg-slate-100 text-slate-600",
        };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="flex max-h-[94vh] flex-col border-blue-100 bg-white text-slate-900 sm:max-w-md">
                {/* Header */}
                <DialogHeader className="shrink-0 border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        User Details
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        View system user information
                        and assignments.
                    </DialogDescription>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {/* Name */}
                    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Name
                        </p>

                        <p className="mt-1.5 text-sm font-semibold text-slate-900">
                            {user.name}
                        </p>
                    </div>

                    {/* Email */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Email
                        </p>

                        <p className="mt-1.5 break-all text-sm text-slate-700">
                            {user.email}
                        </p>
                    </div>

                    {/* Role */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Role
                        </p>

                        <p className="mt-1.5 text-sm font-medium text-slate-900">
                            {roleLabels[user.role] ??
                                user.role}
                        </p>
                    </div>

                    {/* Assignment */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Assignment
                        </p>

                        {!hasAssignments ? (
                            <p className="mt-1.5 text-sm text-slate-500">
                                No assignment
                            </p>
                        ) : (
                            <div className="mt-3 space-y-2">
                                {isBranchCoordinator &&
                                    assignedBranches.map(
                                        (branch) => (
                                            <div
                                                key={
                                                    branch.id
                                                }
                                                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
                                            >
                                                <p className="text-sm font-medium text-slate-800">
                                                    {
                                                        branch.name
                                                    }
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {
                                                        branch.code
                                                    }
                                                </p>
                                            </div>
                                        )
                                    )}

                                {isWarehouseCoordinator &&
                                    assignedWarehouses.map(
                                        (
                                            warehouse
                                        ) => (
                                            <div
                                                key={
                                                    warehouse.id
                                                }
                                                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
                                            >
                                                <p className="text-sm font-medium text-slate-800">
                                                    {
                                                        warehouse.name
                                                    }
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {
                                                        warehouse.code
                                                    }
                                                </p>
                                            </div>
                                        )
                                    )}
                            </div>
                        )}
                    </div>

                    {/* Status */}
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            Status
                        </p>

                        <div className="mt-2">
                            <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}
                            >
                                <span
                                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                        user.status ===
                                        "active"
                                            ? "bg-green-500"
                                            : "bg-slate-400"
                                    }`}
                                />

                                {status.label}
                            </span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}