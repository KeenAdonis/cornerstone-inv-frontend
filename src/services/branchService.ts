import {
    API_BASE_URL,
} from "@/src/lib/api";

export interface Branch {
    id: number;
    name: string;
    code: string;
    area: "luzon" | "visayas" | "mindanao"  ;
    address: string;
    status: "active" | "inactive";
}

export interface CreateBranchData {
    name: string;
    code: string;
    area: "luzon" | "visayas" | "mindanao";
    address: string;
    status: "active" | "inactive";
}

export interface UpdateBranchData {
    name: string;
    code: string;
    area: "luzon" | "visayas" | "mindanao";
    address: string;
    status: "active" | "inactive";
}

interface ApiCreateBranchResponse {
    success: boolean;
    message: string;
    data: {
        branch: Branch;
    };
}

interface ApiUpdateBranchResponse {
    success: boolean;
    message: string;
    data: {
        branch: Branch;
    };
}

interface ApiBranchesResponse {
    success: boolean;
    data: {
        branches: Branch[];
    };
}

interface ApiToggleBranchStatusResponse {
    success: boolean;
    message: string;
    data: {
        branch: Branch;
    };
}

interface ApiDeleteBranchResponse {
    success: boolean;
    message: string;
}

export interface ToggleBranchStatusResponse {
    success: boolean;
    message: string;
    branch: Branch;
}

export interface CreateBranchResponse {
    success: boolean;
    message: string;
    branch: Branch;
}

export interface UpdateBranchResponse {
    success: boolean;
    message: string;
    branch: Branch;
}

export interface DeleteBranchResponse {
    success: boolean;
    message: string;
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
 * Creates a new branch.
 */
export async function createBranch(
    branchData: CreateBranchData
): Promise<CreateBranchResponse> {
    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/branches`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
            body: JSON.stringify(branchData),
        }
    );

    const data: ApiCreateBranchResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to create branch."
        );
    }

    return {
        success: data.success,
        message: data.message,
        branch: data.data.branch,
    };
}

/**
 * Updates an existing branch.
 */
export async function updateBranch(
    branchId: number,
    branchData: UpdateBranchData
): Promise<UpdateBranchResponse> {
    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/branches/${branchId}`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
            body: JSON.stringify(branchData),
        }
    );

    const data: ApiUpdateBranchResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to update branch."
        );
    }

    return {
        success: data.success,
        message: data.message,
        branch: data.data.branch,
    };
}

/**
 * Soft deletes an existing branch.
 */
export async function deleteBranch(
    branchId: number
): Promise<DeleteBranchResponse> {
    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/branches/${branchId}`,
        {
            method: "DELETE",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
        }
    );

    const data: ApiDeleteBranchResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to delete branch."
        );
    }

    return {
        success: data.success,
        message: data.message,
    };
}

/**
 * Retrieves all branches.
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

    const data: ApiBranchesResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "Unable to retrieve branches."
        );
    }

    return data.data.branches;
}

/**
 * Toggles a branch's active status.
 */
export async function toggleBranchStatus(
    branchId: number
): Promise<ToggleBranchStatusResponse> {
    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/branches/${branchId}/status`,
        {
            method: "PATCH",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
        }
    );

    const data: ApiToggleBranchStatusResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to update branch status."
        );
    }

    return {
        success: data.success,
        message: data.message,
        branch: data.data.branch,
    };
}