import {
    API_BASE_URL,
    API_ORIGIN,
} from "@/src/lib/api";

export interface InventoryCountItemData {
    inventory_id: number;
    counted_quantity: number;
}

export interface CreateInventoryCountData {
    branch_id: number;
    items: InventoryCountItemData[];
    notes?: string;
}

export interface InventoryCountItem {
    id: number;
    inventory_count_id: number;
    inventory_id: number;
    product_id: number;
    system_quantity: string;
    counted_quantity: string;
    variance: string;
    product: {
        id: number;
        name: string;
        sku: string;
        unit: string;
    };
}

export interface InventoryCount {
    id: number;
    branch_id: number;
    counted_by: number;
    counted_at: string;
    status: "completed" | "cancelled";
    notes: string | null;
    branch: {
        id: number;
        name: string;
        code: string;
    };
    countedBy: {
        id: number;
        name: string;
    };
    items: InventoryCountItem[];
}

interface CreateInventoryCountResponse {
    message: string;
    data: InventoryCount;
}

interface InventoryCountResponse {
    success: boolean;
    data: {
        inventory_counts: InventoryCount[];
    };
}

function getXsrfToken(): string | null {
    const cookies = document.cookie
        .split("; ")
        .find((cookie) =>
            cookie.startsWith("XSRF-TOKEN=")
        );

    if (!cookies) {
        return null;
    }

    return decodeURIComponent(
        cookies.split("=")[1]
    );
}

export async function createInventoryCount(
    countData: CreateInventoryCountData
): Promise<InventoryCount> {
    const csrfResponse = await fetch(
        `${API_ORIGIN}/sanctum/csrf-cookie`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!csrfResponse.ok) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/inventory-counts`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
            body: JSON.stringify(countData),
        }
    );

    const data:
        | CreateInventoryCountResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to complete inventory count."
        );
    }

    return (
        data as CreateInventoryCountResponse
    ).data;
}

export async function getInventoryCounts(
    branchId?: number
): Promise<InventoryCount[]> {
    const params = new URLSearchParams();

    if (branchId) {
        params.set(
            "branch_id",
            String(branchId)
        );
    }

    const queryString =
        params.toString();

    const response = await fetch(
        `${API_BASE_URL}/inventory-counts${
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

    const data:
        | InventoryCountResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to load inventory count history."
        );
    }

    return (
        data as InventoryCountResponse
    ).data.inventory_counts;
}