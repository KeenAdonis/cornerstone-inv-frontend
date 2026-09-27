"use client";

import { Button } from "@/components/ui/button";

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

import { useDeleteWarehouse } from "@/src/hooks/warehouse/useDeleteWarehouse";

import type {
    Warehouse,
} from "@/src/services/warehouseService";

interface DeleteWarehouseDialogProps {
    warehouse: Warehouse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
}

export default function DeleteWarehouseDialog({
    warehouse,
    open,
    onOpenChange,
    onDeleted,
}: DeleteWarehouseDialogProps) {
    const {
        handleDeleteWarehouse,
        loading,
        error,
    } = useDeleteWarehouse();

    if (!warehouse) {
        return null;
    }

    const handleDelete = async () => {
        const response =
            await handleDeleteWarehouse(
                warehouse.id
            );

        if (!response) {
            return;
        }

        onDeleted?.();
        onOpenChange(false);
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <AlertDialogContent className="border-red-100 bg-white text-slate-900">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-slate-900">
                        Delete Warehouse
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-slate-500">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-slate-700">
                            {warehouse.name}
                        </span>
                        ? This warehouse will be removed
                        from the active warehouse list.
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
                            handleDelete();
                        }}
                        disabled={loading}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete Warehouse"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}