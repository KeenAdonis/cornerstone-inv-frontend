import {
    API_BASE_URL,
    API_ORIGIN,
} from "@/src/lib/api";

export interface StockInItemInput {
    product_id: number;
    quantity: number;
}

export interface CreateStockInPayload {
    received_at: string;
    notes?: string;
    items: StockInItemInput[];
}

export interface StockInItem {
    id: number;
    stock_in_id: number;
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

export interface StockIn {
    id: number;
    warehouse_id: number;
    reference_number: string;
    received_at: string;
    created_by: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
    warehouse?: {
        id: number;
        name: string;
        code: string;
    };
    creator?: {
        id: number;
        name: string;
        email: string;
    };
    items: StockInItem[];
}

interface StockInsResponse {
    success: boolean;
    data: {
        stock_ins: StockIn[];
    };
}

interface CreateStockInResponse {
    success: boolean;
    message: string;
    data: {
        stock_in: StockIn;
    };
}

export async function getStockIns(): Promise<StockIn[]> {
    const response = await fetch(
        `${API_BASE_URL}/stock-ins`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
        }
    );

    const data:
        | StockInsResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to load stock-in transactions."
        );
    }

    return (
        data as StockInsResponse
    ).data.stock_ins;
}

export async function createStockIn(
    payload: CreateStockInPayload
): Promise<StockIn> {
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
        decodeURIComponent(
            document.cookie
                .split("; ")
                .find((row) =>
                    row.startsWith(
                        "XSRF-TOKEN="
                    )
                )
                ?.split("=")[1] || ""
        );

    const response = await fetch(
        `${API_BASE_URL}/stock-ins`,
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
        | CreateStockInResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to create stock-in transaction."
        );
    }

    return (
        data as CreateStockInResponse
    ).data.stock_in;
}