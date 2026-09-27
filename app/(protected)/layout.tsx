import type { ReactNode } from "react";

import AppLayout from "@/src/components/layout/AppLayout";

interface ProtectedLayoutProps {
    children: ReactNode;
}

export default function ProtectedLayout({
    children,
}: ProtectedLayoutProps) {
    return (
        <AppLayout>
            {children}
        </AppLayout>
    );
}