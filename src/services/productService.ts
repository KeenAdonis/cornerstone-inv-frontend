import {
    API_BASE_URL,
    API_ORIGIN,
} from "@/src/lib/api";

export interface ProductCategory {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    category_id: number;
    product_code: string | null;
    name: string;
    sku: string;
    unit: string;
    srp: string;
    description: string | null;
    image_path: string | null;
    image_url: string | null;
    status: "active" | "inactive";
    category: ProductCategory;
}

export interface CreateProductData {
    category_id: number;
    product_code?: string;
    name: string;
    sku: string;
    unit: string;
    srp: number;
    description?: string;
    image?: File | null;
    status?: "active" | "inactive";
}

export interface UpdateProductData {
    category_id: number;
    product_code?: string;
    name: string;
    sku: string;
    unit: string;
    srp: number;
    description?: string;
    image?: File | null;
    status?: "active" | "inactive";
}

interface ProductsResponse {
    success: boolean;
    data: {
        products: Product[];
    };
}

interface ProductResponse {
    success: boolean;
    message: string;
    data: {
        product: Product;
    };
}

interface DeleteProductResponse {
    success: boolean;
    message: string;
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

function buildProductFormData(
    productData: CreateProductData | UpdateProductData
): FormData {
    const formData = new FormData();

    Object.entries(productData).forEach(([key, value]) => {
        if (key === "image") {
            if (value instanceof File) {
                formData.append("image", value);
            }

            return;
        }

        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    return formData;
}


/**
 * Gets all products.
 */
export async function getProducts(): Promise<Product[]> {
    const response = await fetch(
        `${API_BASE_URL}/products`,
        {
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
        }
    );

    const data: ProductsResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "Failed to fetch products."
        );
    }

    return data.data.products;
}

/**
 * Creates a new product.
 */
export async function createProduct(
    productData: CreateProductData
): Promise<Product> {
    const response = await fetch(
        `${API_BASE_URL}/products`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN": getXsrfToken() ?? "",
            },
            body: buildProductFormData(productData),
        }
    );

    const data: ProductResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
                "Failed to create product."
        );
    }

    return data.data.product;
}

/**
 * Updates an existing product.
 */
export async function updateProduct(
    productId: number,
    productData: UpdateProductData
): Promise<Product> {
    const response = await fetch(
        `${API_BASE_URL}/products/${productId}`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN": getXsrfToken() ?? "",
            },
            body: (() => {
                const formData = buildProductFormData(productData);
                formData.append("_method", "PUT");
                return formData;
            })(),
        }
    );

    const data: ProductResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
                "Failed to update product."
        );
    }

    return data.data.product;
}

/**
 * Deletes a product.
 */
export async function deleteProduct(
    productId: number
): Promise<DeleteProductResponse> {
    const response = await fetch(
        `${API_BASE_URL}/products/${productId}`,
        {
            method: "DELETE",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN":
                    getXsrfToken() ?? "",
            },
        }
    );

    const data: DeleteProductResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
                "Failed to delete product."
        );
    }

    return data;
}

/**
 * Toggles the product status.
 */
export async function toggleProductStatus(
    productId: number
): Promise<Product> {
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
        `${API_BASE_URL}/products/${productId}/status`,
        {
            method: "PATCH",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
        }
    );

    const data: ProductResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
                "Failed to update product status."
        );
    }

    return data.data.product;
}