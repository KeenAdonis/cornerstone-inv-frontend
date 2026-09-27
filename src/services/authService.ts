import {
    API_BASE_URL,
    API_ORIGIN,
} from "@/src/lib/api";

export interface LoginCredentials {
    email: string;
    password: string;
}

export type UserRole =
    | "admin"
    | "warehouse_coordinator"
    | "branch_coordinator";

export interface AuthBranch {
    id: number;
    name: string;
    code: string;
    area: "luzon" | "visayas" | "mindanao";
    address: string;
    status: "active" | "inactive";
}

export interface AuthWarehouse {
    id: number;
    name: string;
    code: string;
    status: "active" | "inactive";
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    branch_id: number | null;
    warehouse_id: number | null;
    assigned_branches: AuthBranch[];
    assigned_warehouses: AuthWarehouse[];
}

interface ApiLoginResponse {
    success: boolean;
    message: string;
    data: {
        user: AuthUser;
    };
}

export interface LoginResponse {
    success: boolean;
    message: string;
    user: AuthUser;
}

/**
 * Gets the Laravel Sanctum CSRF cookie.
 */
async function getCsrfCookie(): Promise<void> {
    const response = await fetch(
        `${API_ORIGIN}/sanctum/csrf-cookie`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error(
            "Unable to initialize secure authentication."
        );
    }
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
 * Authenticates the user using Laravel
 * Sanctum session-based authentication.
 */
export async function login(
    credentials: LoginCredentials
): Promise<LoginResponse> {
    await getCsrfCookie();

    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/login`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
            body: JSON.stringify(credentials),
        }
    );

    const data: ApiLoginResponse =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to sign in."
        );
    }

    return {
        success: data.success,
        message: data.message,
        user: data.data.user,
    };
}

/**
 * Retrieves the currently authenticated user
 * from the Laravel session.
 */
export async function getAuthenticatedUser(): Promise<AuthUser> {
    const response = await fetch(
        `${API_BASE_URL}/user`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Unauthenticated.");
    }

    const data: {
        success: boolean;
        data: {
            user: AuthUser;
        };
    } = await response.json();

    return data.data.user;
}

/**
 * Logs out the current user and invalidates
 * the Laravel session.
 */
export async function logout(): Promise<void> {
    const xsrfToken = getXsrfToken();

    if (!xsrfToken) {
        throw new Error(
            "Unable to initialize CSRF protection."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/logout`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "X-XSRF-TOKEN": xsrfToken,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Unable to log out.");
    }
}