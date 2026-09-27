import {
    API_BASE_URL,
} from "@/src/lib/api";

export interface ActivityLogUser {
    id: number;
    name: string;
    email: string;
}

export interface ActivityLogBranch {
    id: number;
    name: string;
    code: string;
}

export interface ActivityLogWarehouse {
    id: number;
    name: string;
    code: string;
}

export interface ActivityLog {
    id: number;

    user_id: number;
    branch_id: number | null;
    warehouse_id: number | null;

    action: string;
    module: string;
    description: string;

    subject_type: string | null;
    subject_id: number | null;

    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;

    ip_address: string | null;
    user_agent: string | null;

    created_at: string;
    updated_at: string;

    user: ActivityLogUser;
    branch: ActivityLogBranch | null;
    warehouse: ActivityLogWarehouse | null;
    subject: Record<string, unknown> | null;
}

export interface ActivityLogFilters {
    user_id?: number;
    branch_id?: number;
    warehouse_id?: number;
    module?: string;
    action?: string;
    date_from?: string;
    date_to?: string;
}

interface ActivityLogApiResponse {
    success: boolean;
    data: {
        activity_logs: ActivityLog[];
    };
}

/**
 * Retrieves activity logs available
 * to the currently authenticated user.
 */
export async function getActivityLogs(
    filters: ActivityLogFilters = {}
): Promise<ActivityLog[]> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(
        ([key, value]) => {
            if (
                value !== undefined &&
                value !== null &&
                value !== ""
            ) {
                params.append(
                    key,
                    String(value)
                );
            }
        }
    );

    const queryString = params.toString();

    const response = await fetch(
        `${API_BASE_URL}/activity-logs${
            queryString
                ? `?${queryString}`
                : ""
        }`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
        }
    );

    const data: ActivityLogApiResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "Unable to retrieve activity logs."
        );
    }

    return data.data.activity_logs;
}