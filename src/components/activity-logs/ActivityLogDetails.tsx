"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    Activity,
    CalendarDays,
    CheckCircle2,
    Globe,
    History,
    MapPin,
    UserRound,
} from "lucide-react";

import type {
    ActivityLog,
} from "@/src/services/activityLogService";

interface ActivityLogDetailsProps {
    log: ActivityLog | null;
    open: boolean;
    onOpenChange: (
        open: boolean
    ) => void;
}

/*
|--------------------------------------------------------------------------
| Date / Time Formatting
|--------------------------------------------------------------------------
*/

const formatDateTime = (
    value: string
): string => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString(
        "en-PH",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }
    );
};

const formatDateValue = (
    value: string
): string => {
    if (!value) {
        return "Not set";
    }

    /*
    |--------------------------------------------------------------------------
    | Handle full datetime values
    |--------------------------------------------------------------------------
    */

    if (
        value.includes("T") ||
        value.includes(" ")
    ) {
        return formatDateTime(value);
    }

    /*
    |--------------------------------------------------------------------------
    | Handle YYYY-MM-DD
    |--------------------------------------------------------------------------
    */

    const date = new Date(
        `${value}T00:00:00`
    );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return value;
    }

    return date.toLocaleDateString(
        "en-PH",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );
};

/*
|--------------------------------------------------------------------------
| Label Formatting
|--------------------------------------------------------------------------
*/

const formatLabel = (
    value: string
): string => {
    return value
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
};

const formatEnumValue = (
    value: string
): string => {
    return value
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
};

/*
|--------------------------------------------------------------------------
| Action Styling
|--------------------------------------------------------------------------
*/

const getActionClassName = (
    action: string
): string => {
    const classes: Record<
        string,
        string
    > = {
        created:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

        updated:
            "border-blue-200 bg-blue-50 text-blue-700",

        status_changed:
            "border-amber-200 bg-amber-50 text-amber-700",

        approved:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

        rejected:
            "border-red-200 bg-red-50 text-red-700",

        prepared:
            "border-indigo-200 bg-indigo-50 text-indigo-700",

        released:
            "border-violet-200 bg-violet-50 text-violet-700",

        delivered:
            "border-cyan-200 bg-cyan-50 text-cyan-700",

        completed:
            "border-emerald-200 bg-emerald-50 text-emerald-700",

        deleted:
            "border-red-200 bg-red-50 text-red-700",

        login_failed:
            "border-red-200 bg-red-50 text-red-700",

        logged_in:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
    };

    return (
        classes[action] ??
        "border-slate-200 bg-slate-50 text-slate-700"
    );
};

/*
|--------------------------------------------------------------------------
| Subject
|--------------------------------------------------------------------------
*/

const getSubjectLabel = (
    subjectType: string | null
): string => {
    if (!subjectType) {
        return "—";
    }

    const subjectName =
        subjectType
            .split("\\")
            .pop() ??
        subjectType;

    return formatLabel(
        subjectName
    );
};

/*
|--------------------------------------------------------------------------
| Field Helpers
|--------------------------------------------------------------------------
*/

const dateFields = [
    "date",
    "ship_out_date",
    "date_of_arrival",
    "requested_at",
    "approved_at",
    "created_at",
    "updated_at",
];

const statusFields = [
    "status",
    "action",
    "role",
    "type",
    "delivery_type",
    "cutoff_type",
];

const isDateField = (
    key: string
): boolean => {
    return dateFields.includes(key);
};

const isStatusField = (
    key: string
): boolean => {
    return statusFields.includes(key);
};

const getFieldLabel = (
    key: string
): string => {
    const labels: Record<
        string,
        string
    > = {
        id: "ID",

        user_id: "User",

        branch_id: "Branch",

        warehouse_id: "Warehouse",

        product_id: "Product",

        category_id: "Category",

        item_id: "Item",

        purchase_order_id:
            "Purchase Order",

        stock_adjustment_id:
            "Stock Adjustment",

        inventory_count_id:
            "Inventory Count",

        status: "Status",

        action: "Action",

        delivery_type:
            "Delivery Type",

        ship_out_date:
            "Ship Out Date",

        date_of_arrival:
            "Date of Arrival",

        requested_at:
            "Requested At",

        approved_at:
            "Approved At",

        created_at:
            "Created At",

        updated_at:
            "Updated At",

        quantity: "Quantity",

        ordered_quantity:
            "Ordered Quantity",

        received_quantity:
            "Received Quantity",

        adjusted_quantity:
            "Adjusted Quantity",

        par_level:
            "PAR Level",

        reorder_level:
            "Reorder Level",

        role: "Role",

        email: "Email",

        name: "Name",

        code: "Code",

        description:
            "Description",

        reason: "Reason",

        notes: "Notes",

        is_active:
            "Active Status",
    };

    return (
        labels[key] ??
        formatLabel(key)
    );
};

