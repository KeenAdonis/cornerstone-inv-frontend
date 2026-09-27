import {
    API_BASE_URL,
    API_ORIGIN,
} from "@/src/lib/api";

export interface PurchaseOrderItemInput {
    product_id: number;
    quantity: number;
}

export interface CreatePurchaseOrderPayload {
    branch_id: number;
    warehouse_id: number;
    items: PurchaseOrderItemInput[];
    notes?: string;
}

export interface PurchaseOrderFilters {
    branchId?: number;
    warehouseId?: number;
}

export interface PurchaseOrderItem {
    id: number;
    purchase_order_id: number;
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

export type DeliveryType =
    | "in_house"
    | "trucking"
    | "bus"
    | "air_cargo"
    | "forwarding";

export interface ReleasePurchaseOrderPayload {
    delivery_type: DeliveryType;
    ship_out_date: string;
}

export interface PurchaseOrder {
    id: number;
    reference_number: string;
    branch_id: number;
    warehouse_id: number;
    created_by: number;
    status:
        | "pending"
        | "approved"
        | "rejected"
        | "preparing"
        | "out_for_delivery"
        | "delivered"
        | "completed"
        | "cancelled";
    approved_by: number | null;
    approved_at: string | null;
    rejection_reason: string | null;
    requested_at: string;
    notes: string | null;

    delivery_type: DeliveryType | null;
    ship_out_date: string | null;
    date_of_arrival: string | null;

    delivery_photo_path: string | null;
    delivery_photo_url: string | null;

    created_at: string;
    updated_at: string;

    branch?: {
        id: number;
        name: string;
        code: string;
    };

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

    approver?: {
        id: number;
        name: string;
        email: string;
    };

    items: PurchaseOrderItem[];
}

export interface ReviewPurchaseOrderPayload {
    action: "approve" | "reject";
    rejection_reason?: string;
}

interface PurchaseOrdersResponse {
    success: boolean;
    data: {
        purchase_orders: PurchaseOrder[];
    };
}

interface PurchaseOrderResponse {
    success: boolean;
    message: string;
    data: {
        purchase_order: PurchaseOrder;
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

/**
 * Gets purchase orders visible
 * to the authenticated user.
 */
export async function getPurchaseOrders(
    filters?: PurchaseOrderFilters
): Promise<PurchaseOrder[]> {
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
        `${API_BASE_URL}/purchase-orders${
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
        | PurchaseOrdersResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to load purchase orders."
        );
    }

    return (
        data as PurchaseOrdersResponse
    ).data.purchase_orders;
}

/**
 * Creates a new purchase order.
 */
export async function createPurchaseOrder(
    payload: CreatePurchaseOrderPayload
): Promise<PurchaseOrder> {
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

    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/purchase-orders`,
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
        | PurchaseOrderResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to create purchase order."
        );
    }

    return (
        data as PurchaseOrderResponse
    ).data.purchase_order;
}

/**
 * Approves or rejects a purchase order.
 */
export async function reviewPurchaseOrder(
    purchaseOrderId: number,
    payload: ReviewPurchaseOrderPayload
): Promise<PurchaseOrder> {
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

    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/purchase-orders/${purchaseOrderId}/review`,
        {
            method: "PATCH",
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
        | PurchaseOrderResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to review purchase order."
        );
    }

    return (
        data as PurchaseOrderResponse
    ).data.purchase_order;
}

/**
 * Moves an approved purchase order
 * to preparing status.
 */
export async function processPurchaseOrder(
    purchaseOrderId: number
): Promise<PurchaseOrder> {
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

    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/purchase-orders/${purchaseOrderId}/process`,
        {
            method: "PATCH",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
        }
    );

    const data:
        | PurchaseOrderResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to prepare purchase order."
        );
    }

    return (
        data as PurchaseOrderResponse
    ).data.purchase_order;
}

/**
 * Releases a preparing purchase order
 * and moves inventory out of the warehouse.
 */
export async function releasePurchaseOrder(
    purchaseOrderId: number,
    payload: ReleasePurchaseOrderPayload
): Promise<PurchaseOrder> {
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

    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/purchase-orders/${purchaseOrderId}/release`,
        {
            method: "PATCH",
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
        | PurchaseOrderResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to release purchase order."
        );
    }

    return (
        data as PurchaseOrderResponse
    ).data.purchase_order;
}

/**
 * Marks an out-for-delivery purchase order
 * as delivered and uploads its proof of delivery.
 */
export async function deliverPurchaseOrder(
    purchaseOrderId: number,
    deliveryPhoto: File,
    dateOfArrival: string
): Promise<PurchaseOrder> {
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

    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const formData = new FormData();

    formData.append(
        "_method",
        "PATCH"
    );

    formData.append(
        "delivery_photo",
        deliveryPhoto
    );

    formData.append(
        "date_of_arrival",
        dateOfArrival
    );

    const response = await fetch(
        `${API_BASE_URL}/purchase-orders/${purchaseOrderId}/deliver`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN":
                    xsrfToken,
            },
            body: formData,
        }
    );

    const data:
        | PurchaseOrderResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to mark purchase order as delivered."
        );
    }

    return (
        data as PurchaseOrderResponse
    ).data.purchase_order;
}

/**
 * Completes a delivered purchase order.
 *
 * No file is required because the proof of delivery
 * is uploaded by the branch coordinator during delivery.
 */
export async function completePurchaseOrder(
    purchaseOrderId: number
): Promise<PurchaseOrder> {
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

    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/purchase-orders/${purchaseOrderId}/complete`,
        {
            method: "PATCH",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN":
                    xsrfToken,
            },
        }
    );

    const data:
        | PurchaseOrderResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to complete purchase order."
        );
    }

    return (
        data as PurchaseOrderResponse
    ).data.purchase_order;
}