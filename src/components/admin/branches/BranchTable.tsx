"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Eye,
    MoreHorizontal,
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

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import type {
    Branch,
} from "@/src/services/branchService";

import {
    useToggleBranchStatus,
} from "@/src/hooks/branches/useToggleBranchStatus";

import BranchTableToolbar from "@/src/components/admin/branches/BranchTableToolbar";
import ViewBranchDialog from "@/src/components/admin/branches/ViewBranchDialog";
import EditBranchDialog from "@/src/components/admin/branches/EditBranchDialog";
import DeleteBranchDialog from "@/src/components/admin/branches/DeleteBranchDialog";

type BranchArea =
    | "luzon"
    | "visayas"
    | "mindanao";

type BranchStatus =
    | "active"
    | "inactive";

interface BranchTableProps {
    branches: Branch[];
    onBranchUpdated: () => void;
}

const BRANCHES_PER_PAGE = 5;

const areaLabels: Record<BranchArea, string> = {
    luzon: "Luzon",
    visayas: "Visayas",
    mindanao: "Mindanao",
};

export default function BranchTable({
    branches,
    onBranchUpdated,
}: BranchTableProps) {
    const [currentPage, setCurrentPage] =
        useState(1);

    const [search, setSearch] =
        useState("");

    const [area, setArea] =
        useState<BranchArea | "all">("all");

    const [status, setStatus] =
        useState<BranchStatus | "all">("all");

    const [selectedBranch, setSelectedBranch] =
        useState<Branch | null>(null);

    const [editingBranch, setEditingBranch] =
        useState<Branch | null>(null);

    const [deletingBranch, setDeletingBranch] =
        useState<Branch | null>(null);

    const {
        handleToggleBranchStatus,
        loading: statusLoading,
        error: statusError,
    } = useToggleBranchStatus();

    const filteredBranches = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return branches.filter((branch) => {
            const matchesSearch =
                !normalizedSearch ||
                branch.name
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                branch.code
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                branch.area
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                branch.address
                    .toLowerCase()
                    .includes(normalizedSearch);

            const matchesArea =
                area === "all" ||
                branch.area === area;

            const matchesStatus =
                status === "all" ||
                branch.status === status;

            return (
                matchesSearch &&
                matchesArea &&
                matchesStatus
            );
        });
    }, [
        branches,
        search,
        area,
        status,
    ]);

    const totalPages = Math.ceil(
        filteredBranches.length /
            BRANCHES_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage((page) =>
            Math.min(
                Math.max(page, 1),
                Math.max(totalPages, 1)
            )
        );
    }, [totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        area,
        status,
    ]);

    const startIndex =
        (currentPage - 1) *
        BRANCHES_PER_PAGE;

    const paginatedBranches =
        filteredBranches.slice(
            startIndex,
            startIndex +
                BRANCHES_PER_PAGE
        );

    const goToPreviousPage = () => {
        setCurrentPage((page) =>
            Math.max(page - 1, 1)
        );
    };

    const goToNextPage = () => {
        setCurrentPage((page) =>
            Math.min(
                page + 1,
                totalPages
            )
        );
    };

    const handleStatusChange = async (
        branchId: number
    ) => {
        const response =
            await handleToggleBranchStatus(
                branchId
            );

        if (!response) {
            return;
        }

        onBranchUpdated();
    };

    return (
        <div className="mt-6 overflow-hidden rounded-sm border border-slate-200 bg-white">
            <BranchTableToolbar
                search={search}
                area={area}
                status={status}
                currentPage={currentPage}
                itemsPerPage={BRANCHES_PER_PAGE}
                totalItems={filteredBranches.length}
                onSearchChange={setSearch}
                onAreaChange={setArea}
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
            {filteredBranches.length === 0 ? (
                <div className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-700">
                        No branches found.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Try adjusting your search or filters.
                    </p>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="border-blue-100 bg-blue-50 hover:bg-blue-50">
                            <TableHead className="text-blue-900">
                                Branch Name
                            </TableHead>

                            <TableHead className="text-blue-900">
                                Code
                            </TableHead>

                            <TableHead className="text-blue-900">
                                Area
                            </TableHead>

                            <TableHead className="text-blue-900">
                                Address
                            </TableHead>

                            <TableHead className="text-blue-900">
                                Status
                            </TableHead>

                            <TableHead className="w-16 text-right text-blue-900">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginatedBranches.map(
                            (branch) => (
                                <TableRow
                                    key={branch.id}
                                    className="border-slate-200 hover:bg-slate-50"
                                >
                                    <TableCell className="font-medium text-slate-900">
                                        {branch.name}
                                    </TableCell>

                                    <TableCell className="text-slate-600">
                                        {branch.code}
                                    </TableCell>

                                    <TableCell className="text-slate-600">
                                        {
                                            areaLabels[
                                                branch.area
                                            ]
                                        }
                                    </TableCell>

                                    <TableCell className="text-slate-600">
                                        {branch.address}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={
                                                    branch.status ===
                                                    "active"
                                                }
                                                onCheckedChange={() =>
                                                    handleStatusChange(
                                                        branch.id
                                                    )
                                                }
                                                disabled={
                                                    statusLoading
                                                }
                                                aria-label={`Toggle ${branch.name} status`}
                                            />

                                            <span className="text-sm capitalize text-slate-600">
                                                {branch.status}
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
                                                        setSelectedBranch(
                                                            branch
                                                        )
                                                    }
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setEditingBranch(
                                                            branch
                                                        )
                                                    }
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setDeletingBranch(
                                                            branch
                                                        )
                                                    }
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            )}

            <ViewBranchDialog
                branch={selectedBranch}
                open={selectedBranch !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedBranch(null);
                    }
                }}
            />

            <EditBranchDialog
                branch={editingBranch}
                open={editingBranch !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingBranch(null);
                    }
                }}
                onUpdated={onBranchUpdated}
            />

            <DeleteBranchDialog
                branch={deletingBranch}
                open={deletingBranch !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingBranch(null);
                    }
                }}
                onDeleted={onBranchUpdated}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="border-t border-blue-100 bg-white px-4 py-3">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        goToPreviousPage();
                                    }}
                                    aria-disabled={
                                        currentPage === 1
                                    }
                                    className={
                                        currentPage === 1
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                />
                            </PaginationItem>

                            {Array.from(
                                {
                                    length: totalPages,
                                },
                                (_, index) =>
                                    index + 1
                            ).map((page) => (
                                <PaginationItem
                                    key={page}
                                >
                                    <PaginationLink
                                        href="#"
                                        isActive={
                                            page ===
                                            currentPage
                                        }
                                        onClick={(event) => {
                                            event.preventDefault();
                                            setCurrentPage(
                                                page
                                            );
                                        }}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        goToNextPage();
                                    }}
                                    aria-disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    className={
                                        currentPage ===
                                        totalPages
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}