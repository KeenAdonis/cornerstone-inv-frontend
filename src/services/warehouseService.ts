import {
    API_BASE_URL,
} from "@/src/lib/api";

export interface Warehouse {
    id: number;
    name: string;
    code: string;
    area: "luzon" | "visayas" | "mindanao";
    address: string;
    status: "active" | "inactive";
}

export interface CreateWarehouseData {
    name: string;
    code: string;
    area: "luzon" | "visayas" | "mindanao";
    address: string;
    status: "active" | "inactive";
}

export interface UpdateWarehouseData {
    name: string;
    code: string;
    area: "luzon" | "visayas" | "mindanao";
    address: string;
    status: "active" | "inactive";
}

interface ApiCreateWarehouseResponse {
    success: boolean;
    message: string;
    data: {
        warehouse: Warehouse;
    };
}

interface ApiUpdateWarehouseResponse {
    success: boolean;
    message: string;
    data: {
        warehouse: Warehouse;
    };
}

interface ApiDeleteWarehouseResponse {
    success: boolean;
    message: string;
}

interface ApiToggleWarehouseStatusResponse {
    success: boolean;
    message: string;
    data: {
        warehouse: Warehouse;
    };
}

interface ApiWarehousesResponse {
    success: boolean;
    data: {
        warehouses: Warehouse[];
    };
}

export interface CreateWarehouseResponse {
    success: boolean;
    message: string;
    warehouse: Warehouse;
}

export interface UpdateWarehouseResponse {
    success: boolean;
    message: string;
    warehouse: Warehouse;
}

export interface DeleteWarehouseResponse {
    success: boolean;
    message: string;
}

export interface ToggleWarehouseStatusResponse {
    success: boolean;
    message: string;
    warehouse: Warehouse;
}

/**
 * Retrieves the XSRF token stored by Laravel
 * in the browser cookie.
 */
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

/**
 * Creates a new warehouse.
 */
export async function createWarehouse(
    warehouseData: CreateWarehouseData
): Promise<CreateWarehouseResponse> {
    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/warehouses`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
            body: JSON.stringify(warehouseData),
        }
    );

    const data: ApiCreateWarehouseResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to create warehouse."
        );
    }

    return {
        success: data.success,
        message: data.message,
        warehouse: data.data.warehouse,
    };
}

/**
 * Updates an existing warehouse.
 */
export async function updateWarehouse(
    warehouseId: number,
    warehouseData: UpdateWarehouseData
): Promise<UpdateWarehouseResponse> {
    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/warehouses/${warehouseId}`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
            body: JSON.stringify(warehouseData),
        }
    );

    const data: ApiUpdateWarehouseResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to update warehouse."
        );
    }

    return {
        success: data.success,
        message: data.message,
        warehouse: data.data.warehouse,
    };
}

/**
 * Retrieves all active warehouses.
 */
export async function getWarehouses(): Promise<Warehouse[]> {
    const response = await fetch(
        `${API_BASE_URL}/warehouses`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
        }
    );

    const data: ApiWarehousesResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "Unable to retrieve warehouses."
        );
    }

    return data.data.warehouses;
}

/**
 * Deletes an existing warehouse.
 */
export async function deleteWarehouse(
    warehouseId: number
): Promise<DeleteWarehouseResponse> {
    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/warehouses/${warehouseId}`,
        {
            method: "DELETE",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
        }
    );

    const data: ApiDeleteWarehouseResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to delete warehouse."
        );
    }

    return {
        success: data.success,
        message: data.message,
    };
}

/**
 * Toggles an existing warehouse status.
 */
export async function toggleWarehouseStatus(
    warehouseId: number
): Promise<ToggleWarehouseStatusResponse> {
    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/warehouses/${warehouseId}/status`,
        {
            method: "PATCH",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
        }
    );

    const data: ApiToggleWarehouseStatusResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to update warehouse status."
        );
    }

    return {
        success: data.success,
        message: data.message,
        warehouse: data.data.warehouse,
    };
}