/*
|--------------------------------------------------------------------------
| Value Formatting
|--------------------------------------------------------------------------
*/

const formatValue = (
    key: string,
    value: unknown
): string => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "Not set";
    }

    if (
        typeof value === "boolean"
    ) {
        return value
            ? "Yes"
            : "No";
    }

    if (
        typeof value === "number"
    ) {
        return value.toLocaleString(
            "en-PH"
        );
    }

    if (
        typeof value === "object"
    ) {
        return JSON.stringify(
            value,
            null,
            2
        );
    }

    const stringValue =
        String(value);

    if (isDateField(key)) {
        return formatDateValue(
            stringValue
        );
    }

    if (isStatusField(key)) {
        return formatEnumValue(
            stringValue
        );
    }

    return stringValue;
};

/*
|--------------------------------------------------------------------------
| Value Section
|--------------------------------------------------------------------------
*/

interface ValueSectionProps {
    title: string;

    values:
        | Record<string, unknown>
        | null;

    variant:
        | "old"
        | "new";
}

function ValueSection({
    title,
    values,
    variant,
}: ValueSectionProps) {
    const entries = values
        ? Object.entries(values)
        : [];

    const isNew =
        variant === "new";

    return (
        <section>
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className={
                            isNew
                                ? "flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50"
                                : "flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100"
                        }
                    >
                        {isNew ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                            <History className="h-3.5 w-3.5 text-slate-500" />
                        )}
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900">
                        {title}
                    </h3>
                </div>

                {entries.length > 0 && (
                    <span className="text-[11px] font-medium text-slate-400">
                        {entries.length}{" "}
                        {entries.length === 1
                            ? "field"
                            : "fields"}
                    </span>
                )}
            </div>

            {entries.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5">
                    <p className="text-sm text-slate-400">
                        No values recorded.
                    </p>
                </div>
            ) : (
                <div
                    className={
                        isNew
                            ? "overflow-hidden rounded-xl border border-emerald-100 bg-white"
                            : "overflow-hidden rounded-xl border border-slate-200 bg-white"
                    }
                >
                    {entries.map(
                        ([key, value]) => {
                            const formatted =
                                formatValue(
                                    key,
                                    value
                                );

                            const isObject =
                                typeof value ===
                                "object" &&
                                value !== null;

                            return (
                                <div
                                    key={key}
                                    className="grid grid-cols-1 gap-1 border-b border-slate-100 px-4 py-3.5 last:border-b-0 sm:grid-cols-[145px_minmax(0,1fr)] sm:gap-5"
                                >
                                    <p className="text-xs font-medium text-slate-500">
                                        {getFieldLabel(
                                            key
                                        )}
                                    </p>

                                    {isObject ? (
                                        <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-2.5 font-mono text-[11px] leading-5 text-slate-600">
                                            {
                                                formatted
                                            }
                                        </pre>
                                    ) : (
                                        <p
                                            className={
                                                isNew
                                                    ? "whitespace-pre-wrap break-words text-sm font-medium text-slate-800"
                                                    : "whitespace-pre-wrap break-words text-sm text-slate-700"
                                            }
                                        >
                                            {
                                                formatted
                                            }
                                        </p>
                                    )}
                                </div>
                            );
                        }
                    )}
                </div>
            )}
        </section>
    );
}

/*
|--------------------------------------------------------------------------
| Main Component
|--------------------------------------------------------------------------
*/

