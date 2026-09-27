import { API_BASE_URL } from "@/src/lib/api";

export interface Category {
    id: number;
    name: string;
    description: string | null;
    status: "active" | "inactive";
}

export interface CreateCategoryData {
    name: string;
    description?: string;
    status?: "active" | "inactive";
}

export interface UpdateCategoryData {
    name: string;
    description?: string;
    status?: "active" | "inactive";
}

interface CategoriesResponse {
    success: boolean;
    data: {
        categories: Category[];
    };
}

interface CategoryResponse {
    success: boolean;
    message: string;
    data: {
        category: Category;
    };
}

interface DeleteCategoryResponse {
    success: boolean;
    message: string;
}

function getXsrfToken(): string | null {
    const cookies = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("XSRF-TOKEN="));

    if (!cookies) {
        return null;
    }

    return decodeURIComponent(cookies.split("=")[1]);
}

export async function getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
        credentials: "include",
    });

    const data: CategoriesResponse = await response.json();

    if (!response.ok) {
        throw new Error("Failed to fetch categories.");
    }

    return data.data.categories;
}

export async function createCategory(
    categoryData: CreateCategoryData
): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-XSRF-TOKEN": getXsrfToken() ?? "",
        },
        body: JSON.stringify(categoryData),
    });

    const data: CategoryResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create category.");
    }

    return data.data.category;
}

export async function updateCategory(
    categoryId: number,
    categoryData: UpdateCategoryData
): Promise<Category> {
    const response = await fetch(
        `${API_BASE_URL}/categories/${categoryId}`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-XSRF-TOKEN": getXsrfToken() ?? "",
            },
            body: JSON.stringify(categoryData),
        }
    );

    const data: CategoryResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update category.");
    }

    return data.data.category;
}

export async function deleteCategory(
    categoryId: number
): Promise<DeleteCategoryResponse> {
    const response = await fetch(
        `${API_BASE_URL}/categories/${categoryId}`,
        {
            method: "DELETE",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN": getXsrfToken() ?? "",
            },
        }
    );

    const data: DeleteCategoryResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete category.");
    }

    return data;
}

export async function toggleCategoryStatus(
    categoryId: number
): Promise<Category> {
    const response = await fetch(
        `${API_BASE_URL}/categories/${categoryId}/status`,
        {
            method: "PATCH",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN": getXsrfToken() ?? "",
            },
        }
    );

    const data: CategoryResponse = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to update category status."
        );
    }

    return data.data.category;
}