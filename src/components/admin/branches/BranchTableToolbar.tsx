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
    Branch,
} from "@/src/services/branchService";

type BranchArea =
    | Branch["area"];

type BranchStatus =
    | Branch["status"];

interface BranchTableToolbarProps {
    search: string;
    area: BranchArea | "all";
    status: BranchStatus | "all";
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onSearchChange: (value: string) => void;
    onAreaChange: (
        value: BranchArea | "all"
    ) => void;
    onStatusChange: (
        value: BranchStatus | "all"
    ) => void;
}

const areaLabels: Record<BranchArea, string> = {
    luzon: "Luzon",
    visayas: "Visayas",
    mindanao: "Mindanao",
};

export default function BranchTableToolbar({
    search,
    area,
    status,
    currentPage,
    itemsPerPage,
    totalItems,
    onSearchChange,
    onAreaChange,
    onStatusChange,
}: BranchTableToolbarProps) {
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
                            placeholder="Search branches..."
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
                        value={area}
                        onValueChange={(value) =>
                            onAreaChange(
                                value as
                                    | BranchArea
                                    | "all"
                            )
                        }
                    >
                        <SelectTrigger className="w-full border-slate-200 bg-white text-slate-700 focus:ring-blue-500">
                            <SelectValue>
                                {area === "all"
                                    ? "All Areas"
                                    : areaLabels[area]}
                            </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">
                                All Areas
                            </SelectItem>

                            <SelectItem value="luzon">
                                Luzon
                            </SelectItem>

                            <SelectItem value="visayas">
                                Visayas
                            </SelectItem>

                            <SelectItem value="mindanao">
                                Mindanao
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={status}
                        onValueChange={(value) =>
                            onStatusChange(
                                value as
                                    | BranchStatus
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
                    branches
                </p>
            </div>
        </div>
    );
}