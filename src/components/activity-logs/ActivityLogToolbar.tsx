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
    ActivityLogFilters,
} from "@/src/services/activityLogService";

interface ActivityLogToolbarProps {
    search: string;

    filters: ActivityLogFilters;

    currentPage: number;
    itemsPerPage: number;
    totalItems: number;

    onSearchChange: (
        value: string
    ) => void;

    onFiltersChange: (
        filters: ActivityLogFilters
    ) => void;
}

const MODULE_OPTIONS = [
    {
        value: "all",
        label: "All Modules",
    },
    {
        value: "purchase_order",
        label: "Purchase Orders",
    },
    {
        value: "stock_adjustment",
        label: "Stock Adjustments",
    },
    {
        value: "stock_in",
        label: "Stock In",
    },
    {
        value: "inventory_count",
        label: "Inventory Counts",
    },
    {
        value: "inventory",
        label: "Inventory",
    },
    {
        value: "product",
        label: "Products",
    },
    {
        value: "category",
        label: "Categories",
    },
    {
        value: "branch",
        label: "Branches",
    },
    {
        value: "warehouse",
        label: "Warehouses",
    },
    {
        value: "user",
        label: "Users",
    },
];

const ACTION_OPTIONS = [
    {
        value: "all",
        label: "All Actions",
    },
    {
        value: "created",
        label: "Created",
    },
    {
        value: "updated",
        label: "Updated",
    },
    {
        value: "status_changed",
        label: "Status Changed",
    },
    {
        value: "approved",
        label: "Approved",
    },
    {
        value: "rejected",
        label: "Rejected",
    },
    {
        value: "prepared",
        label: "Prepared",
    },
    {
        value: "released",
        label: "Released",
    },
    {
        value: "delivered",
        label: "Delivered",
    },
    {
        value: "completed",
        label: "Completed",
    },
    {
        value: "deleted",
        label: "Deleted",
    },
];

export default function ActivityLogToolbar({
    search,
    filters,
    currentPage,
    itemsPerPage,
    totalItems,
    onSearchChange,
    onFiltersChange,
}: ActivityLogToolbarProps) {
    const startItem =
        totalItems === 0
            ? 0
            : (currentPage - 1) *
                  itemsPerPage +
              1;

    const endItem = Math.min(
        currentPage * itemsPerPage,
        totalItems
    );

    const handleModuleChange = (
        value: string | null
    ) => {
        onFiltersChange({
            ...filters,
            module:
                !value || value === "all"
                    ? undefined
                    : value,
        });
    };

    const handleActionChange = (
        value: string | null
    ) => {
        onFiltersChange({
            ...filters,
            action:
                !value || value === "all"
                    ? undefined
                    : value,
        });
    };

    return (
        <div className="border-b border-blue-100 bg-white">
            <div className="px-4 py-4">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_200px]">
                    {/* Search */}
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <Input
                            type="search"
                            placeholder="Search activity logs..."
                            value={search}
                            onChange={(event) =>
                                onSearchChange(
                                    event.target.value
                                )
                            }
                            className="border-slate-200 bg-white pl-9 text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-300 focus-visible:ring-0"
                        />
                    </div>

                    {/* Module */}
                    <Select
                        value={
                            filters.module ??
                            "all"
                        }
                        onValueChange={
                            handleModuleChange
                        }
                    >
                        <SelectTrigger className="w-full border-slate-200 bg-white text-slate-700 focus:ring-blue-500">
                            <SelectValue>
                                {
                                    MODULE_OPTIONS.find(
                                        (option) =>
                                            option.value ===
                                            (
                                                filters.module ??
                                                "all"
                                            )
                                    )?.label
                                }
                            </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                            {MODULE_OPTIONS.map(
                                (option) => (
                                    <SelectItem
                                        key={
                                            option.value
                                        }
                                        value={
                                            option.value
                                        }
                                    >
                                        {
                                            option.label
                                        }
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>

                    {/* Action */}
                    <Select
                        value={
                            filters.action ??
                            "all"
                        }
                        onValueChange={
                            handleActionChange
                        }
                    >
                        <SelectTrigger className="w-full border-slate-200 bg-white text-slate-700 focus:ring-blue-500">
                            <SelectValue>
                                {
                                    ACTION_OPTIONS.find(
                                        (option) =>
                                            option.value ===
                                            (
                                                filters.action ??
                                                "all"
                                            )
                                    )?.label
                                }
                            </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                            {ACTION_OPTIONS.map(
                                (option) => (
                                    <SelectItem
                                        key={
                                            option.value
                                        }
                                        value={
                                            option.value
                                        }
                                    >
                                        {
                                            option.label
                                        }
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Date Filters */}
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            Date From
                        </label>

                        <Input
                            type="date"
                            value={
                                filters.date_from ??
                                ""
                            }
                            onChange={(event) =>
                                onFiltersChange({
                                    ...filters,
                                    date_from:
                                        event.target
                                            .value ||
                                        undefined,
                                })
                            }
                            className="border-slate-200 bg-white text-slate-700 focus-visible:border-blue-300 focus-visible:ring-0"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                            Date To
                        </label>

                        <Input
                            type="date"
                            value={
                                filters.date_to ??
                                ""
                            }
                            onChange={(event) =>
                                onFiltersChange({
                                    ...filters,
                                    date_to:
                                        event.target
                                            .value ||
                                        undefined,
                                })
                            }
                            className="border-slate-200 bg-white text-slate-700 focus-visible:border-blue-300 focus-visible:ring-0"
                        />
                    </div>
                </div>
            </div>

            {/* Result Count */}
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
                    activity records
                </p>
            </div>
        </div>
    );
}