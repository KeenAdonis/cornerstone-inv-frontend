import {
    API_BASE_URL,
} from "@/src/lib/api";

export interface StockMovementFilters {
    branchId?: number;
    warehouseId?: number;
}

export interface StockMovement {
    id: number;

    product_id: number;
    purchase_order_id: number | null;

    movement_type:
        | "stock_in"
        | "stock_out"
        | "transfer"
        | "adjustment";

    quantity: string;

    from_warehouse_id: number | null;
    from_branch_id: number | null;

    to_warehouse_id: number | null;
    to_branch_id: number | null;

    moved_at: string;

    created_by: number;

    notes: string | null;

    created_at: string;
    updated_at: string;

    product?: {
        id: number;
        name: string;
        sku: string;
        unit: string;
        category?: {
            id: number;
            name: string;
        };
    };

    purchase_order?: {
        id: number;
        reference_number: string;
        status: string;
    };

    from_warehouse?: {
        id: number;
        name: string;
        code: string;
    };

    from_branch?: {
        id: number;
        name: string;
        code: string;
    };

    to_warehouse?: {
        id: number;
        name: string;
        code: string;
    };

    to_branch?: {
        id: number;
        name: string;
        code: string;
    };

    creator?: {
        id: number;
        name: string;
        email: string;
    };
}

interface StockMovementsResponse {
    success: boolean;
    data: {
        stock_movements: StockMovement[];
    };
}

export async function getStockMovements(
    filters?: StockMovementFilters
): Promise<StockMovement[]> {
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
        `${API_BASE_URL}/stock-movements${
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
        | StockMovementsResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to load stock movement history."
        );
    }

    return (
        data as StockMovementsResponse
    ).data.stock_movements;
}