import {
    API_BASE_URL,
} from "@/src/lib/api";

import type { Branch } from "@/src/services/branchService";
import type { Warehouse } from "@/src/services/warehouseService";

export type UserRole =
    | "admin"
    | "branch_coordinator"
    | "warehouse_coordinator";

export type UserStatus =
    | "active"
    | "inactive";

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: UserRole;

    branch_id: number | null;
    warehouse_id: number | null;

    branch_ids: number[];
    warehouse_ids: number[];

    status: UserStatus;
}

export interface UpdateUserData {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    role: UserRole;

    branch_id: number | null;
    warehouse_id: number | null;

    branch_ids: number[];
    warehouse_ids: number[];

    status: UserStatus;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;

    branch_id: number | null;
    warehouse_id: number | null;

    branch: Branch | null;
    warehouse: Warehouse | null;

    assigned_branches: Branch[];
    assigned_warehouses: Warehouse[];

    status: UserStatus;
}

interface ApiCreateUserResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
}

interface ApiGetUsersResponse {
    success: boolean;
    data: {
        users: User[];
    };
}

interface ApiUpdateUserResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
}

interface ApiToggleUserStatusResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
}

export interface CreateUserResponse {
    success: boolean;
    message: string;
    user: User;
}

export interface UpdateUserResponse {
    success: boolean;
    message: string;
    user: User;
}

export interface ToggleUserStatusResponse {
    success: boolean;
    message: string;
    user: User;
}

interface ApiDeleteUserResponse {
    success: boolean;
    message: string;
}

export interface DeleteUserResponse {
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
 * Creates a new system user.
 */
export async function createUser(
    userData: CreateUserData
): Promise<CreateUserResponse> {
    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/users`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
            body: JSON.stringify(userData),
        }
    );

    const data: ApiCreateUserResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to create user."
        );
    }

    return {
        success: data.success,
        message: data.message,
        user: data.data.user,
    };
}

/**
 * Retrieves all system users.
 */
export async function getUsers(): Promise<User[]> {
    const response = await fetch(
        `${API_BASE_URL}/users`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
        }
    );

    const data: ApiGetUsersResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            "Unable to retrieve users."
        );
    }

    return data.data.users;
}

/**
 * Updates an existing system user.
 */
export async function updateUser(
    userId: number,
    userData: UpdateUserData
): Promise<UpdateUserResponse> {
    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/users/${userId}`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
            body: JSON.stringify(userData),
        }
    );

    const data: ApiUpdateUserResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to update user."
        );
    }

    return {
        success: data.success,
        message: data.message,
        user: data.data.user,
    };
}

/**
 * Toggles a system user's active status.
 */
export async function toggleUserStatus(
    userId: number
): Promise<ToggleUserStatusResponse> {
    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/users/${userId}/status`,
        {
            method: "PATCH",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
        }
    );

    const data: ApiToggleUserStatusResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to update user status."
        );
    }

    return {
        success: data.success,
        message: data.message,
        user: data.data.user,
    };
}

/**
 * Soft deletes a system user.
 */
export async function deleteUser(
    userId: number
): Promise<DeleteUserResponse> {
    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/users/${userId}`,
        {
            method: "DELETE",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
        }
    );

    const data: ApiDeleteUserResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to delete user."
        );
    }

    return {
        success: data.success,
        message: data.message,
    };
}