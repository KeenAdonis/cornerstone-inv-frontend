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
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

export type PurchaseOrderStatusFilter =
    | "all"
    | PurchaseOrder["status"];

interface PurchaseOrderTableToolbarProps {
    search: string;
    branch: string;
    status: PurchaseOrderStatusFilter;
    branchOptions: {
        id: number;
        name: string;
    }[];
    onSearchChange: (
        value: string
    ) => void;
    onBranchChange: (
        value: string
    ) => void;
    onStatusChange: (
        value: PurchaseOrderStatusFilter
    ) => void;
}

const STATUS_OPTIONS: {
    value: PurchaseOrder["status"];
    label: string;
}[] = [
    {
        value: "pending",
        label: "Pending",
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
        value: "preparing",
        label: "Preparing",
    },
    {
        value: "out_for_delivery",
        label: "Out for Delivery",
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
        value: "cancelled",
        label: "Cancelled",
    },
];

export default function PurchaseOrderTableToolbar({
    search,
    branch,
    status,
    branchOptions,
    onSearchChange,
    onBranchChange,
    onStatusChange,
}: PurchaseOrderTableToolbarProps) {
    return (
        <div className="border-b border-blue-100 bg-white">
            <div className="px-4 py-4">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_220px]">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <Input
                            type="search"
                            placeholder="Search purchase orders..."
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
                        value={branch}
                        onValueChange={(value) =>
                            onBranchChange(value ?? "all")
                        }
                    >
                        <SelectTrigger className="w-full border-slate-200 bg-white text-slate-700 focus:ring-blue-500">
                            <SelectValue>
                                {branch === "all"
                                    ? "All Branches"
                                    : branchOptions.find(
                                          (item) =>
                                              String(
                                                  item.id
                                              ) ===
                                              branch
                                      )?.name ??
                                      "All Branches"}
                            </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">
                                All Branches
                            </SelectItem>

                            {branchOptions.map(
                                (branchOption) => (
                                    <SelectItem
                                        key={
                                            branchOption.id
                                        }
                                        value={String(
                                            branchOption.id
                                        )}
                                    >
                                        {
                                            branchOption.name
                                        }
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>

                    <Select
                        value={status}
                        onValueChange={(value) =>
                            onStatusChange(
                                value as PurchaseOrderStatusFilter
                            )
                        }
                    >
                        <SelectTrigger className="w-full border-slate-200 bg-white text-slate-700 focus:ring-blue-500">
                            <SelectValue>
                                {status === "all"
                                    ? "All Statuses"
                                    : STATUS_OPTIONS.find(
                                          (item) =>
                                              item.value ===
                                              status
                                      )?.label ??
                                      "All Statuses"}
                            </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">
                                All Statuses
                            </SelectItem>

                            {STATUS_OPTIONS.map(
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
            </div>
        </div>
    );
}