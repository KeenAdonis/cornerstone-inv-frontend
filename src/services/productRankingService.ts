import {
    API_BASE_URL,
} from "@/src/lib/api";

export interface ProductRanking {
    rank: number;
    product_id: number;
    product_name: string | null;
    sku: string | null;
    unit: string | null;
    total_quantity: number;
}

export interface ProductRankingFilters {
    branchId?: number;
    warehouseId?: number;
    dateFrom?: string;
    dateTo?: string;
}

interface ProductRankingsResponse {
    success: boolean;
    data: {
        product_rankings: ProductRanking[];
    };
}

export async function getProductRankings(
    filters?: ProductRankingFilters
): Promise<ProductRanking[]> {
    const params =
        new URLSearchParams();

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

    if (filters?.dateFrom) {
        params.set(
            "date_from",
            filters.dateFrom
        );
    }

    if (filters?.dateTo) {
        params.set(
            "date_to",
            filters.dateTo
        );
    }

    const queryString =
        params.toString();

    const response = await fetch(
        `${API_BASE_URL}/product-rankings${
            queryString
                ? `?${queryString}`
                : ""
        }`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                Accept:
                    "application/json",
            },
        }
    );

    const data:
        | ProductRankingsResponse
        | { message?: string } =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "message" in data &&
            data.message
                ? data.message
                : "Failed to load product rankings."
        );
    }

    return (
        data as ProductRankingsResponse
    ).data.product_rankings;
}