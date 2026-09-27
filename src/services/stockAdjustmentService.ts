import {
    API_BASE_URL,
    API_ORIGIN,
} from "@/src/lib/api";

export interface StockAdjustmentItemInput {
    product_id: number;
    quantity: number;
}

export interface CreateStockAdjustmentPayload {
    type: "increase" | "decrease";
    reason: string;
    adjusted_at: string;
    notes?: string;
    branch_id?: number;
    warehouse_id?: number;
    items: StockAdjustmentItemInput[];
}

export interface StockAdjustmentFilters {
    branchId?: number;
    warehouseId?: number;
}

export interface StockAdjustmentItem {
    id: number;
    stock_adjustment_id: number;
    product_id: number;
    quantity: string;
    created_at: string;
    updated_at: string;
    product?: {
        id: number;
        name: string;
        sku: string;
        unit: string;
    };
}

export interface StockAdjustment {
    id: number;
    warehouse_id: number;
    branch_id: number | null;
    reference_number: string;
    type: "increase" | "decrease";
    reason: string;
    adjusted_at: string;
    created_by: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
    warehouse?: {
        id: number;
        name: string;
        code: string;
    };
    branch?: {
        id: number;
        name: string;
        code: string;
        area?: string;
    };
    creator?: {
        id: number;
        name: string;
        email: string;
    };
    items: StockAdjustmentItem[];
}

interface StockAdjustmentsResponse {
    success: boolean;
    data: {
        stock_adjustments: StockAdjustment[];
    };
}

interface CreateStockAdjustmentResponse {
    success: boolean;
    message: string;
    data: {
        stock_adjustment: StockAdjustment;
    };
}

function getXsrfToken(): string | null {
    const cookie = document.cookie
        .split("; ")
        .find((row) =>
            row.startsWith("XSRF-TOKEN=")
        );

    if (!cookie) {
        return null;
    }

    return decodeURIComponent(
        cookie.split("=")[1]
    );
}

export async function getStockAdjustments(
    filters?: StockAdjustmentFilters
): Promise<StockAdjustment[]> {
    const params = new URLSearchParams();

    if (filters?.branchId) {
        params.set(
            "branch_id",
            String(filters.branchId)
        );
    }

    if (filters?.warehouseId) {
        params.set(
            "warehouse_id",
            String(filters.warehouseId)
        );
    }

    const queryString =
        params.toString();

    const response = await fetch(
        `${API_BASE_URL}/stock-adjustments${
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
        | StockAdjustmentsResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to load stock adjustment transactions."
        );
    }

    return (
        data as StockAdjustmentsResponse
    ).data.stock_adjustments;
}

export async function createStockAdjustment(
    payload: CreateStockAdjustmentPayload
): Promise<StockAdjustment> {
    const csrfResponse = await fetch(
        `${API_ORIGIN}/sanctum/csrf-cookie`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!csrfResponse.ok) {
        throw new Error(
            "Failed to initialize secure request."
        );
    }

    const xsrfToken =
        getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Failed to initialize secure request."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/stock-adjustments`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type":
                    "application/json",
                "X-XSRF-TOKEN":
                    xsrfToken,
            },
            body: JSON.stringify(
                payload
            ),
        }
    );

    const data:
        | CreateStockAdjustmentResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to create stock adjustment."
        );
    }

    return (
        data as CreateStockAdjustmentResponse
    ).data.stock_adjustment;
}