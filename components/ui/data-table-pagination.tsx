"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTablePaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    pageSizeOptions?: number[];

    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

const getPaginationPages = (
    currentPage: number,
    totalPages: number
): (number | "...")[] => {
    if (totalPages <= 7) {
        return Array.from(
            { length: totalPages },
            (_, index) => index + 1
        );
    }

    if (currentPage <= 4) {
        return [
            1,
            2,
            3,
            4,
            5,
            "...",
            totalPages,
        ];
    }

    if (currentPage >= totalPages - 3) {
        return [
            1,
            "...",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
    ];
};

export function DataTablePagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    pageSizeOptions = [
        10,
        25,
        50,
        100,
    ],
    onPageChange,
    onPageSizeChange,
}: DataTablePaginationProps) {
    const safeTotalPages = Math.max(
        totalPages,
        1
    );

    const startIndex =
        totalItems === 0
            ? 0
            : (currentPage - 1) *
              pageSize;

    const startItem =
        totalItems === 0
            ? 0
            : startIndex + 1;

    const endItem =
        totalItems === 0
            ? 0
            : Math.min(
                  startIndex + pageSize,
                  totalItems
              );

    const paginationPages =
        getPaginationPages(
            currentPage,
            safeTotalPages
        );

    const goToPreviousPage = () => {
        if (currentPage <= 1) {
            return;
        }

        onPageChange(currentPage - 1);
    };

    const goToNextPage = () => {
        if (
            currentPage >=
            safeTotalPages
        ) {
            return;
        }

        onPageChange(currentPage + 1);
    };

    return (
        <div className="border-t border-blue-100 bg-white px-4 py-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
                {/* Showing */}
                <div className="flex items-center justify-center md:justify-start">
                    <p className="whitespace-nowrap text-xs text-slate-500">
                        Showing{" "}
                        <span className="font-medium text-slate-700">
                            {startItem}–
                            {endItem}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-slate-700">
                            {totalItems}
                        </span>{" "}
                        items
                    </p>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center">
                    {safeTotalPages > 1 && (
                        <Pagination>
                            <PaginationContent className="gap-1">
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(
                                            event
                                        ) => {
                                            event.preventDefault();
                                            goToPreviousPage();
                                        }}
                                        aria-disabled={
                                            currentPage ===
                                            1
                                        }
                                        className={
                                            currentPage ===
                                            1
                                                ? "pointer-events-none opacity-40"
                                                : ""
                                        }
                                    />
                                </PaginationItem>

                                {paginationPages.map(
                                    (
                                        page,
                                        index
                                    ) => {
                                        if (
                                            page ===
                                            "..."
                                        ) {
                                            return (
                                                <PaginationItem
                                                    key={`ellipsis-${index}`}
                                                >
                                                    <span className="flex h-9 w-9 items-center justify-center text-sm text-slate-400">
                                                        ...
                                                    </span>
                                                </PaginationItem>
                                            );
                                        }

                                        return (
                                            <PaginationItem
                                                key={
                                                    page
                                                }
                                            >
                                                <PaginationLink
                                                    href="#"
                                                    isActive={
                                                        page ===
                                                        currentPage
                                                    }
                                                    onClick={(
                                                        event
                                                    ) => {
                                                        event.preventDefault();

                                                        onPageChange(
                                                            page
                                                        );
                                                    }}
                                                    className="h-9 w-9"
                                                >
                                                    {
                                                        page
                                                    }
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    }
                                )}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(
                                            event
                                        ) => {
                                            event.preventDefault();
                                            goToNextPage();
                                        }}
                                        aria-disabled={
                                            currentPage ===
                                            safeTotalPages
                                        }
                                        className={
                                            currentPage ===
                                            safeTotalPages
                                                ? "pointer-events-none opacity-40"
                                                : ""
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>

                {/* Rows Per Page */}
                <div className="flex items-center justify-center gap-2 md:justify-end">
                    <span className="whitespace-nowrap text-xs text-slate-500">
                        Rows per page:
                    </span>

                    <Select
                        value={String(
                            pageSize
                        )}
                        onValueChange={(
                            value
                        ) => {
                            if (!value) {
                                return;
                            }

                            onPageSizeChange(
                                Number(value)
                            );
                        }}
                    >
                        <SelectTrigger
                            size="sm"
                            aria-label="Rows per page"
                            className="h-8 w-[72px] border-slate-200 bg-white text-slate-700"
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent align="end">
                            {pageSizeOptions.map(
                                (
                                    option
                                ) => (
                                    <SelectItem
                                        key={
                                            option
                                        }
                                        value={String(
                                            option
                                        )}
                                    >
                                        {
                                            option
                                        }
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}