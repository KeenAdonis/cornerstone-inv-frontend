
"use client";

import * as React from "react";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";

import { cn } from "cn";

import { Button } from "@/components/ui/button";

import {
    XIcon,
    CircleCheckIcon,
    InfoIcon,
    TriangleAlertIcon,
    OctagonXIcon,
    Loader2Icon,
} from "lucide-react";

const toast = ToastPrimitive.createToastManager();

const TOAST_DURATION = {
    success: 4000,
    info: 4000,
    warning: 5000,
    error: 6000,
    loading: Infinity,
} as const;

function getToastDuration(
    type: string | undefined
): number {
    if (
        type &&
        type in TOAST_DURATION
    ) {
        return TOAST_DURATION[
            type as keyof typeof TOAST_DURATION
        ];
    }

    return 4000;
}

function ToastProvider({
    ...props
}: ToastPrimitive.Provider.Props) {
    return (
        <ToastPrimitive.Provider
            timeout={4000}
            {...props}
        />
    );
}

function ToastPortal({
    ...props
}: ToastPrimitive.Portal.Props) {
    return (
        <ToastPrimitive.Portal
            {...props}
        />
    );
}

function ToastViewport({
    className,
    ...props
}: ToastPrimitive.Viewport.Props) {
    return (
        <ToastPrimitive.Viewport
            className={cn(
                "fixed left-1/2 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2 flex-col gap-3 outline-none sm:top-6",
                className
            )}
            {...props}
        />
    );
}

function Toast({
    className,
    toast,
    ...props
}: ToastPrimitive.Root.Props & {
    toast: ToastPrimitive.Root.ToastObject;
}) {
    const duration = getToastDuration(
        toast.type
    );

    const progressColor =
        toast.type === "success"
            ? "bg-emerald-500"
            : toast.type === "error"
              ? "bg-red-500"
              : toast.type === "warning"
                ? "bg-amber-500"
                : toast.type === "info"
                  ? "bg-blue-500"
                  : "bg-slate-500";

    return (
        <ToastPrimitive.Root
            toast={toast}
            className={cn(
                "group relative flex w-full flex-col overflow-hidden rounded-xl bg-white text-slate-900 shadow-[0_6px_18px_rgba(15,23,42,0.12)]",
                "data-[swipe=cancel]:translate-x-0",
                "data-[swipe=end]:translate-x-[var(--toast-swipe-end-x)]",
                "data-[swipe=move]:translate-x-[var(--toast-swipe-move-x)]",
                "data-[swipe=move]:transition-none",
                "data-[starting-style]:translate-y-[-0.5rem] data-[starting-style]:opacity-0",
                "data-[ending-style]:translate-y-[-0.5rem] data-[ending-style]:opacity-0",
                "transition-[translate,opacity] duration-200",
                className
            )}
            {...props}
        >
            <div className="flex w-full items-start gap-3 px-5 py-5">
                <ToastContent>
                    <ToastIcon
                        type={toast.type}
                    />

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <ToastTitle />

                        <ToastDescription />
                    </div>

                    <ToastAction />

                    <ToastClose />
                </ToastContent>
            </div>

            
{Number.isFinite(duration) && (
    <div
        className="px-6 pb-0"
        aria-hidden="true"
    >
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div
                className={cn(
                    "h-full origin-left rounded-full animate-toast-progress",
                    progressColor
                )}
                style={{
                    animationDuration: `${duration}ms`,
                }}
            />
        </div>
    </div>
)}

        </ToastPrimitive.Root>
    );
}

function ToastContent({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "flex min-w-0 flex-1 items-start gap-3",
                className
            )}
            {...props}
        />
    );
}

function ToastTitle({
    className,
    ...props
}: ToastPrimitive.Title.Props) {
    return (
        <ToastPrimitive.Title
            className={cn(
                "text-sm font-semibold leading-5 text-slate-900",
                className
            )}
            {...props}
        />
    );
}

function ToastDescription({
    className,
    ...props
}: ToastPrimitive.Description.Props) {
    return (
        <ToastPrimitive.Description
            className={cn(
                "text-sm leading-5 text-slate-500",
                className
            )}
            {...props}
        />
    );
}

function ToastAction({
    className,
    ...props
}: ToastPrimitive.Action.Props) {
    return (
        <ToastPrimitive.Action
            render={
                <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                />
            }
            className={cn(
                "shrink-0",
                className
            )}
            {...props}
        />
    );
}

function ToastClose({
    className,
    ...props
}: ToastPrimitive.Close.Props) {
    return (
        <ToastPrimitive.Close
            className={cn(
                "shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300",
                className
            )}
            {...props}
        >
            <XIcon className="h-4 w-4" />

            <span className="sr-only">
                Close
            </span>
        </ToastPrimitive.Close>
    );
}

function ToastIcon({
    type,
}: {
    type: string | undefined;
}) {
    if (type === "success") {
        return (
            <CircleCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        );
    }

    if (type === "info") {
        return (
            <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        );
    }

    if (type === "warning") {
        return (
            <TriangleAlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        );
    }

    if (type === "error") {
        return (
            <OctagonXIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        );
    }

    if (type === "loading") {
        return (
            <Loader2Icon className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-slate-500" />
        );
    }

    return null;
}

function ToastList() {
    const {
        toasts,
    } = ToastPrimitive.useToastManager();

    return (
        <>
            {toasts.map((toastItem) => (
                <Toast
                    key={toastItem.id}
                    toast={toastItem}
                />
            ))}
        </>
    );
}

function Toaster({
    children,
    toastManager = toast,
    ...props
}: ToastPrimitive.Provider.Props) {
    return (
        <ToastProvider
            toastManager={toastManager}
            {...props}
        >
            {children}

            <ToastPortal>
                <ToastViewport>
                    <ToastList />
                </ToastViewport>
            </ToastPortal>
        </ToastProvider>
    );
}

const createToastManager =
    ToastPrimitive.createToastManager;

const useToastManager =
    ToastPrimitive.useToastManager;

export {
    Toaster,
    ToastProvider,
    ToastPortal,
    ToastViewport,
    Toast,
    ToastContent,
    ToastTitle,
    ToastDescription,
    ToastAction,
    ToastClose,
    ToastIcon,
    ToastList,
    createToastManager,
    useToastManager,
    toast,
};
