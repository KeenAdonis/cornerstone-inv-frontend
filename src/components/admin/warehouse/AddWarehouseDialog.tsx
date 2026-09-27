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

import { useCreateWarehouse } from "@/src/hooks/warehouse/useCreateWarehouse";
import type {
    CreateWarehouseData,
} from "@/src/services/warehouseService";

interface AddWarehouseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: () => void;
}

interface WarehouseFormData {
    name: string;
    code: string;
    area: string;
    address: string;
    status: string;
}

const initialFormData: WarehouseFormData = {
    name: "",
    code: "",
    area: "",
    address: "",
    status: "active",
};

export default function AddWarehouseDialog({
    open,
    onOpenChange,
    onCreated,
}: AddWarehouseDialogProps) {
    const [formData, setFormData] =
        useState<WarehouseFormData>(initialFormData);

    const {
        handleCreateWarehouse,
        loading,
        error,
    } = useCreateWarehouse();

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            !formData.name ||
            !formData.code ||
            !formData.area ||
            !formData.address
        ) {
            return;
        }

        const warehouseData: CreateWarehouseData = {
            name: formData.name,
            code: formData.code,
            area:
                formData.area as CreateWarehouseData["area"],
            address: formData.address,
            status:
                formData.status as CreateWarehouseData["status"],
        };

        const response =
            await handleCreateWarehouse(warehouseData);

        if (!response) {
            return;
        }

        onCreated?.();

        setFormData(initialFormData);
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
                        Add Warehouse
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Create a new warehouse location for
                        the inventory system.
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

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="warehouse-name"
                                className="text-sm font-medium text-slate-700"
                            >
                                Warehouse Name
                            </label>

                            <Input
                                id="warehouse-name"
                                type="text"
                                placeholder="Enter warehouse name"
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
                                htmlFor="warehouse-code"
                                className="text-sm font-medium text-slate-700"
                            >
                                Warehouse Code
                            </label>

                            <Input
                                id="warehouse-code"
                                type="text"
                                placeholder="e.g. WH-001"
                                value={formData.code}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        code: event.target.value,
                                    })
                                }
                                required
                                disabled={loading}
                                className="border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                            Area
                        </label>

                        <Select
                            value={formData.area}
                            onValueChange={(value) =>
                                setFormData({
                                    ...formData,
                                    area: value ?? "",
                                })
                            }
                            disabled={loading}
                        >
                            <SelectTrigger className="w-full border-slate-200 bg-white text-slate-900 focus:ring-blue-100">
                                <SelectValue placeholder="Select area" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="luzon">
                                    Luzon
                                </SelectItem>

                                <SelectItem value="visayas">
                                    Visayas
                                </SelectItem>

                                <SelectItem value="mindanao">
                                    Mindanao
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="warehouse-address"
                            className="text-sm font-medium text-slate-700"
                        >
                            Exact Address
                        </label>

                        <textarea
                            id="warehouse-address"
                            placeholder="Enter complete warehouse address"
                            rows={4}
                            value={formData.address}
                            onChange={(event) =>
                                setFormData({
                                    ...formData,
                                    address: event.target.value,
                                })
                            }
                            required
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
                            disabled={loading}
                            className="bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Warehouse"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}