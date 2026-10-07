"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Check,
    Eye,
    MoreHorizontal,
    ClipboardCheck,
    PackageCheck,
    Truck,
    CircleCheck,
    Paperclip,
    X,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    DataTablePagination,
} from "@/components/ui/data-table-pagination";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";

import { toast } from "@/components/ui/toast";

import BulkApprovePurchaseOrderDialog from "@/src/components/purchase-orders/BulkApprovePurchaseOrderDialog";
import BulkRejectPurchaseOrderDialog from "@/src/components/purchase-orders/BulkRejectPurchaseOrderDialog";
import PurchaseOrderTableToolbar from "@/src/components/purchase-orders/PurchaseOrderTableToolbar";

import { useBulkApprovePurchaseOrders } from "@/src/hooks/purchase-orders/useBulkApprovePurchaseOrders";
import { useBulkRejectPurchaseOrders } from "@/src/hooks/purchase-orders/useBulkRejectPurchaseOrders";

import { useAuth } from "@/src/hooks/useAuth";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

interface PurchaseOrderTableProps {
    purchaseOrders: PurchaseOrder[];

    onUpdated?: () => void;

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

const PURCHASE_ORDER_STATUS_ORDER: Record<
    PurchaseOrder["status"],
    number
> = {
    pending: 1,
    approved: 2,
    preparing: 3,
    out_for_delivery: 4,
    delivered: 5,
    completed: 6,
    rejected: 7,
    cancelled: 8,
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
    onUpdated,
    onView,
    onReview,
    onProcess,
    onRelease,
    onDeliver,
    onComplete,
    onViewAttachment,
}: PurchaseOrderTableProps) {
    const { user } = useAuth();

    const isAdmin = user?.role === "admin";

    const [currentPage, setCurrentPage] =
        useState(1);

    const [pageSize, setPageSize] =
        useState(10);

    const [search, setSearch] =
        useState("");

    const [branchFilter, setBranchFilter] =
        useState<string>("all");

    const [statusFilter, setStatusFilter] =
        useState<
            "all" | PurchaseOrder["status"]
        >("all");

    const [
        selectedPurchaseOrderIds,
        setSelectedPurchaseOrderIds,
    ] = useState<number[]>([]);

    const [bulkApproveOpen, setBulkApproveOpen] = useState(false);

    const {
        bulkApprove,
        loading: bulkApproveLoading,
        error: bulkApproveError,
        reset: resetBulkApprove,
    } = useBulkApprovePurchaseOrders();

    const [bulkRejectOpen, setBulkRejectOpen] = useState(false);

    const {
        bulkReject,
        loading: bulkRejectLoading,
        error: bulkRejectError,
        reset: resetBulkReject,
    } = useBulkRejectPurchaseOrders();

    const filteredPurchaseOrders =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            const filtered =
                purchaseOrders.filter(
                    (purchaseOrder) => {
                        /*
                         * Branch filter
                         */
                        if (
                            branchFilter !==
                                "all" &&
                            String(
                                purchaseOrder.branch?.id
                            ) !== branchFilter
                        ) {
                            return false;
                        }

                        /*
                         * Status filter
                         */
                        if (
                            statusFilter !==
                                "all" &&
                            purchaseOrder.status !==
                                statusFilter
                        ) {
                            return false;
                        }

                        /*
                         * Search filter
                         */
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

            return [...filtered].sort(
                (a, b) => {
                    const statusA =
                        PURCHASE_ORDER_STATUS_ORDER[
                            a.status
                        ];

                    const statusB =
                        PURCHASE_ORDER_STATUS_ORDER[
                            b.status
                        ];

                    if (
                        statusA !==
                        statusB
                    ) {
                        return (
                            statusA -
                            statusB
                        );
                    }

                    return (
                        new Date(
                            b.created_at
                        ).getTime() -
                        new Date(
                            a.created_at
                        ).getTime()
                    );
                }
            );
        }, [
            purchaseOrders,
            search,
            branchFilter,
            statusFilter,
        ]);

    const totalPages = Math.ceil(
        filteredPurchaseOrders.length /
            pageSize
    );

    const branchOptions = useMemo(() => {
        const branches = new Map<
            number,
            string
        >();

        purchaseOrders.forEach(
            (purchaseOrder) => {
                if (purchaseOrder.branch) {
                    branches.set(
                        purchaseOrder.branch.id,
                        purchaseOrder.branch.name
                    );
                }
            }
        );

        return Array.from(
            branches.entries()
        )
            .map(([id, name]) => ({
                id,
                name,
            }))
            .sort((a, b) =>
                a.name.localeCompare(
                    b.name
                )
            );
    }, [purchaseOrders]);

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
        branchFilter,
        statusFilter,
        pageSize,
    ]);

    useEffect(() => {
        setSelectedPurchaseOrderIds([]);
    }, [
        search,
        branchFilter,
        statusFilter,
    ]);

    /*
     * Keep only purchase orders that are still
     * pending and still exist in the current data.
     */
    useEffect(() => {
        const pendingIds =
            new Set(
                purchaseOrders
                    .filter(
                        (purchaseOrder) =>
                            purchaseOrder.status ===
                            "pending"
                    )
                    .map(
                        (purchaseOrder) =>
                            purchaseOrder.id
                    )
            );

        setSelectedPurchaseOrderIds(
            (current) =>
                current.filter(
                    (id) =>
                        pendingIds.has(id)
                )
        );
    }, [purchaseOrders]);

    const startIndex =
        (currentPage - 1) *
        pageSize;

    const paginatedPurchaseOrders =
        filteredPurchaseOrders.slice(
            startIndex,
            startIndex + pageSize
        );

    const selectablePurchaseOrders =
        paginatedPurchaseOrders.filter(
            (purchaseOrder) =>
                purchaseOrder.status ===
                "pending"
        );

    const selectedOnCurrentPage =
        selectablePurchaseOrders.filter(
            (purchaseOrder) =>
                selectedPurchaseOrderIds.includes(
                    purchaseOrder.id
                )
        );

    const allCurrentPageSelected =
        selectablePurchaseOrders.length >
            0 &&
        selectedOnCurrentPage.length ===
            selectablePurchaseOrders.length;

    const someCurrentPageSelected =
        selectedOnCurrentPage.length >
            0 &&
        !allCurrentPageSelected;

    const togglePurchaseOrderSelection = (
        purchaseOrderId: number
    ) => {
        setSelectedPurchaseOrderIds(
            (current) => {
                if (
                    current.includes(
                        purchaseOrderId
                    )
                ) {
                    return current.filter(
                        (id) =>
                            id !==
                            purchaseOrderId
                    );
                }

                return [
                    ...current,
                    purchaseOrderId,
                ];
            }
        );
    };

    const toggleCurrentPageSelection =
        () => {
            const currentPageIds =
                selectablePurchaseOrders.map(
                    (purchaseOrder) =>
                        purchaseOrder.id
                );

            if (
                allCurrentPageSelected
            ) {
                setSelectedPurchaseOrderIds(
                    (current) =>
                        current.filter(
                            (id) =>
                                !currentPageIds.includes(
                                    id
                                )
                        )
                );

                return;
            }

            setSelectedPurchaseOrderIds(
                (current) => {
                    const ids = new Set(
                        current
                    );

                    currentPageIds.forEach(
                        (id) =>
                            ids.add(id)
                    );

                    return Array.from(
                        ids
                    );
                }
            );
        };

    const clearSelection = () => {
        setSelectedPurchaseOrderIds(
            []
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

    const handleBulkApprove = async () => {
        if (selectedPurchaseOrderIds.length === 0) {
            return;
        }

        const result = await bulkApprove(
            selectedPurchaseOrderIds
        );

        if (!result) {
            return;
        }

        toast.add({
            title: "Purchase Orders Approved",
            description:
                `${selectedPurchaseOrderIds.length} purchase order${
                    selectedPurchaseOrderIds.length !== 1
                        ? "s have"
                        : " has"
                } been approved successfully.`,
            type: "success",
        });

        setBulkApproveOpen(false);
        setSelectedPurchaseOrderIds([]);

        onUpdated?.();
    };

    const handleBulkReject = async (
        rejectionReason: string
    ) => {
        if (selectedPurchaseOrderIds.length === 0) {
            return;
        }
    
        const result = await bulkReject(
            selectedPurchaseOrderIds,
            rejectionReason
        );
    
        if (!result) {
            return;
        }
    
        toast.add({
            title: "Purchase Orders Rejected",
            description:
                `${selectedPurchaseOrderIds.length} purchase order${
                    selectedPurchaseOrderIds.length !== 1
                        ? "s have"
                        : " has"
                } been rejected successfully.`,
            type: "success",
        });
    
        setBulkRejectOpen(false);
        setSelectedPurchaseOrderIds([]);
    
        onUpdated?.();
    };

    return (
        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white">
            <div className="border-b border-blue-100 bg-white">
                <div className="px-4 py-4">
                    <h2 className="text-base font-semibold text-slate-900">
                        Purchase Orders
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        View and manage purchase order requests.
                    </p>
                </div>

                <PurchaseOrderTableToolbar
                    search={search}
                    branch={branchFilter}
                    status={statusFilter}
                    branchOptions={branchOptions}
                    onSearchChange={setSearch}
                    onBranchChange={setBranchFilter}
                    onStatusChange={setStatusFilter}
                />
            </div>

            {selectedPurchaseOrderIds.length >
                0 && (
                <div className="border-b border-blue-100 bg-blue-50/60 px-4 py-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-800">
                                {
                                    selectedPurchaseOrderIds.length
                                }{" "}
                                purchase order
                                {selectedPurchaseOrderIds.length !==
                                1
                                    ? "s"
                                    : ""}{" "}
                                selected
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Only pending purchase orders can be approved or rejected.
                            </p>

                            {bulkApproveError && (
                                <p className="mt-1 text-xs font-medium text-red-600">
                                    {bulkApproveError}
                                </p>
                            )}

                            {bulkRejectError && (
                                <p className="mt-1 text-xs font-medium text-red-600">
                                    {bulkRejectError}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button
                                type="button"
                                size="sm"
                                className="bg-blue-600 text-white hover:bg-blue-700"
                                disabled={bulkApproveLoading}
                                onClick={() => {
                                    resetBulkApprove();
                                    setBulkApproveOpen(true);
                                }}
                            >
                                <Check className="mr-1.5 h-4 w-4" />
                                Approve Selected
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                disabled={bulkRejectLoading}
                                onClick={() => {
                                    resetBulkReject();
                                    setBulkRejectOpen(true);
                                }}
                                className="border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                                <X className="mr-1.5 h-4 w-4" />
                                Reject Selected
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="text-slate-500 hover:bg-white hover:text-slate-700"
                                onClick={
                                    clearSelection
                                }
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
                                {isAdmin && (
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={allCurrentPageSelected}
                                            indeterminate={someCurrentPageSelected}
                                            onCheckedChange={() =>
                                                toggleCurrentPageSelection()
                                            }
                                            disabled={
                                                selectablePurchaseOrders.length === 0
                                            }
                                            aria-label="Select all pending purchase orders on this page"
                                        />
                                    </TableHead>
                                )}

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
                                ) => {
                                    const isPending =
                                        purchaseOrder.status ===
                                        "pending";

                                    const isSelected =
                                        selectedPurchaseOrderIds.includes(
                                            purchaseOrder.id
                                        );

                                    return (
                                        <TableRow
                                            key={
                                                purchaseOrder.id
                                            }
                                            className="border-slate-200 hover:bg-slate-50"
                                        >
                                            {isAdmin && (
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedPurchaseOrderIds.includes(
                                                            purchaseOrder.id
                                                        )}
                                                        onCheckedChange={() =>
                                                            togglePurchaseOrderSelection(
                                                                purchaseOrder.id
                                                            )
                                                        }
                                                        disabled={
                                                            purchaseOrder.status !== "pending"
                                                        }
                                                        aria-label={`Select purchase order ${purchaseOrder.reference_number}`}
                                                    />
                                                </TableCell>
                                            )}

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
                                                            (
                                                                purchaseOrder.delivery_photo_url ||
                                                                (purchaseOrder.delivery_attachments &&
                                                                    purchaseOrder.delivery_attachments.length > 0)
                                                            ) && (
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
                                    );
                                }
                            )}
                        </TableBody>
                    </Table>

                    <DataTablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={
                            filteredPurchaseOrders.length
                        }
                        pageSize={pageSize}
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

                    <div className="border-t border-blue-100 bg-slate-50/50 px-4 py-3">
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                            <span className="mr-1 text-xs font-medium text-slate-600">
                                Status:
                            </span>

                            {STATUS_LEGEND.map(
                                (status) => (
                                    <div
                                        key={
                                            status.status
                                        }
                                        className="flex items-center gap-2"
                                    >
                                        <span
                                            className={`h-4 w-1 rounded-full ${getStatusLegendColor(
                                                status.status
                                            )}`}
                                        />

                                        <span className="text-xs font-medium text-slate-700">
                                            {
                                                status.label
                                            }
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </>
            )}

            <BulkApprovePurchaseOrderDialog
                open={bulkApproveOpen}
                onOpenChange={(open) => {
                    if (bulkApproveLoading) {
                        return;
                    }
                
                    setBulkApproveOpen(open);
                
                    if (!open) {
                        resetBulkApprove();
                    }
                }}
                selectedCount={
                    selectedPurchaseOrderIds.length
                }
                onConfirm={handleBulkApprove}
                loading={bulkApproveLoading}
            />

            <BulkRejectPurchaseOrderDialog
                open={bulkRejectOpen}
                onOpenChange={(open) => {
                    if (bulkRejectLoading) return;
                
                    setBulkRejectOpen(open);
                
                    if (!open) {
                        resetBulkReject();
                    }
                }}
                selectedCount={selectedPurchaseOrderIds.length}
                onConfirm={handleBulkReject}
                loading={bulkRejectLoading}
            />
        </div>
    );
}