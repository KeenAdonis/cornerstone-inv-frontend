"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { toast } from "@/components/ui/toast";

import PurchaseOrderTable from "@/src/components/purchase-orders/PurchaseOrderTable";
import ViewPurchaseOrderDialog from "@/src/components/purchase-orders/ViewPurchaseOrderDialog";
import ViewPurchaseOrderAttachmentDialog from "@/src/components/purchase-orders/ViewPurchaseOrderAttachmentDialog";

import CreatePurchaseOrderDialog from "@/src/components/branch-coordinator/purchase-orders/CreatePurchaseOrderDialog";
import CompletePurchaseOrderDialog from "@/src/components/purchase-orders/CompletePurchaseOrderDialog";

import { usePurchaseOrders } from "@/src/hooks/purchase-orders/usePurchaseOrders";
import { useDeliverPurchaseOrder } from "@/src/hooks/purchase-orders/useDeliverPurchaseOrder";

import type {
    PurchaseOrder,
} from "@/src/services/purchaseOrderService";

export default function PurchaseOrdersPage() {
    const [
        createPurchaseOrderOpen,
        setCreatePurchaseOrderOpen,
    ] = useState(false);

    const [
        selectedPurchaseOrder,
        setSelectedPurchaseOrder,
    ] = useState<PurchaseOrder | null>(
        null
    );

    const [
        attachmentPurchaseOrder,
        setAttachmentPurchaseOrder,
    ] = useState<PurchaseOrder | null>(
        null
    );

    const [
        deliveryPurchaseOrder,
        setDeliveryPurchaseOrder,
    ] = useState<PurchaseOrder | null>(
        null
    );

    const {
        purchaseOrders,
        loading,
        error,
        refetch,
    } = usePurchaseOrders();

    const {
        deliver,
        loading: delivering,
        error: deliverError,
        resetError: resetDeliverError,
    } = useDeliverPurchaseOrder();

    const handlePurchaseOrderCreated =
        async () => {
            await refetch();
        };

    const handleDeliver = async (
        deliveryPhoto: File,
        dateOfArrival: string
    ) => {
        if (!deliveryPurchaseOrder) {
            return;
        }
    
        const updatedPurchaseOrder =
            await deliver(
                deliveryPurchaseOrder.id,
                deliveryPhoto,
                dateOfArrival
            );
        
        if (!updatedPurchaseOrder) {
            return;
        }
    
        toast.add({
            title: "Purchase Order Delivered",
            description:
                "Purchase order has been marked as delivered successfully.",
            type: "success",
        });
    
        setDeliveryPurchaseOrder(null);
    
        await refetch();
    };

    const handleDeliveryDialogChange = (
        open: boolean
    ) => {
        if (open) {
            return;
        }

        setDeliveryPurchaseOrder(null);
        resetDeliverError();
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Purchase Orders
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Create and monitor purchase order requests for your branch.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={() =>
                        setCreatePurchaseOrderOpen(
                            true
                        )
                    }
                    className="w-full rounded-sm bg-blue-600 text-white shadow-sm hover:bg-blue-700 sm:w-auto"
                >
                    <Plus className="h-4 w-4" />

                    Create Purchase Order
                </Button>
            </div>

            {/* Purchase Orders */}
            {loading ? (
                <div className="rounded-lg border border-blue-100 bg-white px-6 py-12 text-center shadow-sm">
                    <p className="text-sm text-slate-500">
                        Loading purchase orders...
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
                <PurchaseOrderTable
                    purchaseOrders={
                        purchaseOrders
                    }
                    onView={
                        setSelectedPurchaseOrder
                    }
                    onViewAttachment={
                        setAttachmentPurchaseOrder
                    }
                    onDeliver={
                        setDeliveryPurchaseOrder
                    }
                />
            )}

            {/* View Purchase Order Dialog */}
            <ViewPurchaseOrderDialog
                purchaseOrder={
                    selectedPurchaseOrder
                }
                open={
                    selectedPurchaseOrder !==
                    null
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setSelectedPurchaseOrder(
                            null
                        );
                    }
                }}
            />

            {/* View Purchase Order Attachment Dialog */}
            <ViewPurchaseOrderAttachmentDialog
                purchaseOrder={
                    attachmentPurchaseOrder
                }
                open={
                    attachmentPurchaseOrder !==
                    null
                }
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setAttachmentPurchaseOrder(
                            null
                        );
                    }
                }}
            />

            {/* Confirm Delivery Dialog */}
            <CompletePurchaseOrderDialog
                purchaseOrder={
                    deliveryPurchaseOrder
                }
                open={
                    deliveryPurchaseOrder !==
                    null
                }
                onOpenChange={
                    handleDeliveryDialogChange
                }
                onComplete={
                    handleDeliver
                }
                completing={
                    delivering
                }
                error={
                    deliverError
                }
            />

            {/* Create Purchase Order Dialog */}
            <CreatePurchaseOrderDialog
                open={
                    createPurchaseOrderOpen
                }
                onOpenChange={
                    setCreatePurchaseOrderOpen
                }
                onCreated={
                    handlePurchaseOrderCreated
                }
            />
        </div>
    );
}