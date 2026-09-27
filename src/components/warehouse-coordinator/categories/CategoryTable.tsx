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
    Category,
} from "@/src/services/categoryService";

import {
    useToggleCategoryStatus,
} from "@/src/hooks/categories/useToggleCategoryStatus";

import CategoryTableToolbar from "@/src/components/warehouse-coordinator/categories/CategoryTableToolbar";
import ViewCategoryDialog from "@/src/components/warehouse-coordinator/categories/ViewCategoryDialog";
import EditCategoryDialog from "@/src/components/warehouse-coordinator/categories/EditCategoryDialog";
import DeleteCategoryDialog from "@/src/components/warehouse-coordinator/categories/DeleteCategoryDialog";

type CategoryStatus =
    Category["status"];

interface CategoryTableProps {
    categories: Category[];
    onCategoryUpdated: () => void;
}

const CATEGORIES_PER_PAGE = 5;

export default function CategoryTable({
    categories,
    onCategoryUpdated,
}: CategoryTableProps) {
    const [currentPage, setCurrentPage] =
        useState(1);

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState<CategoryStatus | "all">("all");

    const [selectedCategory, setSelectedCategory] =
        useState<Category | null>(null);

    const [editingCategory, setEditingCategory] =
        useState<Category | null>(null);

    const [deletingCategory, setDeletingCategory] =
        useState<Category | null>(null);

    const {
        toggle,
        loading: statusLoading,
        error: statusError,
    } = useToggleCategoryStatus();

    const filteredCategories = useMemo(() => {
        const normalizedSearch =
            search.trim().toLowerCase();

        return categories.filter((category) => {
            const matchesSearch =
                !normalizedSearch ||
                category.name
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                (category.description ?? "")
                    .toLowerCase()
                    .includes(normalizedSearch);

            const matchesStatus =
                status === "all" ||
                category.status === status;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        categories,
        search,
        status,
    ]);

    const totalPages = Math.ceil(
        filteredCategories.length /
            CATEGORIES_PER_PAGE
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
        status,
    ]);

    const startIndex =
        (currentPage - 1) *
        CATEGORIES_PER_PAGE;

    const paginatedCategories =
        filteredCategories.slice(
            startIndex,
            startIndex +
                CATEGORIES_PER_PAGE
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
        categoryId: number
    ) => {
        const response =
            await toggle(categoryId);

        if (!response) {
            return;
        }

        onCategoryUpdated();
    };

    return (
        <div className="mt-6 overflow-hidden rounded-sm border border-slate-200 bg-white">
            <CategoryTableToolbar
                search={search}
                status={status}
                currentPage={currentPage}
                itemsPerPage={CATEGORIES_PER_PAGE}
                totalItems={filteredCategories.length}
                onSearchChange={setSearch}
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
            {filteredCategories.length === 0 ? (
                <div className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-700">
                        No categories found.
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
                                Category Name
                            </TableHead>

                            <TableHead className="text-blue-900">
                                Description
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
                        {paginatedCategories.map(
                            (category) => (
                                <TableRow
                                    key={category.id}
                                    className="border-slate-200 hover:bg-slate-50"
                                >
                                    <TableCell className="font-medium text-slate-900">
                                        {category.name}
                                    </TableCell>

                                    <TableCell className="max-w-md text-slate-600">
                                        <span className="line-clamp-2">
                                            {category.description ||
                                                "No description provided."}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                checked={
                                                    category.status ===
                                                    "active"
                                                }
                                                onCheckedChange={() =>
                                                    handleStatusChange(
                                                        category.id
                                                    )
                                                }
                                                disabled={
                                                    statusLoading
                                                }
                                                aria-label={`Toggle ${category.name} status`}
                                            />

                                            <span className="text-sm capitalize text-slate-600">
                                                {category.status}
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
                                                        setSelectedCategory(
                                                            category
                                                        )
                                                    }
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setEditingCategory(
                                                            category
                                                        )
                                                    }
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setDeletingCategory(
                                                            category
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

            <ViewCategoryDialog
                category={selectedCategory}
                open={selectedCategory !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedCategory(null);
                    }
                }}
            />

            <EditCategoryDialog
                category={editingCategory}
                open={editingCategory !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingCategory(null);
                    }
                }}
                onUpdated={onCategoryUpdated}
            />

            <DeleteCategoryDialog
                category={deletingCategory}
                open={deletingCategory !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingCategory(null);
                    }
                }}
                onDeleted={onCategoryUpdated}
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