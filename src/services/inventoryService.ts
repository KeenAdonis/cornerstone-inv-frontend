import {
    API_BASE_URL,
    API_ORIGIN,
} from "@/src/lib/api";

export interface InventoryProduct {
    id: number;
    name: string;
    sku: string;
    unit: string;
    srp: string;
    status: "active" | "inactive";
    category: {
        id: number;
        name: string;
    } | null;
}

export interface InventoryWarehouse {
    id: number;
    name: string;
    code: string;
}

export interface InventoryBranch {
    id: number;
    name: string;
    code: string;
    area?: string;
}

export interface Inventory {
    id: number;
    product_id: number;
    warehouse_id: number | null;
    branch_id: number | null;
    quantity: string;
    par_level: string;
    reorder_level: string;
    product: InventoryProduct;
    warehouse: InventoryWarehouse | null;
    branch: InventoryBranch | null;
}

export interface InventoryFilters {
    locationType?: "branch" | "warehouse";
    area?: string;
    branchId?: number;
    warehouseId?: number;
}

export interface UpdateInventoryStockLevelsData {
    par_level: number;
    reorder_level: number;
}

interface InventoryResponse {
    success: boolean;
    data: {
        inventory: Inventory[];
    };
}

interface UpdateInventoryStockLevelsResponse {
    success: boolean;
    message: string;
    data: {
        inventory: Inventory;
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

export async function getInventory(
    filters?: InventoryFilters
): Promise<Inventory[]> {
    const params = new URLSearchParams();

    if (filters?.locationType) {
        params.set(
            "location_type",
            filters.locationType
        );
    }

    if (filters?.area) {
        params.set(
            "area",
            filters.area
        );
    }

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
        `${API_BASE_URL}/inventory${
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

    const data: InventoryResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to load inventory."
        );
    }

    return data.data.inventory;
}

export async function updateInventoryStockLevels(
    inventoryId: number,
    stockLevelData: UpdateInventoryStockLevelsData
): Promise<Inventory> {
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
        `${API_BASE_URL}/inventory/${inventoryId}/stock-levels`,
        {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
            body: JSON.stringify(
                stockLevelData
            ),
        }
    );

    const data:
        | UpdateInventoryStockLevelsResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to update inventory stock levels."
        );
    }

    return (
        data as UpdateInventoryStockLevelsResponse
    ).data.inventory;
}