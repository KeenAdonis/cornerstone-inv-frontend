"use client";

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

import { useDeleteUser } from "@/src/hooks/user/useDeleteUser";

import type { User } from "@/src/services/userService";

interface UserDeleteDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted?: () => void;
}

export default function UserDeleteDialog({
    user,
    open,
    onOpenChange,
    onDeleted,
}: UserDeleteDialogProps) {
    const {
        handleDeleteUser,
        loading,
        error,
    } = useDeleteUser();

    if (!user) {
        return null;
    }

    const handleDelete = async () => {
        const response =
            await handleDeleteUser(user.id);

        if (!response) {
            return;
        }

        onDeleted?.();
        onOpenChange(false);
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen && loading) {
                    return;
                }

                onOpenChange(nextOpen);
            }}
        >
            <AlertDialogContent className="border-blue-100 bg-white text-slate-900">
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete User?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-slate-500">
                        Are you sure you want to delete{" "}
                        <span className="font-medium text-slate-900">
                            {user.name}
                        </span>
                        ? This user will no longer appear in
                        the user list.
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
                        className="border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={(event) => {
                            event.preventDefault();
                            handleDelete();
                        }}
                        disabled={loading}
                        className="bg-red-600 text-white hover:bg-red-500"
                    >
                        {loading
                            ? "Deleting..."
                            : "Delete User"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}