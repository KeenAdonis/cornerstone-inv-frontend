"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

import { Button } from "@/components/ui/button";

import { toast } from "@/components/ui/toast";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useUpdateCategory } from "@/src/hooks/categories/useUpdateCategory";

import type {
    Category,
    UpdateCategoryData,
} from "@/src/services/categoryService";

interface EditCategoryDialogProps {
    category: Category | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdated?: () => void;
}

interface CategoryFormData {
    name: string;
    description: string;
    status: string;
}

const emptyFormData: CategoryFormData = {
    name: "",
    description: "",
    status: "active",
};

export default function EditCategoryDialog({
    category,
    open,
    onOpenChange,
    onUpdated,
}: EditCategoryDialogProps) {
    const [formData, setFormData] =
        useState<CategoryFormData>(
            emptyFormData
        );

    const {
        update,
        loading,
        error,
    } = useUpdateCategory();

    useEffect(() => {
        if (!category) {
            setFormData(emptyFormData);
            return;
        }

        setFormData({
            name: category.name,
            description: category.description ?? "",
            status: category.status,
        });
    }, [category]);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            !category ||
            !formData.name.trim()
        ) {
            return;
        }

        const categoryData: UpdateCategoryData = {
            name: formData.name.trim(),
            description:
                formData.description.trim() || undefined,
            status:
                formData.status as UpdateCategoryData["status"],
        };

        const response = await update(
            category.id,
            categoryData
        );

        if (!response) {
            return;
        }

        toast.add({
            title: "Category Updated",
            description:
                "Category has been updated successfully.",
            type: "success",
        });

        onUpdated?.();
        onOpenChange(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="border-blue-100 bg-white text-slate-900 sm:max-w-xl">
                <DialogHeader className="border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Edit Category
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Update category information and
                        status.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {error && (
                        <div
                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label
                            htmlFor="edit-category-name"
                            className="text-sm font-medium text-slate-700"
                        >
                            Category Name
                        </label>

                        <Input
                            id="edit-category-name"
                            type="text"
                            placeholder="Enter category name"
                            value={formData.name}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    name: event.target.value,
                                })
                            }
                            required
                            disabled={loading}
                            className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="edit-category-description"
                            className="text-sm font-medium text-slate-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="edit-category-description"
                            placeholder="Enter category description"
                            rows={4}
                            value={formData.description}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    description:
                                        event.target.value,
                                })
                            }
                            disabled={loading}
                            className="flex w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-blue-400 focus:ring-1 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Status
                        </label>

                        <Select
                            value={formData.status}
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    status: value ?? "active",
                                })
                            }
                            disabled={loading}
                        >
                            <SelectTrigger className="w-full border-slate-200 bg-white text-slate-900 focus:ring-blue-100">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="active">
                                    Active
                                </SelectItem>

                                <SelectItem value="inactive">
                                    Inactive
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="border-t border-blue-100 bg-blue-50/60 pt-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                onOpenChange(false)
                            }
                            disabled={loading}
                            className="border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={loading || !category}
                            className="bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        >
                            {loading
                                ? "Saving..."
                                : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}