export default function ActivityLogDetails({
    log,
    open,
    onOpenChange,
}: ActivityLogDetailsProps) {
    if (!log) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | Location
    |--------------------------------------------------------------------------
    */

    const location =
        log.branch
            ? `${log.branch.name} (${log.branch.code})`
            : log.warehouse
              ? `${log.warehouse.name} (${log.warehouse.code})`
              : "—";

    const locationType =
        log.branch
            ? "Branch"
            : log.warehouse
              ? "Warehouse"
              : null;

    /*
    |--------------------------------------------------------------------------
    | Subject
    |--------------------------------------------------------------------------
    */

    const subjectLabel =
        getSubjectLabel(
            log.subject_type
        );

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <Dialog
            open={open}
            onOpenChange={
                onOpenChange
            }
        >
            <DialogContent
                className="
                    flex
                    max-h-[94vh]
                    flex-col
                    overflow-hidden
                    border-blue-100
                    bg-white
                    p-0
                    text-slate-900
                    sm:max-w-4xl
                "
            >
                {/* =====================================================
                    Header
                ====================================================== */}

                <DialogHeader className="shrink-0 border-b border-slate-100 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 pr-7 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                    <Activity className="h-4 w-4 text-blue-600" />
                                </div>

                                <DialogTitle className="text-base font-semibold tracking-tight text-slate-900">
                                    Activity Log Details
                                </DialogTitle>
                            </div>

                            <DialogDescription className="mt-2 text-sm leading-5 text-slate-500">
                                Detailed information about
                                this system activity.
                            </DialogDescription>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <Badge
                                variant="outline"
                                className={`rounded-lg px-2.5 py-1 text-xs font-medium ${getActionClassName(
                                    log.action
                                )}`}
                            >
                                {formatLabel(
                                    log.action
                                )}
                            </Badge>

                            <Badge
                                variant="outline"
                                className="rounded-lg border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
                            >
                                {formatLabel(
                                    log.module
                                )}
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                {/* =====================================================
                    Scrollable Content
                ====================================================== */}

                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]">
                    <div className="space-y-7">
                        {/* =================================================
                            Activity Summary
                        ================================================== */}

                        <section>
                            <div className="mb-3 flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />

                                <h3 className="text-sm font-semibold text-slate-900">
                                    Activity
                                </h3>
                            </div>

                            <div className="rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-4">
                                <p className="text-sm font-medium leading-6 text-slate-800">
                                    {
                                        log.description
                                    }
                                </p>
                            </div>
                        </section>

                        {/* =================================================
                            Activity Information
                        ================================================== */}

                        <section>
                            <div className="mb-3 flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />

                                <h3 className="text-sm font-semibold text-slate-900">
                                    Activity Information
                                </h3>
                            </div>

                            <div className="grid overflow-hidden rounded-xl border border-slate-200 bg-white sm:grid-cols-2">
                                {/* Date */}
                                <div className="border-b border-slate-100 p-4 sm:border-r">
                                    <p className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <CalendarDays className="h-3.5 w-3.5" />

                                        Date & Time
                                    </p>

                                    <p className="mt-1.5 text-sm font-medium text-slate-800">
                                        {formatDateTime(
                                            log.created_at
                                        )}
                                    </p>
                                </div>

                                {/* User */}
                                <div className="border-b border-slate-100 p-4">
                                    <p className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <UserRound className="h-3.5 w-3.5" />

                                        Performed By
                                    </p>

                                    <div className="mt-1.5">
                                        <p className="text-sm font-medium text-slate-800">
                                            {log.user?.name ??
                                                "Unauthenticated"}
                                        </p>

                                        <p className="mt-0.5 truncate text-xs text-slate-500">
                                            {log.user?.email ??
                                                "No authenticated user"}
                                        </p>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="border-b border-slate-100 p-4 sm:border-r sm:border-b-0">
                                    <p className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <MapPin className="h-3.5 w-3.5" />

                                        Location
                                    </p>

                                    <p className="mt-1.5 text-sm font-medium text-slate-800">
                                        {locationType
                                            ? `${locationType} · ${location}`
                                            : "—"}
                                    </p>
                                </div>

                                {/* Subject */}
                                <div className="border-b border-slate-100 p-4 sm:border-b-0">
                                    <p className="text-xs font-medium text-slate-400">
                                        Subject
                                    </p>

                                    <p className="mt-1.5 text-sm font-medium text-slate-800">
                                        {
                                            subjectLabel
                                        }

                                        {log.subject_id !==
                                            null && (
                                            <span className="ml-2 font-mono text-xs font-normal text-slate-400">
                                                #
                                                {
                                                    log.subject_id
                                                }
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* IP Address */}
                                <div className="border-t border-slate-100 p-4 sm:border-r">
                                    <p className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                        <Globe className="h-3.5 w-3.5" />

                                        IP Address
                                    </p>

                                    <p className="mt-1.5 font-mono text-sm text-slate-700">
                                        {log.ip_address ??
                                            "—"}
                                    </p>
                                </div>

                                {/* User Agent */}
                                <div className="border-t border-slate-100 p-4">
                                    <p className="text-xs font-medium text-slate-400">
                                        User Agent
                                    </p>

                                    <p className="mt-1.5 break-all text-xs leading-5 text-slate-600">
                                        {log.user_agent ??
                                            "—"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* =================================================
                            Changes
                        ================================================== */}

                        <section>
                            <div className="mb-3 flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />

                                <h3 className="text-sm font-semibold text-slate-900">
                                    Recorded Changes
                                </h3>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <ValueSection
                                    title="Previous Values"
                                    values={
                                        log.old_values
                                    }
                                    variant="old"
                                />

                                <ValueSection
                                    title="New Values"
                                    values={
                                        log.new_values
                                    }
                                    variant="new"
                                />
                            </div>
                        </section>
                    </div>
                </div>

                
            </DialogContent>
        </Dialog>
    );
}