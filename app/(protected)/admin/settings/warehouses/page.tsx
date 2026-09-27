"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import AddWarehouseDialog from "@/src/components/admin/warehouse/AddWarehouseDialog";
import WarehouseTable from "@/src/components/admin/warehouse/WarehouseTable";

import { useWarehouses } from "@/src/hooks/warehouse/useWarehouses";

export default function WarehousesPage() {
    const [isAddWarehouseOpen, setIsAddWarehouseOpen] =
        useState(false);

    const {
        warehouses,
        loading,
        error,
        refetch,
    } = useWarehouses();

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Warehouses
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Manage warehouse locations and
                        assignments.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() =>
                        setIsAddWarehouseOpen(true)
                    }
                    className="w-full rounded-md bg-blue-600 text-white shadow-sm hover:bg-blue-700 sm:w-auto"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Warehouse
                </Button>
            </div>

            {/* Warehouse Content */}
            {loading ? (
                <div className="rounded-lg border border-blue-100 bg-white px-6 py-12 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Loading warehouses...
                    </p>
                </div>
            ) : error ? (
                <div
                    className="rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center"
                    role="alert"
                >
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                </div>
            ) : (
                <WarehouseTable
                    warehouses={warehouses}
                    onWarehouseUpdated={refetch}
                />
            )}

            {/* Add Warehouse Dialog */}
            <AddWarehouseDialog
                open={isAddWarehouseOpen}
                onOpenChange={setIsAddWarehouseOpen}
                onCreated={refetch}
            />
        </div>
    );
}