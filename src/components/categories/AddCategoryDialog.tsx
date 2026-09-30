"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
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

import { useCreateCategory } from "@/src/hooks/categories/useCreateCategory";
import type {
    CreateCategoryData,
} from "@/src/services/categoryService";

interface AddCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: () => void;
}

interface CategoryFormData {
    name: string;
    description: string;
    status: string;
}

const initialFormData: CategoryFormData = {
    name: "",
    description: "",
    status: "active",
};

export default function AddCategoryDialog({
    open,
    onOpenChange,
    onCreated,
}: AddCategoryDialogProps) {
    const [formData, setFormData] =
        useState<CategoryFormData>(initialFormData);

    const {
        create,
        loading,
        error,
    } = useCreateCategory();

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!formData.name.trim()) {
            return;
        }

        const categoryData: CreateCategoryData = {
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
            status:
                formData.status as CreateCategoryData["status"],
        };

        const response = await create(categoryData);

        if (!response) {
            return;
        }

        onCreated?.();

        setFormData(initialFormData);
        onOpenChange(false);
    };

    const handleOpenChange = (value: boolean) => {
        if (!value && !loading) {
            setFormData(initialFormData);
        }

        onOpenChange(value);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent className="border-blue-100 bg-white text-slate-900 sm:max-w-xl">
                <DialogHeader className="border-b border-blue-100 pb-4">
                    <DialogTitle className="text-slate-900">
                        Add Category
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Create a new product category for the
                        inventory system.
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
                            htmlFor="category-name"
                            className="text-sm font-medium text-slate-700"
                        >
                            Category Name
                        </label>

                        <Input
                            id="category-name"
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
                            htmlFor="category-description"
                            className="text-sm font-medium text-slate-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="category-description"
                            placeholder="Enter category description"
                            rows={4}
                            value={formData.description}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    description: event.target.value,
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
                                handleOpenChange(false)
                            }
                            disabled={loading}
                            className="border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Category"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}