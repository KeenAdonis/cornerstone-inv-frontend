import {
    LayoutDashboard,
    Package,
    Settings,
    Tags,
    Users,
    Warehouse,
    Logs,
} from "lucide-react";

export type UserRole =
    | "admin"
    | "warehouse_coordinator"
    | "branch_coordinator";

export interface NavigationItem {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
}

const adminNavigation: NavigationItem[] = [
    {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Inventory",
        href: "/admin/inventory",
        icon: Package,
    },
    {
        label: "Purchase Orders",
        href: "/admin/purchase-orders",
        icon: Package,
    },
    {
        label: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
    {
        label: "Activity Logs",
        href: "/admin/activity-logs",
        icon: Logs,
    },
];

const warehouseNavigation: NavigationItem[] = [
    {
        label: "Dashboard",
        href: "/warehouse-coordinator/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Products",
        href: "/warehouse-coordinator/products",
        icon: Package,
    },
    {
        label: "Categories",
        href: "/warehouse-coordinator/categories",
        icon: Tags,
    },
    {
        label: "Inventory",
        href: "/warehouse-coordinator/inventory",
        icon: Warehouse,
    },
    {
        label: "Purchase Orders",
        href: "/warehouse-coordinator/purchase-orders",
        icon: Package,
    },
    {
        label: "Activity Logs",
        href: "/warehouse-coordinator/activity-logs",
        icon: Logs,
    },
];

const branchNavigation: NavigationItem[] = [
    {
        label: "Dashboard",
        href: "/branch-coordinator/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Inventory",
        href: "/branch-coordinator/inventory",
        icon: Package,
    },
    {
        label: "Purchase Orders",
        href: "/branch-coordinator/purchase-orders",
        icon: Package,
    },
    {
        label: "Activity Logs",
        href: "/branch-coordinator/activity-logs",
        icon: Logs,
    },
];

export function getNavigationItems(
    role: UserRole
): NavigationItem[] {
    switch (role) {
        case "warehouse_coordinator":
            return warehouseNavigation;

        case "branch_coordinator":
            return branchNavigation;

        case "admin":
        default:
            return adminNavigation;
    }
}