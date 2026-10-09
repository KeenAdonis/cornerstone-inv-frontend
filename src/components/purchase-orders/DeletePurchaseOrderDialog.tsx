"use client";

import { useEffect } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
    useDeletePurchaseOrder,
} from "@/src/hooks/purchase-orders/useDeletePurchaseOrder";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

interface DeletePurchaseOrderDialogProps {
    purchaseOrder: PurchaseOrder | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
}

export default function DeletePurchaseOrderDialog({
    purchaseOrder,
    open,
    onOpenChange,
    onDeleted,
}: DeletePurchaseOrderDialogProps) {
    const {
        handleDeletePurchaseOrder,
        loading,
        error,
    } = useDeletePurchaseOrder();

    useEffect(() => {
        if (!open) {
            return;
        }
    }, [open]);

    if (!purchaseOrder) {
        return null;
    }

    const handleDelete = async () => {
        const success =
            await handleDeletePurchaseOrder(
                purchaseOrder.id
            );

        if (!success) {
            return;
        }

        onDeleted?.();
        onOpenChange(false);
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!loading) {
                    onOpenChange(nextOpen);
                }
            }}
        >
            <AlertDialogContent className="border-red-100 bg-white text-slate-900">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-slate-900">
                        Delete Purchase Order
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-slate-500">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-slate-700">
                            {purchaseOrder.reference_number}
                        </span>
                        ? This purchase order will be removed
                        from the active purchase order list.
                        Historical inventory records will be retained.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {error && (
                    <div
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={loading}
                        className="border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(event) => {
                            event.preventDefault();
                            void handleDelete();
                        }}
                        disabled={loading}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete Purchase Order"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}