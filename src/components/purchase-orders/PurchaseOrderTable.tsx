"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Eye,
    MoreHorizontal,
    ClipboardCheck,
    PackageCheck,
    Truck,
    CircleCheck,
    Paperclip,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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

import { Button } from "@/components/ui/button";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { Input } from "@/components/ui/input";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

interface PurchaseOrderTableProps {
    purchaseOrders: PurchaseOrder[];

    onView?: (
        purchaseOrder: PurchaseOrder
    ) => void;

    onReview?: (
        purchaseOrder: PurchaseOrder
    ) => void;

    onProcess?: (
        purchaseOrder: PurchaseOrder
    ) => void;

    onRelease?: (
        purchaseOrder: PurchaseOrder
    ) => void;

    onDeliver?: (
        purchaseOrder: PurchaseOrder
    ) => void;

    onComplete?: (
        purchaseOrder: PurchaseOrder
    ) => void;

    onViewAttachment?: (
        purchaseOrder: PurchaseOrder
    ) => void;
}

const PURCHASE_ORDERS_PER_PAGE = 5;

const getPaginationPages = (
    currentPage: number,
    totalPages: number
): (number | "...")[] => {
    if (totalPages <= 7) {
        return Array.from(
            {
                length: totalPages,
            },
            (_, index) =>
                index + 1
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

    if (
        currentPage >=
        totalPages - 3
    ) {
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

const getStatusLabel = (
    status: PurchaseOrder["status"]
): string => {
    const labels: Record<
        PurchaseOrder["status"],
        string
    > = {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        preparing: "Preparing",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        completed: "Completed",
        cancelled: "Cancelled",
    };

    return labels[status];
};

const getStatusClassName = (
    status: PurchaseOrder["status"]
): string => {
    const classes: Record<
        PurchaseOrder["status"],
        string
    > = {
        pending:
            "border-amber-200 bg-amber-50 text-amber-700",

        approved:
            "border-blue-200 bg-blue-50 text-blue-700",

        rejected:
            "border-slate-900 bg-slate-800 text-red-50",

        preparing:
            "border-orange-200 bg-orange-50 text-orange-700",

        out_for_delivery:
            "border-pink-200 bg-pink-50 text-pink-700",

        delivered:
            "border-purple-200 bg-purple-50 text-purple-700",

        completed:
            "border-green-200 bg-green-50 text-green-700",

        cancelled:
            "border-red-200 bg-red-50 text-red-600",
    };

    return classes[status];
};

const STATUS_LEGEND = [
    {
        label: "Pending",
        status: "pending" as PurchaseOrder["status"],
    },
    {
        label: "Approved",
        status: "approved" as PurchaseOrder["status"],
    },
    {
        label: "Rejected",
        status: "rejected" as PurchaseOrder["status"],
    },
    {
        label: "Preparing",
        status: "preparing" as PurchaseOrder["status"],
    },
    {
        label: "Out for Delivery",
        status: "out_for_delivery" as PurchaseOrder["status"],
    },
    {
        label: "Delivered",
        status: "delivered" as PurchaseOrder["status"],
    },
    {
        label: "Completed",
        status: "completed" as PurchaseOrder["status"],
    },
    {
        label: "Cancelled",
        status: "cancelled" as PurchaseOrder["status"],
    },
];

const getStatusLegendColor = (
    status: PurchaseOrder["status"]
): string => {
    const colors: Record<
        PurchaseOrder["status"],
        string
    > = {
        pending: "bg-amber-400",
        approved: "bg-blue-500",
        rejected: "bg-slate-800",
        preparing: "bg-orange-400",
        out_for_delivery: "bg-pink-400",
        delivered: "bg-purple-500",
        completed: "bg-green-500",
        cancelled: "bg-red-500",
    };

    return colors[status];
};

export default function PurchaseOrderTable({
    purchaseOrders,
    onView,
    onReview,
    onProcess,
    onRelease,
    onDeliver,
    onComplete,
    onViewAttachment,
}: PurchaseOrderTableProps) {
    const [currentPage, setCurrentPage] =
        useState(1);

    const [search, setSearch] =
        useState("");

    const filteredPurchaseOrders =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            return purchaseOrders.filter(
                (purchaseOrder) => {
                    if (
                        !normalizedSearch
                    ) {
                        return true;
                    }

                    const reference =
                        purchaseOrder.reference_number
                            .toLowerCase();

                    const branch =
                        purchaseOrder.branch?.name
                            .toLowerCase() ??
                        "";

                    const warehouse =
                        purchaseOrder.warehouse?.name
                            .toLowerCase() ??
                        "";

                    const creator =
                        purchaseOrder.creator?.name
                            .toLowerCase() ??
                        "";

                    const status =
                        getStatusLabel(
                            purchaseOrder.status
                        ).toLowerCase();

                    return (
                        reference.includes(
                            normalizedSearch
                        ) ||
                        branch.includes(
                            normalizedSearch
                        ) ||
                        warehouse.includes(
                            normalizedSearch
                        ) ||
                        creator.includes(
                            normalizedSearch
                        ) ||
                        status.includes(
                            normalizedSearch
                        )
                    );
                }
            );
        }, [
            purchaseOrders,
            search,
        ]);

    const totalPages = Math.ceil(
        filteredPurchaseOrders.length /
            PURCHASE_ORDERS_PER_PAGE
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
    }, [search]);

    const startIndex =
        (currentPage - 1) *
        PURCHASE_ORDERS_PER_PAGE;

    const paginatedPurchaseOrders =
        filteredPurchaseOrders.slice(
            startIndex,
            startIndex +
                PURCHASE_ORDERS_PER_PAGE
        );

    const paginationPages =
        getPaginationPages(
            currentPage,
            totalPages
        );

    const goToPreviousPage = () => {
        setCurrentPage((page) =>
            Math.max(
                page - 1,
                1
            )
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

    const formatDateTime = (
        value: string
    ) => {
        return new Date(
            value
        ).toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    return (
        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white">
            <div className="border-b border-blue-100 bg-white px-4 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Purchase Orders
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            View and manage purchase order requests.
                        </p>
                    </div>

                    <Input
                        type="search"
                        placeholder="Search purchase orders..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        className="w-full border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-300 focus-visible:ring-0 md:w-72"
                    />
                </div>
            </div>

            <div className="border-b border-blue-50 px-4 py-2.5">
                <p className="text-xs text-slate-500">
                    Showing{" "}
                    <span className="font-medium text-slate-700">
                        {filteredPurchaseOrders.length ===
                        0
                            ? 0
                            : startIndex + 1}
                        –
                        {Math.min(
                            startIndex +
                                paginatedPurchaseOrders.length,
                            filteredPurchaseOrders.length
                        )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-700">
                        {
                            filteredPurchaseOrders.length
                        }
                    </span>{" "}
                    purchase orders
                </p>
            </div>

            {filteredPurchaseOrders.length ===
            0 ? (
                <div className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-slate-700">
                        No purchase orders found.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Try adjusting your search.
                    </p>
                </div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-blue-100 bg-blue-50 hover:bg-blue-50">
                                <TableHead className="text-blue-900">
                                    Reference
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Requested At
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Branch
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Warehouse
                                </TableHead>

                                <TableHead className="text-center text-blue-900">
                                    Items
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Status
                                </TableHead>

                                <TableHead className="text-blue-900">
                                    Created By
                                </TableHead>

                                <TableHead className="w-16 text-right text-blue-900">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedPurchaseOrders.map(
                                (
                                    purchaseOrder
                                ) => (
                                    <TableRow
                                        key={
                                            purchaseOrder.id
                                        }
                                        className="border-slate-200 hover:bg-slate-50"
                                    >
                                        <TableCell>
                                            <span className="font-mono text-sm font-medium text-slate-800">
                                                {
                                                    purchaseOrder.reference_number
                                                }
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-sm text-slate-600">
                                            {formatDateTime(
                                                purchaseOrder.requested_at
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {purchaseOrder.branch ? (
                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {
                                                            purchaseOrder
                                                                .branch
                                                                .name
                                                        }
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {
                                                            purchaseOrder
                                                                .branch
                                                                .code
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {purchaseOrder.warehouse ? (
                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {
                                                            purchaseOrder
                                                                .warehouse
                                                                .name
                                                        }
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {
                                                            purchaseOrder
                                                                .warehouse
                                                                .code
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            <span className="font-medium text-slate-700">
                                                {
                                                    purchaseOrder
                                                        .items
                                                        .length
                                                }
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClassName(
                                                    purchaseOrder.status
                                                )}`}
                                            >
                                                {getStatusLabel(
                                                    purchaseOrder.status
                                                )}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            {purchaseOrder.creator ? (
                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {
                                                            purchaseOrder
                                                                .creator
                                                                .name
                                                        }
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {
                                                            purchaseOrder
                                                                .creator
                                                                .email
                                                        }
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">
                                                    —
                                                </span>
                                            )}
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
                                                        Open purchase order actions
                                                    </span>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onView?.(
                                                                purchaseOrder
                                                            )
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />

                                                        View
                                                    </DropdownMenuItem>

                                                    {onViewAttachment &&
                                                        purchaseOrder.delivery_photo_url && (
                                                            <>
                                                                <DropdownMenuSeparator />

                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        onViewAttachment(
                                                                            purchaseOrder
                                                                        )
                                                                    }
                                                                >
                                                                    <Paperclip className="mr-2 h-4 w-4" />

                                                                    Attachment
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                    {onReview &&
                                                        purchaseOrder.status ===
                                                            "pending" && (
                                                            <>
                                                                <DropdownMenuSeparator />

                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        onReview(
                                                                            purchaseOrder
                                                                        )
                                                                    }
                                                                >
                                                                    <ClipboardCheck className="mr-2 h-4 w-4" />

                                                                    Review
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                    {onProcess &&
                                                        purchaseOrder.status ===
                                                            "approved" && (
                                                            <>
                                                                <DropdownMenuSeparator />

                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        onProcess(
                                                                            purchaseOrder
                                                                        )
                                                                    }
                                                                >
                                                                    <PackageCheck className="mr-2 h-4 w-4" />

                                                                    Prepare
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                    {onRelease &&
                                                        purchaseOrder.status ===
                                                            "preparing" && (
                                                            <>
                                                                <DropdownMenuSeparator />

                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        onRelease(
                                                                            purchaseOrder
                                                                        )
                                                                    }
                                                                >
                                                                    <Truck className="mr-2 h-4 w-4" />

                                                                    Out for Delivery
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                    {onDeliver &&
                                                        purchaseOrder.status ===
                                                            "out_for_delivery" && (
                                                            <>
                                                                <DropdownMenuSeparator />

                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        onDeliver(
                                                                            purchaseOrder
                                                                        )
                                                                    }
                                                                >
                                                                    <Truck className="mr-2 h-4 w-4" />

                                                                    Deliver
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                    {onComplete &&
                                                        purchaseOrder.status ===
                                                            "delivered" && (
                                                            <>
                                                                <DropdownMenuSeparator />

                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        onComplete(
                                                                            purchaseOrder
                                                                        )
                                                                    }
                                                                >
                                                                    <CircleCheck className="mr-2 h-4 w-4" />

                                                                    Complete
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>

                    {totalPages > 1 && (
                        <div className="border-t border-blue-100 bg-white px-4 py-3">
                            <Pagination>
                                <PaginationContent>
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
                                                    ? "pointer-events-none opacity-50"
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

                                                            setCurrentPage(
                                                                page
                                                            );
                                                        }}
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
                    <div className="border-t border-blue-100 bg-slate-50/50 px-4 py-3">
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                            <span className="mr-1 text-xs font-medium text-slate-600">
                                Status:
                            </span>
                                    
                            {STATUS_LEGEND.map(
                                (status) => (
                                    <div
                                        key={status.status}
                                        className="flex items-center gap-2"
                                    >
                                        <span
                                            className={`h-4 w-1 rounded-full ${getStatusLegendColor(
                                                status.status
                                            )}`}
                                        />
                    
                                        <span className="text-xs font-medium text-slate-700">
                                            {status.label}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}