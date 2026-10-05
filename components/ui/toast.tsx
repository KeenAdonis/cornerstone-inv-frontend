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

function ToastProvider({
    ...props
}: ToastPrimitive.Provider.Props) {
    return (
        <ToastPrimitive.Provider
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
                "fixed left-1/2 top-6 z-[100] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-3 outline-none",
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
    return (
        <ToastPrimitive.Root
            toast={toast}
            className={cn(
                "group relative flex w-full items-start gap-3 overflow-hidden rounded-xl border bg-white p-4 text-slate-900 shadow-lg",
                toast.type === "success" &&
                    "border-emerald-300 ring-1 ring-emerald-200",
                toast.type === "error" &&
                    "border-red-300 ring-1 ring-red-200",
                toast.type === "warning" &&
                    "border-amber-300 ring-1 ring-amber-200",
                toast.type === "info" &&
                    "border-blue-300 ring-1 ring-blue-200",
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
        />
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
                "text-sm font-semibold text-slate-900",
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
                "shrink-0 rounded-md p-1 text-slate-400 opacity-100 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300",
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
    let icon: React.ReactNode = null;

    if (type === "success") {
        icon = (
            <CircleCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        );
    }

    if (type === "info") {
        icon = (
            <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
        );
    }

    if (type === "warning") {
        icon = (
            <TriangleAlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        );
    }

    if (type === "error") {
        icon = (
            <OctagonXIcon className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
        );
    }

    if (type === "loading") {
        icon = (
            <Loader2Icon className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-slate-500" />
        );
    }

    return icon;
}

function ToastList() {
    const {
        toasts,
    } = ToastPrimitive.useToastManager();

    return (
        <>
            {toasts.map(
                (toastItem) => (
                    <Toast
                        key={toastItem.id}
                        toast={toastItem}
                    >
                        <ToastContent>
                            <ToastIcon
                                type={
                                    toastItem.type
                                }
                            />

                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                                <ToastTitle />

                                <ToastDescription />
                            </div>

                            <ToastAction />

                            <ToastClose />
                        </ToastContent>
                    </Toast>
                )
            )}
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