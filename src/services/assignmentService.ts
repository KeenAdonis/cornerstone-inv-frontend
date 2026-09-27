import { API_BASE_URL } from "@/src/lib/api";

export interface Branch {
    id: number;
    name: string;
    code: string;
    area: "luzon" | "visayas" | "mindanao";
    address: string;
}

export interface Warehouse {
    id: number;
    name: string;
    code: string;
    area: "luzon" | "visayas" | "mindanao";
    address: string;
}

interface BranchesApiResponse {
    success: boolean;
    data: {
        branches: Branch[];
    };
}

interface WarehousesApiResponse {
    success: boolean;
    data: {
        warehouses: Warehouse[];
    };
}

/**
 * Retrieves all active branches.
 */
export async function getBranches(): Promise<Branch[]> {
    const response = await fetch(
        `${API_BASE_URL}/branches`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
        }
    );

    const data: BranchesApiResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "Unable to retrieve branches."
        );
    }

    return data.data.branches;
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

    const data: WarehousesApiResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "Unable to retrieve warehouses."
        );
    }

    return data.data.warehouses;
}