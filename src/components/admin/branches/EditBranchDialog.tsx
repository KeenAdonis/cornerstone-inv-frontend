"use client";

import {
    FormEvent,
    useEffect,
    useState,
} from "react";

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

import { useUpdateBranch } from "@/src/hooks/branches/useUpdateBranch";

import type {
    Branch,
    UpdateBranchData,
} from "@/src/services/branchService";

interface EditBranchDialogProps {
    branch: Branch | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdated?: () => void;
}

interface BranchFormData {
    name: string;
    code: string;
    area: string;
    address: string;
    status: string;
}

const emptyFormData: BranchFormData = {
    name: "",
    code: "",
    area: "",
    address: "",
    status: "active",
};

export default function EditBranchDialog({
    branch,
    open,
    onOpenChange,
    onUpdated,
}: EditBranchDialogProps) {
    const [formData, setFormData] =
        useState<BranchFormData>(
            emptyFormData
        );

    const {
        handleUpdateBranch,
        loading,
        error,
    } = useUpdateBranch();

    useEffect(() => {
        if (!branch) {
            setFormData(emptyFormData);
            return;
        }

        setFormData({
            name: branch.name,
            code: branch.code,
            area: branch.area,
            address: branch.address,
            status: branch.status,
        });
    }, [branch]);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            !branch ||
            !formData.name ||
            !formData.code ||
            !formData.area ||
            !formData.address
        ) {
            return;
        }

        const branchData: UpdateBranchData = {
            name: formData.name,
            code: formData.code,
            area:
                formData.area as UpdateBranchData["area"],
            address: formData.address,
            status:
                formData.status as UpdateBranchData["status"],
        };

        const response =
            await handleUpdateBranch(
                branch.id,
                branchData
            );

        if (!response) {
            return;
        }

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
                        Edit Branch
                    </DialogTitle>

                    <DialogDescription className="text-slate-500">
                        Update branch location and status
                        information.
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
                                htmlFor="edit-branch-name"
                                className="text-sm font-medium text-slate-700"
                            >
                                Branch Name
                            </label>

                            <Input
                                id="edit-branch-name"
                                type="text"
                                placeholder="Enter branch name"
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
                                htmlFor="edit-branch-code"
                                className="text-sm font-medium text-slate-700"
                            >
                                Branch Code
                            </label>

                            <Input
                                id="edit-branch-code"
                                type="text"
                                placeholder="e.g. BR-001"
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
                            htmlFor="edit-branch-address"
                            className="text-sm font-medium text-slate-700"
                        >
                            Exact Address
                        </label>

                        <textarea
                            id="edit-branch-address"
                            placeholder="Enter complete branch address"
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
                            disabled={loading || !branch}
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